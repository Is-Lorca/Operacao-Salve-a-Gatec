const respostaApi = require('../utils/respostaApi');
const authService = require('../services/authService');

class AuthController{
    async cadastrar(req, res){
        try{
            const usuario = await authService.cadastrar(req.body);

            return res.status(200).json(respostaApi(true, "Usuário criado com sucesso.", usuario));
        }
        catch(error){
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async login(req, res){
        try{
            const {email, senha} = req.body;

            const logado = await authService.login(email, senha);

            return res.status(200).json(respostaApi(true, "Usuario logado com sucesso.", logado));
        }
        catch(error){
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
}

module.exports = new AuthController();