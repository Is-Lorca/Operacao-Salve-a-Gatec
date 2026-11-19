const jogadorService = require('../services/jogadoresService');

class EfeitosService {
    async executar(efeito, contexto) {
        switch (efeito) {
            case "PERMITE_NOVA_TENTATIVA":
                return await this.novaTentativa(contexto);

            case "AUMENTA_INVENTARIO":
                return await this.aumentaInventario(contexto);

            case "PULA_QUESTAO":
                return await this.pulaQuestao(contexto);

            case "MOSTRA_RESUMO_MATERIA":
                return await this.mostrarResumoMateria(contexto);

            case "RESOLVE_QUESTAO":
                return await this.resolveQuestao(contexto);

            case "RESOLVE_QUESTAO_FACIL":
                return await this.resolveQuestaoFacil(contexto);

            case "APAGA_RESPOSTA_SEM_PENALIDADE":
                return await this.apagaResposta(contexto);

            case "REMOVE_TEMPO_PROXIMA_QUESTAO":
                return await this.removerTempoProximaQuestao(contexto);

            case "MOSTRA_DICA":
                return await this.mostrarDica(contexto);

            case "REVELA_RESPOSTA":
                return await this.revelarResposta(contexto);

            default:
                return {
                    sucesso: false,
                    mensagem: `Efeito '${efeito}' inexistente.`
                };
        }
    }

    // Método auxiliar para encontrar a alternativa com correta: true no padrão do seu QAModel
    _obterAlternativaCorreta(questao) {
        if (questao.alternativas && Array.isArray(questao.alternativas)) {
            return questao.alternativas.find(alt => alt.correta === true) || null;
        }
        return questao.resposta || null;
    }

    async novaTentativa(contexto) {
        return {
            sucesso: true,
            mensagem: "Você ganhou uma nova tentativa para esta questão.",
            novaTentativa: true
        };
    }

    async aumentaInventario(contexto) {
        const jogador = await jogadorService.buscarPorId(contexto.id_jogador);
        const novaCapacidade = Number(jogador.capacidade_inventario) + 2;

        const atualizado = await jogadorService.atualizar(contexto.id_jogador, {
            capacidade_inventario: novaCapacidade
        });

        return {
            sucesso: true,
            mensagem: "Capacidade do inventário aumentada em 2 espaços.",
            capacidade_inventario: atualizado.capacidade_inventario
        };
    }

    async pulaQuestao(contexto) {
        return {
            sucesso: true,
            mensagem: "Questão pulada! Você poderá respondê-la depois.",
            questaoPulada: true
        };
    }

    async mostrarResumoMateria(contexto) {
        return {
            sucesso: true,
            mensagem: "Resumo da matéria liberado.",
            abrirResumo: true
        };
    }

    async resolveQuestao(contexto) {
        if (!contexto.questao) {
            return {
                sucesso: false,
                mensagem: "Este item só pode ser usado durante uma questão."
            };
        }

        // Verifica recarga tanto se estiver em Prova quanto em Atividade
        const emRecarga = (contexto.prova && contexto.prova.ia_em_recarga) ||
            (contexto.atividade && contexto.atividade.ia_em_recarga);

        if (emRecarga) {
            return {
                sucesso: false,
                mensagem: "A IA do Plutônio está em recarga! Responda mais 1 questão para usá-la novamente."
            };
        }

        const correta = this._obterAlternativaCorreta(contexto.questao);

        return {
            sucesso: true,
            mensagem: "A IA do Plutônio resolveu a questão para você! Ela ficará em recarga na próxima questão.",
            respostaCorreta: correta,
            ativarRecargaIA: true
        };
    }

    async resolveQuestaoFacil(contexto) {
        if (!contexto.questao) {
            return {
                sucesso: false,
                mensagem: "Este item só pode ser usado durante uma questão."
            };
        }

        // Padrão do QAModel: facil = 1-2, medio = 3-4, dificil = 5-7
        const nivel = Number(contexto.questao.nivel);
        if (!nivel || nivel > 2) {
            return {
                sucesso: false,
                mensagem: "A Calculadora Quântica só resolve questões fáceis (nível 1 ou 2)."
            };
        }

        const correta = this._obterAlternativaCorreta(contexto.questao);

        return {
            sucesso: true,
            mensagem: "Questão fácil resolvida automaticamente!",
            respostaCorreta: correta
        };
    }

    async apagaResposta(contexto) {
        return {
            sucesso: true,
            mensagem: "Resposta apagada sem penalidade.",
            limparResposta: true
        };
    }

    async removerTempoProximaQuestao(contexto) {
        return {
            sucesso: true,
            mensagem: "Cronômetro desativado para a próxima questão!",
            removerTempoProximaQuestao: true
        };
    }

    async mostrarDica(contexto) {
        if (!contexto.questao) {
            return {
                sucesso: false,
                mensagem: "Este item só pode ser usado durante uma questão."
            };
        }

        return {
            sucesso: true,
            mensagem: "Dica revelada!",
            dica: contexto.questao.dica || "Esta questão não possui dica cadastrada."
        };
    }

    async revelarResposta(contexto) {
        if (!contexto.questao) {
            return {
                sucesso: false,
                mensagem: "Este item só pode ser usado durante uma questão."
            };
        }

        const correta = this._obterAlternativaCorreta(contexto.questao);

        return {
            sucesso: true,
            mensagem: "O Cajado revelou a resposta correta!",
            resposta: correta
        };
    }
}

module.exports = new EfeitosService();