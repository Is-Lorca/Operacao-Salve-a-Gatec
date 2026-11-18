const validacao = require('../utils/validacoes');
const savesModel = require('../models/savesModel');
const jogadorModel = require('../models/jogadoresModel');

class SaveService {
    // criar
    async criarNovoJogo(nomeSave, nomeJogador, idUser){
        validacao.validarNome(nomeSave);
        const idValido = validacao.validarId(idUser);

        // 1. criamos save
        const save = await savesModel.criar({nome_save: nomeSave, id_usuario: idValido});

        // 2. criamos jogador ligado ao save
        const jogador = await jogadorModel.criar({nome: nomeJogador, id_save: save.id_save});

        // 3. atualiza o save com o id_jogador criado
        const saveAtualizado = await savesModel.atualizarSave(idValido, save.id_save, {
            id_jogador: jogador.id_jogador
        });

        return {
            save: saveAtualizado || save,
            jogador
        };
    }
    // buscar
    async carregarTodos(idUser){
        const idValido = validacao.validarId(idUser);
        const saves = await savesModel.buscarSaves(idValido);

        // retorna lista vazia e nao da erro 404 quando o usuário não tem saves
        return saves || [];
    }
    // buscarIdUsuario  
    async carregarSaves(idUser, idSave){
        const idUValido = validacao.validarId(idUser);
        const idSValido = validacao.validarId(idSave);
        const save = await savesModel.buscarSavesId(idUValido, idSValido);

        if(!save) throw new Error("Save não encontrado.");

        return save;
    }
    // atualizar
    async atualizarSave(idUser, idSave, novosDados){
        const idUValido = validacao.validarId(idUser);
        const idSValido = validacao.validarId(idSave);
        const saveAtualizado = await savesModel.atualizarSave(idUValido, idSValido, novosDados);

        if(saveAtualizado === null){
            throw new Error("Save não existe, não há o que atualizar");
        }

        return saveAtualizado;
    }
    // excluir
    async excluindoSave(idUser, idSave){
        const idUValido = validacao.validarId(idUser);
        const idSValido = validacao.validarId(idSave);
        const excluindoSave = await savesModel.excluirSave(idUValido, idSValido);

        if(!excluindoSave) throw new Error("Save não existe, não há o que apagar");

        return excluindoSave;
    }
}

module.exports = new SaveService();