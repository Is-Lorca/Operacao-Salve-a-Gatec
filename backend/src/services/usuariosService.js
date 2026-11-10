const validacoes = require('../utils/validacoes');
const userModel = require('../models/usuariosModel');

class UsuariosService {
    async buscarPorId(idUser){
        const idValido = validacoes.validarId(idUser);

        const usuario = await userModel.buscarPorId(idValido);

        if(!usuario){
            throw new Error("Usuário não encontrado.");
        }

        return usuario;
    }
    async buscarPorEmail(emailInserido){
        const email = validacoes.validarEmail(emailInserido);
        const usuario = await userModel.buscarPorEmail(email);

        if(!usuario){
            throw new Error("Usuário não encontrado.");
        }

        return usuario;
    }
    async buscarTodos(){
        const usuario = await userModel.buscarTodos();

        if(!usuario || usuario.length === 0){
            throw new Error("Não há usuários a serem carregados.");
        }

        return usuario;
    }
    async atualizar(idUser, novosDados){
        const idValido = validacoes.validarId(idUser);
        const dadosPermitidos = {};

        if(novosDados.nome){
            validacoes.validarNome(novosDados.nome);
            dadosPermitidos.nome = novosDados.nome;
        }

        if(novosDados.email){
            const email = validacoes.validarEmail(novosDados.email);
            const emailExistente =
                await userModel.buscarPorEmailCompleto(email);
            if( emailExistente &&
                emailExistente.id_usuario !== idValido){
                throw new Error("E-mail já pertence a um usuário.");
            }
            dadosPermitidos.email = email;
        }

        if(novosDados.senha_hash){
            validacoes.validarSenha(novosDados.senha_hash);
            dadosPermitidos.senha_hash = novosDados.senha_hash;
        }

        const usuarioAtualizado = await userModel.atualizar(idValido, dadosPermitidos);

        if(!usuarioAtualizado){
            throw new Error("Usuário não encontrado, nada a atualizar.");
        }

        return usuarioAtualizado;
    }
    async deletar(idUser){
        const idValido = validacoes.validarId(idUser);
        const usuarioDeletado = await userModel.deletar(idValido);

        if(!usuarioDeletado){
            throw new Error("Usuário não existe, nada a apagar.")
        }

        return usuarioDeletado;
    }
    async atualizarLogin(idUser){
        const idValido = validacoes.validarId(idUser);
        const loginAtualizado = await userModel.atualizarUltimoLogin(idValido);

        if(loginAtualizado === null || !loginAtualizado){
            throw new Error("Erro, login não atualizado.")
        }

        return loginAtualizado;
    }
}

module.exports = new UsuariosService();