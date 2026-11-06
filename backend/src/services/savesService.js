const savesModel = require('../models/savesModel');

class SaveService {
    // criar
    async criarNovoJogo(nome){
        if(!nome || nome.trim() === "" || nome.length > 25) throw new Error("Nome do save é obrigatório.")
        
        return await savesModel.criar({nome_save: nome});
    }
    // buscar
    async carregarTodos(){
        const saves = await savesModel.buscarSaves();

        if(!saves || saves.length === 0){
            throw new Error("Não há saves a serem carregados.");
        }

        return saves;
    }
    // buscarId
    async carregarJogo(id){
        const save = await savesModel.buscarSavesId(id);

        if(!save) throw new Error("Save não encontrado.");

        return save;
    }
    // atualizar
    async atualizarSave(id, novosDados){
        const saveAtualizado = await savesModel.atualizarSave(id, novosDados);

        if(saveAtualizado === null){
            throw new Error("Save não existe, não há o que atualizar");
        }

        return saveAtualizado;
    }
    // excluir
    async excluindoSave(id){
        const excluindoSave = await savesModel.excluirSave(id);

        if(!excluindoSave) throw new Error("Save não existe, não há o que apagar");

        return excluindoSave;
    }
}

module.exports = new SaveService();