const supabase = require('../config/supabase');

// niveis de questões facil: 1-2, medio: 3-4, dificil: 5-7
class QAModel {
    // busca questões de uma matéria
    async buscarQuestoesMateria(idMateria) {
        const { data, error } = await supabase
            .from('questao')
            .select(`id_questao, enunciado, tipo, nivel, dica`)
            .eq('id_materia', idMateria);

        if(error){
            console.error(`Erro ao buscar questões da matéria ${idMateria}: `, error.message);
            throw error;
        }

        return data;
    }
    // busca questões filtrando por níveis
    // exemplo: níveis [1,2]
    async buscarQuestoesNivel(idMateria, niveis) {
        const { data, error } = await supabase
            .from('questao')
            .select(`id_questao, enunciado, tipo, nivel, dica`)
            .eq('id_materia', idMateria)
            .in('nivel', niveis);

        if(error){
            console.error(`Erro ao buscar questões por nível: `, error.message);
            throw error;
        }

        return data;
    }
    // busca alternativas de uma questão específica
    async buscarAlternativas(idQuestao) {
        const { data, error } = await supabase
            .from('alternativa')
            .select(`id_alternativa, texto, correta`)
            .eq('id_questao', idQuestao);

        if(error){
            console.error(`Erro ao buscar alternativas da questão ${idQuestao}: `, error.message);
            throw error;
        }

        return data;
    }
    // retorna uma questão completa
    // questão + alternativas
    async buscarQA(idQuestao) {
        const { data, error } = await supabase
            .from('questao')
            .select(`id_questao, enunciado, tipo, nivel, dica`)
            .eq('id_questao', idQuestao)
            .single();

        if(error){
            console.error(`Erro ao buscar questão ${idQuestao}: `, error.message);
            throw error;
        }

        const alternativas = await this.buscarAlternativas(idQuestao);

        return {
            ...data,
            alternativas
        };
    }
    // busca questões aleatórias com filtros
    async buscarQuestoesAleatorias(filtros) {
        // coloca os filtros dentro de variaveis "exatas"
        const {idMateria, niveis, quantidade, idIgnorados = []} = filtros;

        let query = supabase
            .from('questao')
            .select(`id_questao, enunciado, tipo, nivel, dica`);
        // filtra matéria se existir
        if(idMateria){
            query = query.eq('id_materia', idMateria);
        }
        // filtra níveis
        if(niveis && niveis.length > 0){
            query = query.in('nivel', niveis);
        }
        const { data, error } = await query;

        if(error){
            console.error("Erro ao buscar questões aleatórias: ", error.message);
            throw error;
        }

        let questoes = data;

        // remove questões que devem ser ignoradas
        if(idIgnorados.length > 0){
            questoes = questoes.filter(questao => !idIgnorados.includes(questao.id_questao));
        }

        // embaralha questões
        questoes.sort(() => Math.random() - 0.5);

        // retorna somente a quantidade necessária
        return questoes.slice(0, quantidade);
    }
    // recebe várias questões e devolve todas completas
    async buscarVariasQA(questoes){
        const resultado = [];

        // cada questao dentro de questoes
        for(const questao of questoes){
            const alternativas = await this.buscarAlternativas(questao.id_questao);

            resultado.push({
                ...questao,
                alternativas
            });
        }

        return resultado;
    }
    async refazerAtividade(idSave, idMateria){
        return await this.gerarAtividade(idSave, idMateria);
    }
}

module.exports = new QAModel();