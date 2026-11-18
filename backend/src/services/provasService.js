const provaFinalModel = require('../models/provasModel');
const atividadesModel = require('../models/atividadesModel');
const qaModel = require('../models/questoesAlternativasModel');
const validacoes = require('../utils/validacoes');
const materiasModel = require('../models/materiasModel');

class ProvasService {
    calcularMedia(notas) {
        if (!notas || notas.length === 0) {
            return 0;
        }
        
        // "reduz" os valores, somando cada nota da atividade presente no objeto (nesse caso)
        const soma = notas.reduce((total, atividade) => {return total + atividade.nota;}, 0);

        // arredondando para não gerar um numero gigante 
        return Number((soma / notas.length).toFixed(2));
    }
    embaralhar(lista) {
        const array = [...lista];

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j] ] = [ array[j], array[i]];
        }

        return array;
    }
    removerRepetidas(lista, idsIgnorados) {
        if (!idsIgnorados || idsIgnorados.length === 0) {
            return lista;
        }

        return lista.filter(questao => !idsIgnorados.includes(questao.id_questao));
    }
    selecionarQuestao(lista, niveis) {
        const disponiveis = lista.filter(questao => niveis.includes(questao.nivel));

        if (disponiveis.length === 0) {
            return null;
        }

        const indice = Math.floor(Math.random() * disponiveis.length);

        const escolhida = disponiveis[indice];

        const indiceOriginal = lista.findIndex(questao => questao.id_questao === escolhida.id_questao);

        lista.splice(indiceOriginal,1);

        return escolhida;
    }
    async buscarQuestoesCompletas(listaQuestoes) {
        return await qaModel.buscarVariasQA(listaQuestoes);
    }
    async gerarProva(idSave) {
        idSave = validacoes.validarId(idSave);

        const materias = await materiasModel.buscarMaterias();
        materias.sort((a, b) => a.ordem - b.ordem);

        // Verifica se já existe prova
        const provaExistente = await provaFinalModel.buscarProvaPorSave(idSave);

        if (provaExistente) {
            if (provaExistente.realizada){
                throw new Error("O desafio final já foi realizado.");
            }
            
            // Caso tenha sido criada, mas ainda não foi finalizada, continua ela
            const questoes = await this.buscarQuestoesProva(provaExistente.id_prova);

            return {
                ...provaExistente,
                questoes
            };
        }
        
        // vonfere se todas as matérias foram concluídas
        const liberada = await this.verificarLiberacaoProva(idSave, materias);

        if (!liberada) {
            throw new Error("O desafio final ainda não está liberado.");
        }

        /*
            Busca questões disponíveis de todas as matérias

            Níveis:
            Médio -> 3,4
            Difícil -> 5,6,7
        */
        let questoesDisponiveis = [];

        for (const materia of materias) {
            const questoes = await qaModel.buscarNivel(materia.id_materia, [
                        3,
                        4,
                        5,
                        6,
                        7
                    ]);

            questoesDisponiveis.push(...questoes);
        }
        
        // remove questões utilizadas anteriormente nas atividades
        const idsUsados = await atividadesModel.buscarIdsQuestoesUtilizadas(idSave);

        questoesDisponiveis = this.removerRepetidas(questoesDisponiveis, idsUsados);
        
        // garante uma questão de cada matéria
        const selecionadas = [];

        for(const materia of materias){
            const questoesMateria = questoesDisponiveis.filter(questao => questao.id_materia === 
                materia.id_materia);

            const questao = this.selecionarQuestao(questoesMateria, [
                        3,
                        4,
                        5,
                        6,
                        7
                    ]);

            if (!questao) {
                throw new Error(`Não existem questões suficientes para a matéria ${materia.id_materia}.`);
            }

            selecionadas.push(questao);
        }

        // Completa até 10 questões
        while(selecionadas.length < 10){
            const questao = this.selecionarQuestao(questoesDisponiveis, [
                        3,
                        4,
                        5,
                        6,
                        7
                    ]);

            if (!questao) {
                throw new Error("Não existem questões suficientes para gerar a prova.");
            }

            selecionadas.push(questao);
        }

        const questoesOrdenadas = this.embaralhar(selecionadas);
        
        // cria prova no banco
        const prova = await provaFinalModel.criarProva(idSave);
        
        // salva relação prova x questões
        for(let i = 0; i < questoesOrdenadas.length; i++){
            await provaFinalModel.salvarQuestaoProva(questoesOrdenadas[i].id_questao, prova.id_prova, i + 1);
        }

        return {
            ...prova,
            questoes: await this.buscarQuestoesProva(prova.id_prova)
        };
    }
    async buscarQuestoesProva(idProva){
        idProva = validacoes.validarId(idProva);

        const relacoes = await provaFinalModel.buscarQuestoesProva(idProva);
            
        if(!relacoes || relacoes.length === 0){
            throw new Error("Nenhuma questão encontrada para essa prova.");
        }
                
        const questoesBase = relacoes.map(item => ({
            id_questao:item.id_questao
        }));

        const questoes = await qaModel.buscarVariasQA(questoesBase);

        return relacoes.map(relacao => {
                const questao = questoes.find(q => q.id_questao === relacao.id_questao);

                return {
                    ...questao,
                    ordem: relacao.ordem,
                    acertou: relacao.acertou
                };
            });
    }
    async registrarResposta(idProva, idQuestao, acertou){
        idProva = validacoes.validarId(idProva);
        idQuestao = validacoes.validarId(idQuestao);

        if(typeof acertou !== "boolean"){
            throw new Error("Resposta inválida.");
        }

        return await provaFinalModel.atualizarResposta(idProva, idQuestao, acertou);
    }
    async corrigirProva(idProva){
        idProva = validacoes.validarId(idProva);

        const prova = await provaFinalModel.buscarProva(idProva);

        if(prova.realizada){
            throw new Error("Essa prova já foi finalizada.");
        }
        const questoes = await provaFinalModel.buscarQuestoesProva(idProva);
        
        const acertos = questoes.filter(questao => questao.acertou === true).length;

        const notaProva = acertos;

        const notasAtividades = await atividadesModel.buscarNotasAtividades(prova.id_save);
        const mediaAtividades = this.calcularMedia(notasAtividades);

        const mediaFinal = Number(((mediaAtividades + notaProva)/2).toFixed(2));

        const resultado = mediaFinal >= 8? "GOOD_ENDING" : "BAD_ENDING";

        await provaFinalModel.finalizarProva(idProva, {
                nota:notaProva,        
                resultado
            });

        return {
            notaProva,
            mediaAtividades,
            mediaFinal,
            resultado
        };
    }
    async verificarLiberacaoProva(idSave, materias){
        const atividades = await atividadesModel.buscarTodasAtividadesSave(idSave);

        return materias.every(materia => {
                const atividade =atividades.filter(item => item.id_materia === materia.id_materia).sort(
                    (a,b)=> b.id_atividade - a.id_atividade)[0];

                return (atividade && atividade.status === "APROVADA");
            });
    }
    async buscarProvaPorSave(idSave){
        idSave = validacoes.validarId(idSave);

        const prova = await provaFinalModel.buscarProvaPorSave(idSave);

        if(!prova){
            throw new Error("Nenhuma prova encontrada.");
        }

        return {
            ...prova,
            questoes: await this.buscarQuestoesProva(prova.id_prova)
        };
    }
}

module.exports = new ProvasService();