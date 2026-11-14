const respostaApi = require("../utils/respostaApi");
const inventarioService = require("../services/inventariosService");

class InventariosController {
    async buscarPorId(req, res) {
        try {
            const { idInventario } = req.params;

            const inventario = await inventarioService.buscarPorId(idInventario);

            return res.status(200).json(respostaApi(true, "Inventário encontrado.", inventario));
        } 
        catch (error) {
            return res.status(404).json(respostaApi(false, error.message));
        }
    }
    async buscarPorJogador(req, res) {
        try {
            const {idJogador} = req.params;

            const inventario = await inventarioService.buscarPorJogador(idJogador);

            return res.status(200).json(respostaApi(true, "Inventário encontrado.", inventario));
        } 
        catch (error) {
            return res.status(404).json(respostaApi(false, error.message));
        }
    }
    async adicionarItem(req, res) {
        try {
            const { idJogador, idItem } = req.params;

            const item = await inventarioService.adicionarItem(idJogador, idItem);

            return res.status(201).json(respostaApi(true, "Item adicionado ao inventário.", item));
        } 
        catch (error) {
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async usarItem(req, res) {
        try {
            const {idJogador, idItem} = req.params;

            const resultado = await inventarioService.usarItem(idJogador, idItem);

            return res.status(200).json(respostaApi(true, "Item utilizado.", resultado));
        } 
        catch (error) {
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async removerItem(req, res) {
        try {
            const {idInventario} = req.params;

            await inventarioService.removerItem(idInventario);

            return res.status(200).json(respostaApi(true, "Item removido do inventário."));
        } 
        catch (error) {
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
}

module.exports = new InventariosController();