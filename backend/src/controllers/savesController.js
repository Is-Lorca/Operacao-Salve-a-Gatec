const respostaApi = require('../utils/respostaApi');
const savesService = require('../services/savesService');

class SaveController {
    async criarNovoJogo(req, res){
        try{
            const { nome_save } = req.body;

            const idUsuario = req.usuarioLogado.id_usuario;

            const novoSave =
                await savesService.criarNovoJogo(
                    nome_save,
                    idUsuario
                );

            return res.status(201).json(respostaApi(true,"Save criado.", novoSave));
        }
        catch(error){
            console.error(error);

            return res.status(400).json(
                respostaApi(false, error.message)
            );
        }
    }
    async carregarTodos(req,res){
        try{
            const idUsuario = req.usuarioLogado.id_usuario;

            const saves =
                await savesService.carregarTodos(idUsuario);

            return res.json(respostaApi(true,"Saves encontrados.", saves));
        }
        catch(error){
            return res.status(404).json(respostaApi(false, error.message));
        }
    }
    async carregarSave(req,res){
        try{
            const idUsuario = req.usuarioLogado.id_usuario;

            const {idSave} = req.params;

            const save = await savesService.carregarSaves(idUsuario, idSave);

            return res.json(respostaApi(true,"Save encontrado.", save));
        }
        catch(error){
            return res.status(404).json(respostaApi(false, error.message));
        }
    }
    async atualizarSave(req,res){
        try{
            const idUsuario = req.usuarioLogado.id_usuario;

            const {idSave} = req.params;

            const save = await savesService.atualizarSave(idUsuario, idSave, req.body);

            return res.json(respostaApi(true, "Save atualizado.",save));
        }
        catch(error){
            return res.status(404).json(respostaApi(false,error.message));
        }
    }
    async deletarSave(req,res){
        try{
            const idUsuario = req.usuarioLogado.id_usuario;

            const {idSave} = req.params;

            await savesService.excluindoSave(idUsuario, idSave);

            return res.json(respostaApi(true, "Save deletado."));
        }
        catch(error){
            return res.status(404).json(respostaApi(false,error.message));
        }
    }
}

module.exports = new SaveController();