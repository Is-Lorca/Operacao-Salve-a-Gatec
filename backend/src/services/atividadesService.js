const validacoes = require('../utils/validacoes');

const qaModel = require('../models/questoesAlternativasModel');
const atividadesModel = require('../models/atividadesModel');
const materiasModel = require('../models/materiasModel');
const jogadoresService = require('./jogadoresService');

class AtividadesService{
    // os métodos abaixo não possuem async pois não mexem diretamente com o BD, existem para auxiliar
    embaralhar(vetor) {
        const array = [...vetor];

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }
    selecionarQuestoes(questoes, quantidade) {
        const embaralhadas = this.embaralhar(questoes);

        return embaralhadas.slice(0, quantidade);
    }
    removerRepetidas(questoes, idsIgnorados) {
        if (!idsIgnorados || idsIgnorados.length === 0) return questoes;

        return questoes.filter(questao => !idsIgnorados.includes(questao.id_questao));
    }
    selecionarQuestao(questoesDisponiveis, niveisPermitidos) {
        // filtra somente questões dos níveis permitidos
        const candidatas = questoesDisponiveis.filter(questao => niveisPermitidos.includes(questao.nivel));

        if (candidatas.length === 0) {
            return null;
        }

        // sorteia uma questão
        const indice = Math.floor(
            Math.random() * candidatas.length
        );
        const selecionada = candidatas[indice];

        // remove a questão da lista para impedir repetição
        const indiceOriginal = questoesDisponiveis.findIndex(questao => 
            questao.id_questao === selecionada.id_questao);

        questoesDisponiveis.splice(indiceOriginal, 1);

        return selecionada;
    }
    // aqui são métodos que mexem diretamente com o BD, por isso são async
    async montarQA(listaQuestoes) {
        return await qaModel.buscarVariasQA(listaQuestoes);
    }
    async gerarAtividade(idSave, idMateria) {
        const idSValido = validacoes.validarId(idSave);
        const idMValido = validacoes.validarId(idMateria);

        const atividadeExistente = await atividadesModel.buscarAtividadePorSave(idSValido, idMValido);

        if (atividadeExistente) {
            switch (atividadeExistente.status) {
                case "EM_ANDAMENTO":
                    const questoes = await atividadesModel.buscarQuestoesAtividade(
                        atividadeExistente.id_atividade);
                    return {
                        ...atividadeExistente,
                        questoes
                    };
                case "CONCLUIDA":
                    throw new Error("Essa atividade já foi concluída.");
                case "REPROVADA":
                    break;
            }
        }
        
        const idsIgnorados = await atividadesModel.buscarIdsQuestoesUtilizadas(idSValido);

        let questoesDisponiveis = await qaModel.buscarQuestoesNivel(idMValido,[1, 2, 3, 4, 5, 6, 7]);

        // aqui removemos as questoes que já existem foram usadas no save
        questoesDisponiveis = this.removerRepetidas(questoesDisponiveis, idsIgnorados);

        if (questoesDisponiveis.length < 7) {
            questoesDisponiveis = await qaModel.buscarQuestoesNivel(idMValido, [1, 2, 3, 4, 5, 6, 7]);
        }

        const questoesSelecionadas = [];

        // questões 1 a 5: fácil ou médio
        for (let i = 0; i < 5; i++) {
            const questao = this.selecionarQuestao(questoesDisponiveis, [1, 2, 3, 4]);
            if (!questao) {
                throw new Error(`Não existem questões suficientes para a atividade da matéria ${idMValido}.`);
            }
            questoesSelecionadas.push(questao);
        }

        // questão 6: obrigatoriamente média
        const questaoSeis = this.selecionarQuestao(questoesDisponiveis, [3, 4]);
        if (!questaoSeis) {
            throw new Error(`Não existe questão de nível médio disponível na matéria ${idMValido}.`);
        }
        questoesSelecionadas.push(questaoSeis);

        // questão 7: obrigatoriamente difícil
        const questaoSete = this.selecionarQuestao(questoesDisponiveis, [5, 6, 7]);
        if (!questaoSete) {
            throw new Error(`Não existe questão de nível difícil disponível na matéria ${idMValido}.`);
        }
        questoesSelecionadas.push(questaoSete);
        
        const primeirasCinco = this.embaralhar(questoesSelecionadas.slice(0, 5));

        const questoesFinais = [
            ...primeirasCinco,
            questaoSeis,
            questaoSete
        ];

        const idsQuestoesOrdenados = questoesFinais.map(q => q.id_questao);

        const atividade = await atividadesModel.criarAtividadeComQuestoes(idSValido, idMValido, 
            idsQuestoesOrdenados);
        
        // retorna atividade completa
        await this.montarQA(idsQuestoesOrdenados);

        return {
            ...atividade, 
            questoes: questoesComAlternativas
        };
    }
    async registrarResposta(idAtividade, idQuestao, acertou) {
        const idAValido = validacoes.validarId(idAtividade);
        const idQValido = validacoes.validarId(idQuestao);

        try {
            if (typeof acertou !== 'boolean') {
                throw new Error('A resposta deve ser verdadeira ou falsa.');
            }

            const atividade = await atividadesModel.buscarAtividade(idAValido);

            if (!atividade) {
                throw new Error('Atividade não encontrada.');
            }

            if (atividade.status !== 'EM_ANDAMENTO') {
                throw new Error('Não é possível responder uma atividade já finalizada.');
            }

            const questoes = await atividadesModel.buscarQuestoesAtividade(idAValido);

            const questaoPertence = questoes.some(q => q.id_questao === idQValido);

            if (!questaoPertence) {
                throw new Error('Essa questão não pertence à atividade informada.');
            }

            await atividadesModel.atualizarResposta(idAValido, idQValido, acertou);

            return {
                sucesso: true,
                mensagem: 'Resposta registrada com sucesso.'
            };

        }
        catch (erro) {
            throw new Error(`Erro ao registrar resposta: ${erro.message}`);
        }
    }
    async corrigirAtividade(idAtividade, idSave) {
        const idAValido = validacoes.validarId(idAtividade);
        const idSValido = validacoes.validarId(idSave);

        try {
            const atividade = await atividadesModel.buscarAtividade(idAValido);

            if (!atividade) {
                throw new Error('Atividade não encontrada.');
            }

            if (atividade.status !== 'EM_ANDAMENTO') {
                throw new Error('Essa atividade já foi finalizada.');
            }

            const questoes = await atividadesModel.buscarQuestoesAtividade(idAValido);

            if (!questoes || questoes.length !== 7) {
                throw new Error('A atividade precisa possuir exatamente 7 questões.');
            }

            // Verifica se todas as questões foram respondidas.
            const todasRespondidas = questoes.every(q => q.acertou !== null);

            if (!todasRespondidas) {
                throw new Error('Responda todas as questões antes de finalizar.');
            }

            let nota = 0;
            let moedasGanhar = 0;
            let acertos = 0;

            for (const questao of questoes) {
                if (questao.acertou === true) {
                    acertos++;

                    // a sétima questão vale 4 pontos e 4 moedas.
                    const pontos = questao.ordem === 7 ? 4 : 1;

                    nota += pontos;
                    moedasGanhar += pontos;
                }
            }

            // define se o jogador foi aprovado ou reprovado.
            const status = nota >= 6 ? 'CONCLUIDA' : 'REPROVADA';

            await atividadesModel.finalizarAtividade(idAValido, {nota, status});
            
            if(status === "CONCLUIDA"){
                const jogador = await jogadoresService.buscarPorSave(idSValido);

                await jogadoresService.atualizar(jogador.id_jogador, {dinheiro: jogador.dinheiro + 
                    moedasGanhar});
            }

            const podeRefazer = nota < 6;

            return {
                sucesso: true,
                mensagem: 'Atividade corrigida com sucesso.',
                idAtividade: idAValido,
                nota,
                totalQuestoes: 7,
                acertos,
                moedasGanhar,
                status,
                podeRefazer
            };

        } 
        catch (erro) {
            throw new Error(`Erro ao corrigir atividade: ${erro.message}`);
        }
    }
    // método utilizado para recuperar as questões de uma atividade já iniciada, 
    // ex. quando o jogador continua um save.
    async buscarQuestoes(idAtividade) {
        const idAValido = validacoes.validarId(idAtividade);

        try {
            const atividade = await atividadesModel.buscarAtividade(idAValido);

            if (!atividade) {
                throw new Error('Atividade não encontrada.');
            }

            const questoesSalvas = await atividadesModel.buscarQuestoesAtividade(idAValido);

            const idsQuestoes = questoesSalvas.map(q => q.id_questao);

            const questoes = await qaModel.buscarVariasQA(idsQuestoes);

            return questoesSalvas.map(qSalva => {
                const questao = questoes.find(q => q.id_questao === qSalva.id_questao);

                return {
                    ...questao,
                    ordem: qSalva.ordem,
                    acertou: qSalva.acertou
                }
            });

        } catch (erro) {
            throw new Error(`Erro ao buscar questões: ${erro.message}`);
        }
    }
    async buscarAtividadeCompleta(idAtividade){
        const idAValido = validacoes.validarId(idAtividade);

        try {
            const atividade = await atividadesModel.buscarAtividade(idAValido);

            if(!atividade){
                throw new Error("Atividade não encontrada.");
            }

            const questoes = await this.buscarQuestoes(idAValido);

            return {
                ...atividade,
                questoes
            };
        } 
        catch(error){
            throw new Error(`Erro ao buscar atividade completa: ${error.message}`);
        }
    }
    async refazerAtividade(idSave, idMateria){
        const idSValido = validacoes.validarId(idSave);
        const idMValido = validacoes.validarId(idMateria);

        try {
            const ultimaAtividade = await atividadesModel.buscarAtividadePorSave(idSValido, idMValido);

            if(!ultimaAtividade){
                throw new Error("Nenhuma atividade encontrada.");
            }

            if(ultimaAtividade.status === "CONCLUIDA"){
                throw new Error("Essa atividade já foi concluída.");

            }

            if(ultimaAtividade.status === "EM_ANDAMENTO"){
                throw new Error("Existe uma atividade em andamento.");
            }

            // Caso seja REPROVADA,
            // gerarAtividade cria uma nova tentativa
            return await this.gerarAtividade(idSValido, idMValido);
        } 
        catch(erro){
            throw new Error(`Erro ao refazer atividade: ${erro.message}`);
        }
    }
    async calcularMediaAtividades(idSave){
        const idSValido = validacoes.validarId(idSave);

        try {
            const notas = await atividadesModel.buscarNotasAtividades(idSValido);

            if(!notas || notas.length === 0){
                return 0;
            }

            const soma = notas.reduce((total, atividade) => total + atividade.nota, 0);

            return Number((soma / notas.length).toFixed(2));

        } 
        catch(erro){
            throw new Error(`Erro ao calcular média das atividades: ${erro.message}`);
        }
    }
    async verificarMateriaConcluida(idSave, idMateria){
        const idSValido = validacoes.validarId(idSave);
        const idMValido = validacoes.validarId(idMateria);

        try {
            const atividade = await atividadesModel.buscarAtividadePorSave(idSValido, idMValido);

            if(!atividade){
                return false;
            }

            return atividade.status === "CONCLUIDA";
        } 
        catch(erro){
            throw new Error(`Erro ao verificar matéria concluída: ${erro.message}`);
        }
    }
    async buscarProgressoMaterias(idSave){
        const idSValido = validacoes.validarId(idSave);

        const materias = await materiasModel.buscarMaterias();
        materias.sort((a, b) => a.ordem - b.ordem);

        try {
            const atividades = await atividadesModel.buscarTodasAtividadesSave(idSValido);

            const progresso = [];

            let ultimaAprovada = true;

            for(const materia of materias){
                const atividadeMateria = atividades.filter(atividade => atividade.id_materia === 
                    materia.id_materia).sort((a,b) => b.id_atividade - a.id_atividade)[0];

                let status = "BLOQUEADA";
                let nota = null;
                let liberada = false;

                // a primeira matéria sempre começa liberada
                if(materia.ordem === 1){
                    liberada = true;
                }
                // as próximas dependem da anterior
                else {
                    liberada = ultimaAprovada;
                }

                if(atividadeMateria){
                    nota = atividadeMateria.nota;
                    status = atividadeMateria.status;
                    if(atividadeMateria.status === "CONCLUIDA" && atividadeMateria.nota >= 6){
                        ultimaAprovada = true;
                    }
                    else {
                        ultimaAprovada = false;
                    }
                }
                else {
                    // ainda não fez
                    status = liberada? "DISPONIVEL": "BLOQUEADA";
                    ultimaAprovada = false;
                }

                progresso.push({
                    idMateria: materia.id_materia,
                    nome: materia.nome,
                    nota,
                    status,
                    liberada
                });
            }

            return progresso;
        } 
        catch(erro){
            throw new Error(`Erro ao buscar progresso das matérias: ${erro.message}`);
        }
    }
    async verificarLiberacaoProva(idSave){
        const idSValido = validacoes.validarId(idSave);

        const materias = await materiasModel.buscarMaterias();
        materias.sort((a, b) => a.ordem - b.ordem);

        try {
            const atividades = await atividadesModel.buscarTodasAtividadesSave(idSValido);

            const materiasConcluidas = materias.every(materia => {
                    const atividade = atividades.filter(item =>item.id_materia === materia.id_materia).sort(
                        (a,b)=> b.id_atividade - a.id_atividade)[0];

                    return (atividade && atividade.status === "CONCLUIDA");
                });

            return {
                liberada: materiasConcluidas
            };
        } 
        catch(erro){
            throw new Error(`Erro ao verificar liberação da prova: ${erro.message}`);
        }
    }
}

module.exports = new AtividadesService();