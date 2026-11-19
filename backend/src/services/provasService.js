
const provaFinalModel = require('../models/provasModel');
const atividadesModel = require('../models/atividadesModel');
const qaModel = require('../models/questoesAlternativasModel');
const validacoes = require('../utils/validacoes');
const materiasModel = require('../models/materiasModel');

class ProvasService {

    // Calcula a média das atividades
    calcularMedia(notas) {

        if (!notas || notas.length === 0) {
            return 0;
        }

        const soma = notas.reduce((total, atividade) => {
            return total + Number(atividade.nota || 0);
        }, 0);

        return Number((soma / notas.length).toFixed(2));
    }


    // Embaralha uma lista
    embaralhar(lista) {

        const array = [...lista];

        for (let i = array.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }


    // Remove questões que já foram utilizadas nas atividades
    removerRepetidas(lista, idsIgnorados) {

        if (!idsIgnorados || idsIgnorados.length === 0) {
            return lista;
        }

        const ids = new Set(idsIgnorados.map(Number));

        return lista.filter(
            questao => !ids.has(Number(questao.id_questao))
        );
    }


    // Busca questões completas
    async buscarQuestoesCompletas(listaQuestoes) {

        return await qaModel.buscarVariasQA(listaQuestoes);
    }


    // Gera uma prova ou recupera uma prova que ainda não foi finalizada
    async gerarProva(idSave) {

        idSave = validacoes.validarId(idSave);

        const materias = await materiasModel.buscarMaterias();

        materias.sort((a, b) => a.ordem - b.ordem);

        if (!materias || materias.length === 0) {
            throw new Error('Nenhuma matéria foi encontrada.');
        }


        // Verifica se já existe uma prova para esse save
        const provaExistente =
            await provaFinalModel.buscarProvaPorSave(idSave);

        if (provaExistente) {

            if (provaExistente.realizada) {
                throw new Error('O desafio final já foi realizado.');
            }

            // Recupera a prova que ainda não foi finalizada
            const questoes = await this.buscarQuestoesProva(
                provaExistente.id_prova
            );

            return {
                ...provaExistente,
                questoes
            };
        }


        // Verifica se todas as matérias foram concluídas
        const liberada = await this.verificarLiberacaoProva(
            idSave,
            materias
        );

        if (!liberada) {
            throw new Error('O desafio final ainda não está liberado.');
        }


        // Busca questões de nível médio e difícil
        // Médio: 3 e 4
        // Difícil: 5, 6 e 7
        const niveisPermitidos = [3, 4, 5, 6, 7];

        let questoesDisponiveis = [];

        for (const materia of materias) {

            const questoes = await qaModel.buscarQuestoesNivel(
                materia.id_materia,
                niveisPermitidos
            );

            questoesDisponiveis.push(...questoes);
        }


        // Remove questões utilizadas anteriormente nas atividades
        const idsUsados =
            await atividadesModel.buscarIdsQuestoesUtilizadas(idSave);

        questoesDisponiveis = this.removerRepetidas(
            questoesDisponiveis,
            idsUsados
        );


        // Garante pelo menos uma questão de cada matéria
        const selecionadas = [];

        for (const materia of materias) {

            const questoesMateria = questoesDisponiveis.filter(
                questao =>
                    Number(questao.id_materia) === Number(materia.id_materia)
            );

            if (questoesMateria.length === 0) {

                throw new Error(
                    `Não existem questões suficientes para a matéria ${materia.nome}.`
                );
            }

            const indice = Math.floor(
                Math.random() * questoesMateria.length
            );

            const escolhida = questoesMateria[indice];

            selecionadas.push(escolhida);

            // Remove a questão escolhida da lista geral
            questoesDisponiveis = questoesDisponiveis.filter(
                questao =>
                    Number(questao.id_questao) !==
                    Number(escolhida.id_questao)
            );
        }


        // Completa a prova até chegar a 10 questões
        while (selecionadas.length < 10) {

            if (questoesDisponiveis.length === 0) {
                throw new Error(
                    'Não existem questões suficientes para gerar a prova.'
                );
            }

            const indice = Math.floor(
                Math.random() * questoesDisponiveis.length
            );

            const escolhida = questoesDisponiveis.splice(indice, 1)[0];

            selecionadas.push(escolhida);
        }


        // Embaralha a ordem das questões
        const questoesOrdenadas = this.embaralhar(selecionadas);


        // Cria a prova no banco
        const prova = await provaFinalModel.criarProva(idSave);


        // Salva o relacionamento entre prova e questões
        for (let i = 0; i < questoesOrdenadas.length; i++) {

            await provaFinalModel.salvarQuestaoProva(
                questoesOrdenadas[i].id_questao,
                prova.id_prova,
                i + 1
            );
        }


        // Retorna a prova com suas questões completas
        return {
            ...prova,
            questoes: await this.buscarQuestoesProva(prova.id_prova)
        };
    }


    // Busca as questões e alternativas de uma prova
    async buscarQuestoesProva(idProva) {

        idProva = validacoes.validarId(idProva);

        const relacoes =
            await provaFinalModel.buscarQuestoesProva(idProva);

        if (!relacoes || relacoes.length === 0) {
            throw new Error('Nenhuma questão encontrada para essa prova.');
        }


        // Extrai somente os IDs das questões
        const idsQuestoes = relacoes.map(
            item => item.id_questao
        );


        // Busca as questões completas
        const questoes = await qaModel.buscarVariasQA(idsQuestoes);


        // Mantém a ordem definida na prova
        return relacoes.map(relacao => {

            const questao = questoes.find(
                item =>
                    Number(item.id_questao) === Number(relacao.id_questao)
            );

            if (!questao) {
                throw new Error(
                    `Não foi possível encontrar a questão ${relacao.id_questao}.`
                );
            }

            return {
                ...questao,
                ordem: relacao.ordem,
                acertou: relacao.acertou
            };
        });
    }


    // Registra se o jogador acertou ou errou
    async registrarResposta(idProva, idQuestao, acertou) {

        idProva = validacoes.validarId(idProva);
        idQuestao = validacoes.validarId(idQuestao);

        if (typeof acertou !== 'boolean') {
            throw new Error('Resposta inválida.');
        }

        return await provaFinalModel.atualizarResposta(
            idProva,
            idQuestao,
            acertou
        );
    }


    // Corrige e finaliza a prova
    async corrigirProva(idProva) {

        idProva = validacoes.validarId(idProva);

        const prova = await provaFinalModel.buscarProva(idProva);

        if (prova.realizada) {
            throw new Error('Essa prova já foi finalizada.');
        }


        const questoes =
            await provaFinalModel.buscarQuestoesProva(idProva);

        if (!questoes || questoes.length === 0) {
            throw new Error('Essa prova não possui questões.');
        }

        // Impede finalizar uma prova com questões sem resposta
        const existeQuestaoSemResposta = questoes.some(
            questao => questao.acertou === null
        );

        if (existeQuestaoSemResposta) {
            throw new Error(
                'Ainda existem questões sem resposta.'
            );
        }


        // Conta os acertos
        const acertos = questoes.filter(
            questao => questao.acertou === true
        ).length;


        // Nota de 0 a 10
        const notaProva = Number(
            ((acertos / questoes.length) * 10).toFixed(2)
        );


        // Busca as notas das atividades
        const notasAtividades =
            await atividadesModel.buscarNotasAtividades(prova.id_save);

        const mediaAtividades = this.calcularMedia(notasAtividades);


        // Calcula a média final
        const mediaFinal = Number(
            ((mediaAtividades + notaProva) / 2).toFixed(2)
        );


        // Define o final
        const resultado =
            mediaFinal >= 8
                ? 'GOOD_ENDING'
                : 'BAD_ENDING';


        // Salva o resultado no banco
        await provaFinalModel.finalizarProva(idProva, {
            nota: notaProva,
            resultado
        });


        return {
            notaProva,
            mediaAtividades,
            mediaFinal,
            resultado
        };
    }


    // Verifica se todas as matérias foram aprovadas
    async verificarLiberacaoProva(idSave, materias) {
        
        const atividades =
            await atividadesModel.buscarTodasAtividadesSave(idSave);

        return materias.every(materia => {

            const atividade = atividades
                .filter(
                    item =>
                        Number(item.id_materia) ===
                        Number(materia.id_materia)
                )
                .sort(
                    (a, b) => b.id_atividade - a.id_atividade
                )[0];

            return atividade && atividade.status === 'CONCLUIDA';
        });
    }


    // Busca uma prova pelo save
    async buscarProvaPorSave(idSave) {

        idSave = validacoes.validarId(idSave);

        const prova =
            await provaFinalModel.buscarProvaPorSave(idSave);

        if (!prova) {
            throw new Error('Nenhuma prova encontrada.');
        }

        return {
            ...prova,
            questoes: await this.buscarQuestoesProva(prova.id_prova)
        };
    }

}

module.exports = new ProvasService();
