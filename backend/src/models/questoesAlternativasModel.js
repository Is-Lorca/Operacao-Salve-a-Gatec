
const supabase = require('../config/supabase');

// Níveis das questões:
// Fácil: 1 e 2
// Médio: 3 e 4
// Difícil: 5, 6 e 7

class QAModel {

    // Busca todas as questões de uma matéria
    async buscarQuestoesMateria(idMateria) {

        const { data, error } = await supabase
            .from('questao')
            .select(`
                id_questao,
                id_materia,
                enunciado,
                tipo,
                nivel,
                dica
            `)
            .eq('id_materia', idMateria);

        if (error) {
            console.error(
                `Erro ao buscar questões da matéria ${idMateria}:`,
                error.message
            );

            throw error;
        }

        return data;
    }


    // Busca questões de uma matéria por nível
    async buscarQuestoesNivel(idMateria, niveis) {

        const { data, error } = await supabase
            .from('questao')
            .select(`
                id_questao,
                id_materia,
                enunciado,
                tipo,
                nivel,
                dica
            `)
            .eq('id_materia', idMateria)
            .in('nivel', niveis);

        if (error) {
            console.error(
                'Erro ao buscar questões por nível:',
                error.message
            );

            throw error;
        }

        return data;
    }


    // Busca as alternativas de uma questão
    async buscarAlternativas(idQuestao) {

        const { data, error } = await supabase
            .from('alternativa')
            .select(`
                id_alternativa,
                id_questao,
                texto,
                correta
            `)
            .eq('id_questao', idQuestao)
            .order('id_alternativa');

        if (error) {
            console.error(
                `Erro ao buscar alternativas da questão ${idQuestao}:`,
                error.message
            );

            throw error;
        }

        return data;
    }


    // Busca uma questão completa:
    // enunciado + alternativas
    async buscarQA(idQuestao) {

        const { data, error } = await supabase
            .from('questao')
            .select(`
                id_questao,
                id_materia,
                enunciado,
                tipo,
                nivel,
                dica
            `)
            .eq('id_questao', idQuestao)
            .single();

        if (error) {
            console.error(
                `Erro ao buscar questão ${idQuestao}:`,
                error.message
            );

            throw error;
        }

        const alternativas = await this.buscarAlternativas(idQuestao);

        return {
            ...data,
            alternativas
        };
    }


    // Busca questões aleatórias com filtros
    async buscarQuestoesAleatorias(filtros) {

        const {
            idMateria,
            niveis,
            quantidade,
            idIgnorados = []
        } = filtros;

        let query = supabase
            .from('questao')
            .select(`
                id_questao,
                id_materia,
                enunciado,
                tipo,
                nivel,
                dica
            `);

        if (idMateria) {
            query = query.eq('id_materia', idMateria);
        }

        if (niveis && niveis.length > 0) {
            query = query.in('nivel', niveis);
        }

        const { data, error } = await query;

        if (error) {
            console.error(
                'Erro ao buscar questões aleatórias:',
                error.message
            );

            throw error;
        }

        let questoes = data;

        if (idIgnorados.length > 0) {
            const idsIgnorados = new Set(
                idIgnorados.map(Number)
            );

            questoes = questoes.filter(
                questao => !idsIgnorados.has(Number(questao.id_questao))
            );
        }

        questoes.sort(() => Math.random() - 0.5);

        return questoes.slice(0, quantidade);
    }


    // Busca várias questões completas pelos seus IDs
    async buscarVariasQA(idsQuestoes) {

        const resultado = [];

        for (const idQuestao of idsQuestoes) {

            const { data: questao, error } = await supabase
                .from('questao')
                .select(`
                    id_questao,
                    id_materia,
                    enunciado,
                    tipo,
                    nivel,
                    dica
                `)
                .eq('id_questao', idQuestao)
                .single();

            if (error) {
                console.error(
                    `Erro ao buscar questão ${idQuestao}:`,
                    error.message
                );

                throw error;
            }

            const alternativas = await this.buscarAlternativas(idQuestao);

            resultado.push({
                ...questao,
                alternativas
            });
        }

        return resultado;
    }


    // Refaz uma atividade
    async refazerAtividade(idSave, idMateria) {
        return await this.gerarAtividade(idSave, idMateria);
    }

}

module.exports = new QAModel();
