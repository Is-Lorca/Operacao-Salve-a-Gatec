const jogadorService = require('../services/jogadoresService');

class EfeitosService{
    async executar(efeito, contexto){
        switch(efeito){
            case "NOVA_TENTATIVA":
                return await this.novaTentativa(contexto);

            case "AUMENTA_INVENTARIO":
                return await this.aumentaInventario(contexto);

            case "PULA_QUESTAO":
                return await this.pulaQuestao(contexto);

            case "MOSTRA_RESUMO_MATERIA":
                return await this.mostrarResumoMateria(contexto);

            case "RESOLVE_QUESTAO":
                return await this.resolveQuestao(contexto);

            case "APAGA_RESPOSTA":
                return await this.apagaResposta(contexto);

            case "REMOVER_TEMPO":
                return await this.removerTempo(contexto);

            case "REMOVE_TEMPO_PROXIMA_QUESTAO":
                return await this.removerTempoProximaQuestao(contexto);

            case "MOSTRA_DICA":
                return await this.mostrarDica(contexto);
                
            case "REVELA_RESPOSTA":
                return await this.revelarResposta(contexto);

            default:
                throw new Error("Efeito inexistente");
        }
    }
    async novaTentativa(contexto){
        return {
            novaTentativa:true
        };
    }
    async aumentaInventario(contexto){
        const jogador = await jogadorService.buscarPorId(contexto.id_jogador);

        const novaCapacidade = jogador.capacidade_inventario + 3;

        const atualizado = await jogadorService.atualizar(contexto.id_jogador, // precisa importar o jogadorService?
            {
                capacidade_inventario: novaCapacidade
            });
        
        return {
            mensagem:"Capacidade do inventário aumentada.",
            capacidade_inventario: atualizado.capacidade_inventario
        };
    }
    async pulaQuestao(contexto){
        return {
            questaoPulada: true
        };
    }
    async mostrarResumoMateria(contexto){
        return {
            abrirResumo: true
        };
    }
    async resolveQuestao(contexto){
        return{
            respostaCorreta: contexto.questao.resposta
        };
    }
    async apagaResposta(contexto){
        return{
            limparResposta: true
        };
    }
    async removerTempo(contexto){
        return{
            tempoExtra: -30
        };
    }
    async removerTempoProximaQuestao(contexto){
        return{
            proximaQuestaoTempoExtra: -30
        };
    }
    async mostrarDica(contexto){
        return{
            dica: contexto.questao.dica
        };
    }
    async revelarResposta(contexto){
        return{
            resposta: contexto.questao.resposta
        };
    }
}

module.exports = new EfeitosService();