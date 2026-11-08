const supabase = require('../config/supabase');

class SaveModel {
    // criando saves
    async criar(dados){
        const agora = new Date().toISOString(); //salva data e hora atual

        const novoSave = {
            nome_save: dados.nome_save,
            data_criacao: agora,
            ultimo_save: agora,
            ativo: true,
            id_usuario: dados.id_usuario
        };

        const {data, error} = await supabase
            .from('save')
            .insert(novoSave)
            .select()
            .single();

        if(error){
            console.error('Erro ao inserir registro: ', error.message);
            throw error;
        }
        return data;
    }

    async buscarSaves(idUser){
        const idUsuario = parseInt(idUser, 10);
        // apenas mostrará aqueles que possuem propriedade ativo = true
        const {data, error} = await supabase
            .from('save')
            .select(`id_save, nome_save, data_criacao, ultimo_save`)
            .eq('ativo', true)
            .eq('id_usuario', idUsuario);

        if(error){
            console.error('Erro ao buscar saves: ', error.message);
            throw error;
        }

        return data;
    }

    async buscarSavesId(idUser, idSav){
        const idUsuario = parseInt(idUser, 10);
        const idSave = parseInt(idSav, 10);

        const {data, error} = await supabase
            .from('save')
            .select('*')
            .eq('id_usuario', idUsuario)
            .eq('id_save', idSave)
            .eq('ativo', true)
            .maybeSingle();

        // se o save não for encontrado 
        if(error || !data){
            return null;
        }

        return data;
    }

    async atualizarSave(idUser, idSave, novosDados){
        // usamos o método que busca pelo ID e verificamos se está ativo no proprio buscarSavesId()
        const registroExistente = await this.buscarSavesId(idUser, idSave);
        if(!registroExistente){
            return null; // caso ele não exista, ele não atualiza
        }
        
        const dadosAtualizar = {
            ultimo_save: new Date().toISOString()
        };
        
        if(novosDados.nome_save){
            dadosAtualizar.nome_save = novosDados.nome_save;
        }
        
        const idUsuario = parseInt(idUser, 10);
        const idSav = parseInt(idSave, 10);
        // parte do Supabase
        const {data, error} = await supabase
            .from('save')
            .update(dadosAtualizar)
            .eq('id_usuario', idUsuario)
            .eq('id_save', idSav)
            .select('*')
            .maybeSingle()

        if(error){
            console.error('Erro ao atualizar no Supabase: ', error.message);
            throw error;
        }
        
        return data;
    }

    async excluirSave(idUser, idSave){
        const registroExistente = await this.buscarSavesId(idUser, idSave);
        if(!registroExistente){
            return false;
        }
        
        const idUsuario = parseInt(idUser, 10);
        const idSav = parseInt(idSave, 10);
        const {data, error} = await supabase
        .from('save')
            // o correto não é apagar do banco, mas fazer um soft delete
            .update({ativo:false})
            .eq('id_usuario', idUsuario)
            .eq('id_save', idSav)
            .select()
            .maybeSingle();

        if(error){
            console.error('Erro ao apagar no Supabase: ', error.message);
            throw error;
        }

        return true;
    }
}

module.exports = new SaveModel();