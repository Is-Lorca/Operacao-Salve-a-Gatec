const supabase = require('../config/supabase');

class JogadoresModel {
    async criar(dados){
        const novoJogador ={
            id_save: dados.id_save,
            nome: dados.nome
        }

        const {data, error} = await supabase
            .from('jogador')
            .insert(novoJogador)
            .select()
            .single()

        if(error){
            console.error('Erro ao inserir jogador: ', error.message);
            throw error;
        }

        return data;
    }
    async buscarPorSave(idSave){
        const {data, error} = await supabase
            .from('jogador')
            .select(`id_jogador, nome, dinheiro, id_materia_atual, 
                id_checkpoint, primeira_run, tempo_jogado`)
            .eq('id_save', idSave)
            .maybeSingle();

        if(error){
            console.error(`Erro ao buscar jogador usando save de ID ${idSave}: `, error.message);
            throw error;
        }

        return data;
    }
    async buscarPorId(idJogador){
        const {data, error} = await supabase
            .from('jogador')
            .select(`id_save, nome, dinheiro, id_materia_atual, 
                id_checkpoint, primeira_run, tempo_jogado`)
            .eq('id_jogador', idJogador)
            .maybeSingle();

        if(error){
            console.error(`Erro ao buscar jogador de ID ${idJogador}: `, error.message);
            throw error;
        }

        return data;
    }
    async atualizar(idJogador, novosDados){
        const dadosAtualizar = {};

        if(novosDados.nome){
            dadosAtualizar.nome = novosDados.nome;
        }
        if(novosDados.dinheiro !== undefined){
            dadosAtualizar.dinheiro = novosDados.dinheiro;
        }
        if(novosDados.id_materia_atual){
            dadosAtualizar.id_materia_atual = novosDados.id_materia_atual;
        }
        if(novosDados.id_checkpoint){
            dadosAtualizar.id_checkpoint = novosDados.id_checkpoint;
        }
        if(novosDados.primeira_run !== undefined){
            dadosAtualizar.primeira_run = novosDados.primeira_run;
        }
        if(novosDados.tempo_jogado){
            dadosAtualizar.tempo_jogado = novosDados.tempo_jogado;
        }

        if(Object.keys(dadosAtualizar).length === 0){
            return null;
        }

        const {data, error} = await supabase
            .from('jogador')
            .update(dadosAtualizar)
            .eq('id_jogador', idJogador)
            .select('*')
            .maybeSingle();

        if(error){
            console.error(`Erro ao atualizar jogador de ID ${idJogador}: `, error.message);
            throw error;
        }

        return data;
    }
    async excluir(idJogador){
        const {data, error} = await supabase
            .from('jogador')
            .delete()
            .eq('id_jogador', idJogador)
            .select('*')
            .maybeSingle();

        if(error){
            console.error(`Erro ao deletar jogador de ID ${idJogador}: `, error.message);
            throw error;
        }

        return true;
    }
}

module.exports = new JogadoresModel();