const validacoes = require('../utils/validacoes');

const lojaModel = require('../models/lojasModel');
const itemService = require('../services/itensService');
const inventarioService = require('../services/inventariosService');

class LojasService{
    async criar(idSave){
        const idValido = validacoes.validarId(idSave);

        const lojaExiste = await lojaModel.buscarPorSave(idValido);

        if(lojaExiste){
            throw new Error("Este save já possui uma loja.");
        }

        return await lojaModel.criar(idValido);
    }
    async buscarPorSave(idSave){
        const idValido = validacoes.validarId(idSave);

        const loja = await lojaModel.buscarPorSave(idValido);

        if(!loja){
            throw new Error("Loja não encontrada.");
        }

        return loja;
    }
    async abrirLoja(idLoja){
        const idValido = validacoes.validarId(idLoja);

        // Sorteia os 4 itens
        const itens = await itemService.sortearItens(4);

        // Abre a loja
        const lojaAberta = await lojaModel.abrirLoja(idValido);

        // Guarda os itens sorteados
        await lojaModel.adicionarItensLoja(idValido, itens);

        return {
            loja: lojaAberta,
            itens
        };
    }
    async fecharLoja(idLoja){
        const idValido = validacoes.validarId(idLoja);

        // limpa a lista de itens antes de fechar a loja
        await lojaModel.limparItens(idValido);

        return await lojaModel.fecharLoja(idValido);
    }
    async verificarGeracao(idLoja){
        const loja = await lojaModel.buscarPorId(idLoja);

        if(!loja){
            throw new Error("Loja inexistente.");
        }

        /*
            Regra:
            - Primeiras 3 vezes pode falhar
            - Na quarta obrigatoriamente abre
        */
        if(loja.tentativas_fechada >= 3){
            return await this.abrirLoja(idLoja);
        }

        // calcula a chance de abrir
        const chanceAbrir = Math.random();
   
        // 50% de chance de abrir
        // verifica se chanceAbrir é MAIOR OU IGUAL a 50% (0.5), ou seja, é pra abrir
        if(chanceAbrir <= 0.5){
            return await this.abrirLoja(idLoja);
        }

        // caso não seja, atualizamos a contagem de tentativas para abrir
        await lojaModel.atualizarTentativa(idLoja);

        return {
            aberta:false,
            mensagem:"A cantina não está aberta hoje."
        };
    }
    async buscarItensLoja(idLoja){
        const idValido = validacoes.validarId(idLoja);

        const itens = await lojaModel.buscarItensLoja(idValido);

        if(!itens || itens.length === 0){
            throw new Error("A loja não possui itens disponíveis.");
        }

        return itens;
    }
    async comprarItem(idLoja, idItem, idJogador){
        const idLojaValido = validacoes.validarId(idLoja);
        const idItemValido = validacoes.validarId(idItem);
        const idJogadorValido = validacoes.validarId(idJogador);

        const itens = await lojaModel.buscarItensLoja(idLojaValido);

        const itemExiste = itens.find(item => item.item.id_item === idItemValido);

        if(!itemExiste){
            throw new Error("Este item não está disponível na loja.");
        }
        
        // Primeiro compra no inventário (ele sabe se o usuario tem dinheiro ou não)
        const compra = await inventarioService.adicionarItemComprado(idJogadorValido, 
            idItemValido, itemExiste.preco);
            
        // Depois remove da loja
        await lojaModel.removerItem(idLojaValido, idItemValido);

        return {
            item:itemExiste,
            compra
        };
    }
}

module.exports = new LojasService();