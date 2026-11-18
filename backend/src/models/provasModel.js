const supabase = require('../config/supabase');

class ProvasModel{
    async criarProva(idSave){
        const novosDados = {
            id_save: idSave
        }

        const {data, error} = await supabase
            .from('prova_final')
            .insert(novosDados)
            .select('*')
            .single()

        if(error){
            console.error('Erro ao criar prova: ', error.message);
            throw error;
        }

        return data;
    }
    async buscarProva(idProva){
        const {data, error} = await supabase
            .from('prova_final')
            .select(`
                id_prova,
                id_save,
                nota,
                realizada,
                resultado
            `)
            .eq('id_prova', idProva)
            .single()
            
        if(error){
            console.error(`Erro ao encontrar prova de ID ${idProva}: `, error.message);
            throw error;
        }

        return data;
    }
    async buscarProvaPorSave(idSave){
        const {data, error} = await supabase
            .from('prova_final')
            .select(`id_prova, nota, realizada`)
            .eq('id_save', idSave)
            .maybeSingle()

        if(error){
            console.error(
                `Erro ao encontrar prova de save de ID ${idSave}: `, 
                error.message);
            throw error;
        }

        return data;
    }
    async salvarQuestaoProva(idQuestao, idProva, ordem){
        const novosDados = {
            id_questao: idQuestao,
            id_prova: idProva,
            ordem: ordem
        };

        const {data, error} = await supabase
            .from('prova_questoes')
            .insert(novosDados)
            .select()
            .single()

        if(error){
            console.error(
                `Erro ao salvar questao de ID ${idQuestao} da prova de ID ${idProva}: `, 
                error.message);
            throw error;
        }

        return data;
    }
    async buscarQuestoesProva(idProva){
        const {data, error} = await supabase
            .from('prova_questoes')
            .select(`id_prova_questao, id_questao, ordem, acertou`)
            .eq('id_prova', idProva)
            .order('ordem')

        if(error){
            console.error(
                `Erro ao encontrar questao de prova de ID ${idProva}: `, 
                error.message);
            throw error;
        }

        return data;
    }
    async atualizarResposta(idProva, idQuestao, resposta){
        const {data, error} = await supabase
            .from('prova_questoes')
            .update({acertou: resposta}) // true/false
            .eq('id_prova', idProva)
            .eq('id_questao', idQuestao)

        if(error){
            console.error(
                `Erro ao atualizar resposta de prova de ID ${idProva} e questão de ID ${idQuestao}: `, 
                error.message);
            throw error;
        }

        return data;
    }
    async finalizarProva(idProva, dados){
        const dadosAtualizar = {
            nota: dados.nota,
            realizada: true,
            resultado: dados.resultado
        }

        const {data, error} = await supabase
            .from('prova_final')
            .update(dadosAtualizar)
            .eq('id_prova', idProva)
            .select()
            .single()

        if(error){
            console.error(`Erro ao finalizar prova de ID ${idProva}: `,  error.message);
            throw error;
        }

        return data;
    }
    async apagarQuestoesProva(idProva){
        const { error } = await supabase
            .from('prova_questoes')
            .delete()
            .eq('id_prova', idProva);

        if(error){
            console.error(`Erro ao apagar questões da prova ${idProva}: `, error.message);
            throw error;
        }

        return true;
    }
    
}

module.exports = new ProvasModel();