const validacao = require('../utils/validacoes');
const savesModel = require('../models/savesModel');

class SaveService {
    // criar
    async criarNovoJogo(nome, idUser){
        validacao.validarNome(nome);
        const idValido = validacao.validarId(idUser);

        return await savesModel.criar({nome_save: nome, id_usuario: idValido});
    }
    // buscar
    async carregarTodos(idUser){
        const idValido = validacao.validarId(idUser);
        const saves = await savesModel.buscarSaves(idUser);

        if(!saves || saves.length === 0){
            throw new Error("Não há saves a serem carregados.");
        }

        return saves;
    }
    // buscarIdUsuario  
    async carregarSaves(idUser, idSave){
        const idUValido = validacao.validarId(idUser);
        const idSValido = validacao.validarId(idSave);
        const save = await savesModel.buscarSavesId(idUser, idSave);

        if(!save) throw new Error("Save não encontrado.");

        return save;
    }
    // atualizar
    async atualizarSave(idUser, idSave, novosDados){
        const idUValido = validacao.validarId(idUser);
        const idSValido = validacao.validarId(idSave);
        const saveAtualizado = await savesModel.atualizarSave(idUser, idSave, novosDados);

        if(saveAtualizado === null){
            throw new Error("Save não existe, não há o que atualizar");
        }

        return saveAtualizado;
    }
    // excluir
    async excluindoSave(idUser, idSave){
        const idUValido = validacao.validarId(idUser);
        const idSValido = validacao.validarId(idSave);
        const excluindoSave = await savesModel.excluirSave(idUser, idSave);

        if(!excluindoSave) throw new Error("Save não existe, não há o que apagar");

        return excluindoSave;
    }
}

module.exports = new SaveService();