const respostaApi = require('../utils/respostaApi');
const lojaService = require('../services/lojasService');

class LojaController{
    async criar(req, res){
        try{
            const {idSave} = req.params;
    
            const loja = await lojaService.criar(idSave);
    
            return res.status(201).json(respostaApi(true, "Loja criada", loja));
        }
        catch(error){
            return res.status(400).json(respostaApi(false, error.message));
        }
    }   
    async buscarPorSave(req, res){
        try{
            const {idSave} = req.params;
    
            const loja = await lojaService.buscarPorSave(idSave);
    
            return res.status(200).json(respostaApi(true, 
                `Loja encontrada usando o ID de save ${idSave}`, loja));
        }
        catch(error){
            return res.status(404).json(respostaApi(false, error.message));
        }
    }
    async abrirLoja(req, res){
        try{
            const {idLoja} = req.params;
    
            const loja = await lojaService.abrirLoja(idLoja);
    
            return res.status(200).json(respostaApi(true, 
                `Loja aberta usando o ID ${idLoja}`, loja));
        }
        catch(error){
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async fecharLoja(req, res){
        try{
            const {idLoja} = req.params;
    
            const loja = await lojaService.fecharLoja(idLoja);
    
            return res.status(200).json(respostaApi(true, 
                `Loja fechada usando o ID ${idLoja}`, loja));
        }
        catch(error){
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async verificarGeracao(req, res){
        try{
            const {idLoja} = req.params;
    
            const resultado = await lojaService.verificarGeracao(idLoja);
    
            return res.status(200).json(respostaApi(true, 
                `Loja verificada para abrir (ou não) usando o ID ${idLoja}`, resultado));
        }
        catch(error){
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async buscarItensLoja(req, res){
        try{
            const {idLoja} = req.params;
    
            const loja = await lojaService.buscarItensLoja(idLoja);
    
            return res.status(200).json(respostaApi(true, 
                `Itens retornados usando o ID de loja ${idLoja}`, loja));
        }
        catch(error){
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async comprarItem(req,res){
        try{
            const {idLoja, idItem} = req.params;
            const {idJogador} = req.body;

            const compra = await lojaService.comprarItem(idLoja, idItem, idJogador);

            return res.status(200).json(respostaApi(true, "Item comprado com sucesso.", compra));
        }
        catch(error){
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
}
/*
    criar(idSave)
    buscarPorSave(idSave)
    abrirLoja(idLoja)
    fecharLoja(idLoja)
    verificarGeracao(idLoja)
    buscarItensLoja(idLoja)
    comprarItem(idLoja, idItem) -> passar para inventario
*/

module.exports = new LojaController();