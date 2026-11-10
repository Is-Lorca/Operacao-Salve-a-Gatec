const bcrypt = require("bcrypt");

const usuarioModel = require("../models/usuariosModel");
const validacoes = require("../utils/validacoes");

class AuthService {
    async cadastrar(dados) {
        validacoes.validarNome(dados.nome);
        const email = validacoes.validarEmail(dados.email);
        validacoes.validarSenha(dados.senha_hash);

        const usuarioExistente = await usuarioModel.buscarPorEmailCompleto(email);

        if(usuarioExistente && usuarioExistente.ativo) {
            throw new Error("E-mail já cadastrado.");
        }

        const senhaHash = await bcrypt.hash(dados.senha_hash, 10);

        return await usuarioModel.criar({
            nome: dados.nome,
            email,
            senha_hash: senhaHash,
        });
    }
    async login(email, senha) {
        email = validacoes.validarEmail(email);

        if(!senha){
            throw new Error("Senha obrigatória.");
        }

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
        return usuario;
    }
}

module.exports = new AuthService();