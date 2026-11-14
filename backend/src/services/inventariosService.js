const validacoes = require("../utils/validacoes");

const inventarioModel = require("../models/inventariosModel");
const itemService = require("../services/itensService");
const jogadorService = require("../services/jogadoresService");
const efeitosService = require("../services/efeitosService");

class InventarioService {
    async buscarPorJogador(idJogador) {
        const idValido = validacoes.validarId(idJogador);

        const inventario = await inventarioModel.buscarPorJogador(idValido);

        if (!inventario) {
        throw new Error("Inventário não encontrado.");
        }

        return inventario;
    }
    async adicionarItem(idJogador, idItem) {
        const jogadorValido = validacoes.validarId(idJogador);
        const itemValido = validacoes.validarId(idItem);

        // Busca dados do item
        const item = await itemService.buscarDetalhesItem(itemValido);

        // Verifica se jogador já possui
        const itemInventario = await inventarioModel.buscarItem(jogadorValido, itemValido);

        // Caso já tenha o item
        if (itemInventario) {
            if (item.acumulativo) {
                const novosUsos = itemInventario.usos_restantes + item.usos;

                const novaQuantidade = itemInventario.quantidade + 1;

                return await inventarioModel.atualizar(itemInventario.id_inventario, {
                    usos_restantes: novosUsos,
                    quantidade: novaQuantidade
                });
            }

            throw new Error("Este item não é acumulativo e o jogador já possui.");
        }

        // Caso seja item novo        
        await this.verificarEspacoInventario(jogadorValido);
        
        const novoItem = {
            id_jogador: jogadorValido,
            id_item: itemValido,
            quantidade: 1,
            usos_restantes: item.usos,
        };

        return await inventarioModel.criar(novoItem);
    }
    async usarItem(idJogador, idItem) {
        const jogadorValido = validacoes.validarId(idJogador);
        const itemValido = validacoes.validarId(idItem);

        const itemInventario = await inventarioModel.buscarItem(jogadorValido, itemValido);
        if(!itemInventario){
            throw new Error("Jogador não possui esse item.");
        }
        
        // Contexto padrão enviado para os efeitos. Colocamos somente IDs e informações
        // necessárias para aquele efeito. -> MUITO IMPORTANTE
        const contexto = {
            id_jogador: jogadorValido,
            jogador: await jogadorService.buscarPorId(jogadorValido),
            item: {
                id_item: itemInventario.id_item,
                nome: itemInventario.item.nome,
                efeito: itemInventario.item.efeito
            },

            // Futuramente serão preenchidos
            // quando chegar nesses módulos
            atividade: null,
            prova: null,
            questao: null
        };
        // Executa efeito do item
        const resultado = await efeitosService.executar(itemInventario.item.efeito, contexto);

        if(!resultado.sucesso){
            return erro;
        }

        let novosUsos = itemInventario.usos_restantes - 1;
        if(novosUsos <= 0){
            await inventarioModel.excluir(itemInventario.id_inventario);

            return {
                mensagem: "Item consumido.",
                efeito: resultado
            };
        }

        await inventarioModel.atualizar(itemInventario.id_inventario,
            {
                usos_restantes: novosUsos
            }
        );

        return {
            mensagem: "Item utilizado.",
            efeito: resultado
        };
    }
    async verificarEspacoInventario(idJogador){
        const jogador = await jogadorService.buscarPorId(idJogador);

        const quantidade = await inventarioModel.buscarQuantidadeItens(idJogador);

        if(quantidade >= jogador.capacidade_inventario){
            throw new Error("Inventário cheio.");
        }

        return true;
    }
    async removerItem(idInventario) {
        const idValido = validacoes.validarId(idInventario);

        return await inventarioModel.excluir(idValido);
    }
    async adicionarItemComprado(idJogador, idItem, preco){
        const jogadorValido = validacoes.validarId(idJogador);
        const itemValido = validacoes.validarId(idItem);

        const jogador = await jogadorService.buscarPorId(jogadorValido);

        if(jogador.dinheiro < preco){
            throw new Error("Jogador não possui dinheiro suficiente.");
        }

        await this.adicionarItem(jogadorValido, itemValido);

        await jogadorService.atualizar(jogadorValido,
            {
                dinheiro: jogador.dinheiro - preco
            }
        );

        return {
            mensagem:"Item comprado com sucesso.",
            dinheiroRestante: jogador.dinheiro - preco
        };
    }
}

module.exports = new InventarioService();
