const itemModel = require("../models/itensModel");
const validacoes = require("../utils/validacoes");

class ItensService{
    async buscarTodos(){
        const itens = await itemModel.buscarTodos();

        if(!itens || itens.length === 0){
            throw new Error("Não há itens a serem carregados.");
        }

        return itens;
    }
    async buscarPorId(idItem){
        const idValido = validacoes.validarId(idItem);

        const item = await itemModel.buscarPorId(idValido);

        if(!item){
            throw new Error(`Não há item com ID ${idValido}`);
        }

        return item;
    }
    async buscarPorTipo(tipo){
        const TIPOS_ITEM = {
            CONSUMIVEL: "CONSUMIVEL",
            EQUIPAMENTO: "EQUIPAMENTO"
        };

        const tipoValido = tipo.replace(/ /g,"_").toUpperCase();

        if(!Object.values(TIPOS_ITEM).includes(tipoValido)){
            throw new Error(`Não existem itens com tipo ${tipoValido}`);
        }

        return await itemModel.buscarPorTipo(tipoValido);
    }
    async buscarPorRaridade(raridade){
        const RARIDADES = {
            COMUM:"COMUM",
            RARO:"RARO",
            LENDARIO:"LENDARIO"
        };

        const raridadeValida = raridade.replace(/ /g,"_").toUpperCase();

        if(!Object.values(RARIDADES).includes(raridadeValida)){
            throw new Error(`Não existem itens com raridade ${raridadeValida}`);
        }

        return await itemModel.buscarPorRaridade(raridadeValida);
    }
    async buscarPorEfeito(efeito){
        const EFEITOS_ITEM = {
            NOVA_TENTATIVA:"NOVA_TENTATIVA",
            AUMENTA_INVENTARIO:"AUMENTA_INVENTARIO",
            PULA_QUESTAO:"PULA_QUESTAO",
            MOSTRA_RESUMO_MATERIA:"MOSTRA_RESUMO_MATERIA",
            RESOLVE_QUESTAO:"RESOLVE_QUESTAO",
            APAGA_RESPOSTA:"APAGA_RESPOSTA",
            REMOVER_TEMPO:"REMOVER_TEMPO",
            REMOVE_TEMPO_PROXIMA_QUESTAO:"REMOVE_TEMPO_PROXIMA_QUESTAO",
            MOSTRA_DICA:"MOSTRA_DICA",
            REVELA_RESPOSTA:"REVELA_RESPOSTA"
        };

        const efeitoValido = efeito.replace(/ /g, "_").toUpperCase();

        if(!Object.values(EFEITOS_ITEM).includes(efeitoValido)){
            throw new Error(`Não existem itens com efeito ${efeitoValido}`);
        }

        return await itemModel.buscarPorEfeito(efeitoValido);
    }
    async buscarDetalhesItem(idItem){
        const idValido = validacoes.validarId(idItem);

        const item = await itemModel.buscarPorId(idValido);

        if(!item){
            throw new Error(`Não existe item com ID ${idValido}`);
        }

        return item;
    }
    async sortearItens(quantidade = 4){
        // medo de ser uma copia original do banco, entao..
        const todosItens = [...await itemModel.buscarTodos()];

        if(!todosItens || todosItens.length < quantidade){
            throw new Error("Não há itens suficientes para realizar o sorteio.");
        }
        // criamos uma array para armazenar os itens sorteados
        const itensSorteados = [];
        // armazenamos o peso total dos itens, baseado nos pesos que cada um deles possui
        // essa linha soma todos os pesos dos itens na lista todosItens (item), começando do 0,
        // reduce esta aqui para transformar a lista completa em um unico numero (total) 
        // é como se fosse um for e estivesse contando (somando) os pesos de itens.
        
        while(itensSorteados.length < quantidade){
            const pesoTotal = todosItens.reduce((total, item) => total + item.peso, 0)
            const sorteio = Math.random() * pesoTotal;

            let acumulado = 0;

            for(let i = 0; i < todosItens.length; i++){
                // armazena o peso do a ser comparado na variavel acumulado
                acumulado += todosItens[i].peso;

                // se o numero sorteado for MENOR OU IGUAL a acumulado...
                if(sorteio <= acumulado){
                    // coloca o item dentro da array ItensSorteados
                    itensSorteados.push(todosItens[i]);
                    // retira da array de todosItens o item adicionado no ItensSorteados, 
                    // assim, não tem como o mesmo item aparecer 2 vezes na mesma geração de loja
                    todosItens.splice(i, 1);

                    break;
                }
            }
        }
        return itensSorteados;
    }
}

module.exports = new ItensService();