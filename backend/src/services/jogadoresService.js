const validacoes = require('../utils/validacoes');
const jogadorModel = require('../models/jogadoresModel');

class JogadorService{
    async criar(id_save, nome){
        validacoes.validarNome(nome);
        const idValido = validacoes.validarId(id_save);

        const jogador = await jogadorModel.criar({nome: nome, id_save: idValido});

        return jogador;
    }
    async buscarPorSave(idSave){
        const idValido = validacoes.validarId(idSave);

        const jogador = await jogadorModel.buscarPorSave(idValido);

        return jogador;
    }
    async buscarPorId(idJogador){
        const idValido = validacoes.validarId(idJogador);

        const jogador = await jogadorModel.buscarPorId(idValido);

        return jogador;
    }
    async atualizar(idJogador, novosDados){
        const idValido = validacoes.validarId(idJogador);

        const jogadorExiste = await jogadorModel.buscarPorId(idValido);
        if(!jogadorExiste){
            throw new Error('Jogador não existe.')
        }
        
        const jogadorAtualizado = await jogadorModel.atualizar(idValido, novosDados);

        if(jogadorAtualizado === null || !jogadorAtualizado){
            throw new Error('Erro ao atualizar jogador.')
        }

        return jogadorAtualizado;
    }
    async excluir(idJogador){
        const idValido = validacoes.validarId(idJogador);

        const jogadorExiste = await jogadorModel.buscarPorId(idValido);
        if(!jogadorExiste){
            throw new Error('Jogador não existe.')
        }

        const jogadorDeletado = await jogadorModel.excluir(idValido);

        if(!jogadorDeletado){
            throw new Error('Erro ao deletar jogador.')
        }

        return jogadorDeletado;
    }
}

module.exports = new JogadorService();