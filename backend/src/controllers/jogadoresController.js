const respostaApi = require('../utils/respostaApi');
const jogadorService = require('../services/jogadoresService');

class JogadoresController{
    async criar(req, res){
        try{
            const {nome} = req.body;

            const {idSave} = req.params;

            const novoJogador = await jogadorService.criar(idSave, nome);

            return res.status(201).json(respostaApi(true,"Jogador criado.", novoJogador));
        }
        catch(error){
            console.error(error);

            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async buscarPorSave(req, res){
        try{
            const {idSave} = req.params;
            
            const jogadores = await jogadorService.buscarPorSave(idSave);

            return res.status(200).json(respostaApi(true,"Jogadores encontrados.", jogadores));
        }
        catch(error){
            return res.status(404).json(respostaApi(false, error.message));
        }
    }
    async buscarPorId(req, res){
        try{
            const {idJogador} = req.params;
            
            const jogador = await jogadorService.buscarPorId(idJogador);

            return res.status(200).json(respostaApi(true,"Jogadores encontrados.", jogador));
        }
        catch(error){
            return res.status(404).json(respostaApi(false, error.message));
        }
    }
    async atualizar(req, res){
        try{
            const {idJogador} = req.params;

            const novosDados = req.body;

            const jogadorAtualizado = await jogadorService.atualizar(idJogador, novosDados);

            return res.status(200).json(respostaApi(true,"Jogador atualizado.", jogadorAtualizado));
        }
        catch(error){
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async excluir(req, res){
        try{
            const {idJogador} = req.params;
             
            await jogadorService.excluir(idJogador);

            return res.status(200).json(respostaApi(true,"Jogador deletado."));
        }
        catch(error){
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
}

module.exports = new JogadoresController();