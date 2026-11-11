const respostaApi = require("../utils/respostaApi");
const authService = require("../services/authService");

class AuthController {
    async cadastrar(req, res) {
        try {
            const usuario = await authService.cadastrar(req.body);

            return res.status(201).json(respostaApi(true, "Usuário criado com sucesso.", usuario));
        } 
        catch (error) {
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async login(req, res) {
        try {
            const {email, senha} = req.body;

            const resultado = await authService.login(email, senha);

            return res.status(200).json(respostaApi(true, "Login realizado com sucesso.", resultado));
        } 
        catch (error) {
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async me(req, res) {
        return res.json(respostaApi(true, "Usuário autenticado.", req.usuarioLogado));
    }
    async logout(req, res) {
        try {
            const resultado = await authService.logout();

            return res.json(respostaApi(true, resultado.message));
        } 
        catch (error) {
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async renovarToken(req, res) {
        try {
            const {refreshToken} = req.body;

            const tokens = await authService.renovarToken(refreshToken);

            return res.json(respostaApi(true, "Token renovado.", tokens));
        } 
        catch (error) {
            return res.status(401).json(respostaApi(false, error.message));
        }
    }
    async esqueciSenha(req, res) {
        try {
            const resultado = await authService.esqueciSenha(req.body.email);

            return res.json(respostaApi(true, resultado.message));
        } 
        catch (error) {
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async trocarSenha(req, res) {
        try {
            const {token, novaSenha} = req.body;

            const resultado = await authService.trocarSenha(token, novaSenha);

            return res.json(respostaApi(true, resultado.message));
        } 
        catch (error) {
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async verificarSessao(req,res){
        return res.json(respostaApi(true, "Sessão válida.", req.usuarioLogado));
    }
}

module.exports = new AuthController();