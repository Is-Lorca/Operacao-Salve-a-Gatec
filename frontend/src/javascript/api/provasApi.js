
import { fetchComAuth } from './helper/fetchComAuth.js';
import API_URL from './api.js';

const PROVA_URL = `${API_URL}/prova`;

export const provasApi = {

    // Gera uma prova ou recupera uma prova ainda não finalizada
    async gerarProva() {

        return await fetchComAuth(PROVA_URL, {
            method: 'POST'
        });
    },


    // Busca a prova do save selecionado
    async buscarProva() {

        return await fetchComAuth(PROVA_URL, {
            method: 'GET'
        });
    },


    // Busca as questões de uma prova
    async buscarQuestoes(idProva) {

        return await fetchComAuth(
            `${PROVA_URL}/${idProva}/questoes`,
            {
                method: 'GET'
            }
        );
    },


    // Registra a resposta de uma questão
    async responderQuestao(idProva, idQuestao, acertou) {

        return await fetchComAuth(
            `${PROVA_URL}/${idProva}/questao`,
            {
                method: 'PUT',

                body: JSON.stringify({
                    idQuestao: idQuestao,
                    acertou: acertou
                })
            }
        );
    },


    // Finaliza a prova e recebe o resultado calculado pelo backend
    async finalizarProva(idProva) {

        return await fetchComAuth(
            `${PROVA_URL}/${idProva}/finalizar`,
            {
                method: 'PUT'
            }
        );
    }

};
