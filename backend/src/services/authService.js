const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usuarioModel = require("../models/usuariosModel");
const validacoes = require("../utils/validacoes");
const enviaEmail = require("../utils/email");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

class AuthService {
    async gerarTokens(usuario){
        const payload = {
            id_usuario: usuario.id_usuario,
            email: usuario.email
        };

        const tokenAcesso = jwt.sign(payload, JWT_SECRET, {expiresIn: "15m"});
        const tokenRefresh = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: "7d"});

        return {tokenAcesso, tokenRefresh};
    }
    async cadastrar(dados) {
        validacoes.validarNome(dados.nome);
        const email = validacoes.validarEmail(dados.email);
        validacoes.validarSenha(dados.senha);

        const usuarioExistente = await usuarioModel.buscarPorEmailCompleto(email);

        if(usuarioExistente && usuarioExistente.ativo) {
            throw new Error("E-mail já cadastrado.");
        }

        const senhaHash = await bcrypt.hash(dados.senha, 10);

        const usuario = await usuarioModel.criar({
            nome: dados.nome,
            email,
            senha_hash: senhaHash,
        });
        delete usuario.senha_hash;
        return usuario;
    }
    async login(email, senha) {
        email = validacoes.validarEmail(email);
        validacoes.validarSenha(senha);

        const usuario = await usuarioModel.buscarPorEmailCompleto(email);
        if (!usuario || !usuario.ativo) {
            throw new Error("E-mail ou senha inválidos.");
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaCorreta) {
            throw new Error("E-mail ou senha inválidos.");
        }

        await usuarioModel.atualizarUltimoLogin(usuario.id_usuario);
        delete usuario.senha_hash; // isso remove a propriedade antes de enviar usuário
        // NUNCA devemos enviar a senha hash para o front!

        const tokens = await this.gerarTokens({
                id_usuario: usuario.id_usuario,
                email: usuario.email
            });

        // agora retorna {usuario + tokens}
        return {usuario, ...tokens};
    }
    async logout(token){
        return {message: "Logout efetuado com sucesso. Remova o token no cliente."};
    }
    async verificarSessao(token){
        if(!token){
            throw new Error("Token não fornecido.");
        }
        try{
            const decodificado = jwt.verify(token, JWT_SECRET);

            const usuario = await usuarioModel.buscarPorId(decodificado.id_usuario);
            if(!usuario){
                throw new Error("Usuário inválido ou inativo.");
            }
            return usuario;
        }
        catch(error){
            throw new Error("Sessão inválida ou expirada.");
        }
    }
    async esqueciSenha(email){
        email = validacoes.validarEmail(email);
        const usuario = await usuarioModel.buscarPorEmail(email);

        if(!usuario){
            // por segurança, não falamos que o email não existe
            return {message: "Se o e-mail estiver cadastrado, as instruções foram enviadas."};
        }

        const tokenRecuperacao = jwt.sign(
            {id_usuario: usuario.id_usuario, acao: "recuperar_senha"},
            JWT_SECRET,
            {expiresIn: "1h"}
        );
       
        try{
            await enviaEmail.enviarEmailRec(usuario.email, tokenRecuperacao);

            return {message: "Se o e-mail estiver cadastrado, as instruções foram enviadas."}
        }
        catch(error){
            console.error("Erro ao enviar e-mail de recuperação:", error);
             throw new Error("Não foi possível processar a solicitação no momento.");
        }
    }
    async trocarSenha(tokenRecuperacao, novaSenha){
        validacoes.validarSenha(novaSenha);

        try {
            const decodificado = jwt.verify(tokenRecuperacao, JWT_SECRET);
            
            if (decodificado.acao !== "recuperar_senha") {
                throw new Error("Token inválido para esta operação.");
            }

            const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

            const usuarioAtualizado = await usuarioModel.atualizar(decodificado.id_usuario, {
                senha_hash: novaSenhaHash
            });

            if (!usuarioAtualizado) {
                throw new Error("Não foi possível atualizar a senha.");
            }

            return { success: true, message: "Senha alteradas com sucesso." };
        } catch (error) {
            throw new Error("Token de recuperação inválido ou expirado.");
        }
    }
    async renovarToken(refreshToken) {
        if (!refreshToken) {
            throw new Error("Refresh token não fornecido.");
        }

        try {
            const decodificado = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
            
            const usuario = await usuarioModel.buscarPorId(decodificado.id_usuario);
            if (!usuario) {
                throw new Error("Usuário não encontrado.");
            }

            return await this.gerarTokens(usuario);
        } catch (error) {
            throw new Error("Refresh token inválido ou expirada. Faça login novamente.");
        }
    }
}

module.exports = new AuthService();