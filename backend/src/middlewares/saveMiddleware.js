const saveModel = require("../models/savesModel");
const jogadorModel = require('../models/jogadoresModel');

module.exports = async (req, res, next) => {
    try {
        const idSave = req.headers["x-save-id"];

        if(!idSave){
            return res.status(400).json({
                sucesso:false,
                mensagem:"Nenhum save selecionado.",
                data:null
            });
        }

        const idUsuario = req.usuarioLogado.id_usuario;

        const save = await saveModel.buscarSavesId(idUsuario, idSave);

        if(!save){
            return res.status(403).json({
                sucesso:false,
                mensagem:"Este save não pertence ao usuário ou está inativo.",
                data:null
            });
        }

        req.save = save;

        req.jogador = await jogadorModel.buscarPorSave(save.id_save);

        return next();
    } 
    catch(error){
        return res.status(500).json({
            sucesso:false,
            mensagem:error.message,
            data:null
        });
    }
};