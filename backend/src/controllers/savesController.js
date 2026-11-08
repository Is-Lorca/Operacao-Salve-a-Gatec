const respostaApi = require('../utils/respostaApi');
const savesService = require('../services/savesService');

class SaveController {
    async criarNovoJogo(req, res){
        try{
            // desestruturação de um objeto -> {nome_save}, ou seja, extração de propriedades de um 
            // objeto, transformando-os em variáveis independentes
            // do lado esquerdo o objeto é desestruturado
            // do lado direito um novo objeto é criado
            const {nome_save, id_usuario} = req.body;

            const novoSave = await savesService.criarNovoJogo(nome_save, id_usuario);

            return res.status(201).json(
                respostaApi(true, "Save criado", novoSave)
            );
        }   
        catch(error){
            console.error(error);
            res.status(400).json(
                // error.message para escrever o que estava escrito de erro no Service
                respostaApi(false, error.message || "Não foi possivel criar um novo save", null)
            );
        }
    }
    async carregarTodos(req, res){
        try{
            const {idUser} = req.params;

            const saves = await savesService.carregarTodos(idUser);
            
            return res.status(200).json(
                respostaApi(true, "Saves encontrados", saves)
            );
        }
        catch(error){
            console.error(error);
            res.status(404).json(
                respostaApi(false, error.message || "Saves não encontrados", null)
            );
        }
    }
    async carregarSave(req, res){
        try{
            const {idUser, idSave} = req.params;

            const save = await savesService.carregarSaves(idUser, idSave);

            return res.status(200).json(
                respostaApi(true, "Save encontrado", save)
            );
        }
        catch(error){
            console.error(error);
            res.status(404).json(
                respostaApi(false, error.message || "Save não encontrado", null)
            );
        }
    }
    async atualizarSave(req, res){
        try{
            const {idUser, idSave} = req.params;
            const novosDados = req.body;

            const saveAtualizado = await savesService.atualizarSave(idUser, idSave, novosDados);
            
            return res.status(200).json(
                respostaApi(true, "Save encontrado e atualizado", saveAtualizado)
            );
        }
        catch(error){
            console.error(error);
            res.status(404).json(
                respostaApi(false, error.message || "Save não encontrado, nada a ser atualizado", null)
            );
        }
    }
    async deletarSave(req, res){
        try{
            const {idUser, idSave} = req.params;

            const saveDeletado = await savesService.excluindoSave(idUser, idSave);

            return res.status(200).json(
                respostaApi(true, "Save deletado com sucesso", saveDeletado)
            );
        }
        catch(error){
            console.error(error);
            res.status(404).json(
                respostaApi(false, error.message || "Save não encontrado", null)
            );
        }
    }
}

module.exports = new SaveController();