const savesModel = require('../models/savesModel');

class SaveService {
    // criar
    async criarNovoJogo(nome, idUser){
        if(!nome || nome.trim() === "" || nome.length > 25) throw new Error("Nome do save é obrigatório.")
        if(!idUser) throw new Error("ID de Usuário necessário.")

        return await savesModel.criar({nome_save: nome, id_usuario: idUser});
    }
    // buscar
    async carregarTodos(idUser){
        const saves = await savesModel.buscarSaves(idUser);

        if(!saves || saves.length === 0){
            throw new Error("Não há saves a serem carregados.");
        }

        return saves;
    }
    // buscarIdUsuario
    async carregarSaves(idUser, idSave){
        const save = await savesModel.buscarSavesId(idUser, idSave);

        if(!save) throw new Error("Save não encontrado.");

        return save;
    }
    async 
    // atualizar
    async atualizarSave(idUser, idSave, novosDados){
        const saveAtualizado = await savesModel.atualizarSave(idUser, idSave, novosDados);

        if(saveAtualizado === null){
            throw new Error("Save não existe, não há o que atualizar");
        }

        return saveAtualizado;
    }
    // excluir
    async excluindoSave(idUser, idSave){
        const excluindoSave = await savesModel.excluirSave(idUser, idSave);

        if(!excluindoSave) throw new Error("Save não existe, não há o que apagar");

        return excluindoSave;
    }
}

module.exports = new SaveService();