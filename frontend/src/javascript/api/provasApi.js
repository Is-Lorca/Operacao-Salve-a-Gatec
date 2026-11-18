import { fetchComAuth } from "./helper/fetchComAuth.js";
import API_URL from "./api.js";

export const provasApi = {
    // Gerar ou continuar prova
    async gerarProva() {
        return await fetchComAuth(`${API_URL}/provas`, {
            method: "POST",
        });
    },
    // Buscar prova pelo save
    async buscarProva() {
        return await fetchComAuth(`${API_URL}/provas`, {
            method: "GET",
        });
    },
    // Buscar questões da prova
    async buscarQuestoes(idProva) {
        return await fetchComAuth(`${API_URL}/provas/${idProva}/questoes`, {
            method: "GET",
        });
    },
    // Responder questão
    async responderQuestao(idProva, idQuestao, resposta) {
        return await fetchComAuth(`${API_URL}/provas/${idProva}/questao/${idQuestao}`,
        {
            method: "PUT",
            body: JSON.stringify(resposta),
        });
    },
    // Finalizar prova
    async finalizarProva(idProva) {
        return await fetchComAuth(`${API_URL}/provas/${idProva}/finalizar`, {
            method: "PUT",
        });
    },
};
