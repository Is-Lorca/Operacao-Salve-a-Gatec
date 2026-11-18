const supabase = require('../config/supabase');

class AtividadesModel{
    async criarAtividadeComQuestoes(idSave, idMateria, idsQuestoes) {
        const { data, error } = await supabase
            .rpc('criar_atividade_transacional', {
                p_id_save: idSave,
                p_id_materia: idMateria,
                p_ids_questoes: idsQuestoes
            })
            .single(); // Como a função retorna SETOF, o .single() extrai o objeto único

        if (error) {
            console.error('Erro na transação ao criar atividade e questões:', error.message);
            throw error;
        }

        return data;
    }
    async criarAtividade(idSave, idMateria){
        const novosDados = {
            id_save: idSave,
            id_materia: idMateria,
            // tem default "status": 'EM_ANDAMENTO'
        }

        const {data, error} = await supabase
            .from('atividade')
            .insert(novosDados)
            .select('*')
            .single()

        if(error){
            console.error('Erro ao criar atividade: ', error.message);
            throw error;
        }

        return data;
    }
    async buscarAtividade(idAtividade){
        const {data, error} = await supabase
            .from('atividade')
            .select(`id_save, id_materia, nota, concluida, status`)
            .eq('id_atividade', idAtividade)
            .single()
            
        if(error){
            console.error(`Erro ao encontrar atividade de ID ${idAtividade}: `, error.message);
            throw error;
        }

        return data;
    }
    async buscarAtividadePorSave(idSave, idMateria){
        const {data, error} = await supabase
            .from('atividade')
            .select(`id_atividade, nota, concluida, status`)
            .eq('id_save', idSave)
            .eq('id_materia', idMateria)
            .order('id_atividade', { ascending: false })
            .limit(1)
            .single();

        // "JSON object requested, multiple (or no) rows returned"
        if(error && error.code !== 'PGRST116'){
            console.error(`Erro ao encontrar atividade do save ${idSave}: `, error.message);
            throw error;
        }

        if(!data){
            return null;
        }

        return data;
    }
    async salvarQuestaoAtividade(idQuestao, idAtividade, ordem){
        const novosDados = {
            id_questao: idQuestao,
            id_atividade: idAtividade,
            ordem: ordem
        };

        const {data, error} = await supabase
            .from('atividade_questoes')
            .insert(novosDados)
            .select()
            .single()
            

        if(error){
            console.error(
                `Erro ao salvar questao de ID ${idQuestao} da atividade de ID ${idAtividade}: `, 
                error.message);
            throw error;
        }

        return data;
    }
    async buscarQuestoesAtividade(idAtividade){
        const {data, error} = await supabase
            .from('atividade_questoes')
            .select(`id_atividade_questao, id_questao, ordem, acertou`)
            .eq('id_atividade', idAtividade)
            .order('ordem')

        if(error){
            console.error(
                `Erro ao encontrar questao de atividade de ID ${idAtividade}: `, 
                error.message);
            throw error;
        }

        return data;
    }
    async atualizarResposta(idAtividade, idQuestao, resposta){
        const {data, error} = await supabase
            .from('atividade_questoes')
            .update({acertou: resposta}) // true/false
            .eq('id_atividade', idAtividade)
            .eq('id_questao', idQuestao)

        if(error){
            console.error(
                `Erro ao atualizar resposta de atividade de ID ${idAtividade} e questão de ID ${idQuestao}: `, 
                error.message);
            throw error;
        }

        return data;
    }
    async finalizarAtividade(idAtividade, dados){
        const dadosAtualizar = {
            nota: dados.nota,
            concluida: true,
            status: dados.status
        }

        const {data, error} = await supabase
            .from('atividade')
            .update(dadosAtualizar)
            .eq('id_atividade', idAtividade)

        if(error){
            console.error(
                `Erro ao finalizar atividade de ID ${idAtividade}: `, 
                error.message);
            throw error;
        }

        return data;
    }
    // prova utilizará esse metodo para criar suas questoes, 
    // sem repetir as questoes armazenadas nessa atividade
    async buscarIdsQuestoesUtilizadas(idSave){
        const { data, error } = await supabase
            .from('atividade')
            .select(`
                atividade_questoes(
                    id_questao
                )`)
            .eq('id_save', idSave);

        if(error){
            console.error(`Erro ao buscar questões utilizadas do save ${idSave}: `, error.message);
            throw error;
        }

        // .flatmap() -> passa por cada atividade, pega as questoes e junta em uma array
        // .map() -> pega o array de questoes do flatmap e transforma ele, extraindo apenas o id_questao
        return data.flatMap(atividade => atividade.atividade_questoes).map(questao => questao.id_questao);
    }
    // usaremos essa função para calcular a média das atividades no Service
    async buscarNotasAtividades(idSave){
        const { data, error } = await supabase
            .from('atividade')
            .select('nota')
            .eq('id_save', idSave)
            .eq('concluida', true);

        if(error){
            console.error(`Erro ao buscar notas das atividades do save ${idSave}: `, error.message);
            throw error;
        }

        return data;
    }
    // checa se atividade já existe ou não
    async existeAtividade(idSave, idMateria){
        const { count, error } = await supabase
            .from('atividade')
            .select('*', { count: 'exact', head: true }) //conta o numero total de registros sem baixar dados
            .eq('id_save', idSave)
            .eq('id_materia', idMateria);

        if(error){
            throw error;
        }

        return count > 0;
    }
    async buscarTodasAtividadesSave(idSave){
        const { data, error } = await supabase
            .from('atividade')
            .select(`
                id_atividade,
                id_materia,
                nota,
                status,
                concluida
            `)
            .eq('id_save', idSave)
            .order('id_atividade', { ascending: true });

        if(error){
            console.error(`Erro ao buscar atividades do save ${idSave}: `,error.message);
            throw error;
        }

        return data;
    }
}

module.exports = new AtividadesModel();