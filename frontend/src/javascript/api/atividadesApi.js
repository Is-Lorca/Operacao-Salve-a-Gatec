import { fetchComAuth } from "./fetchAuth.js";
import API_URL from "./api.js";

export const atividadesApi = {
    // Gerar uma nova atividade
    async gerar(idSave, idMateria) {
        return await fetchComAuth(`${API_URL}/atividades/${idSave}/${idMateria}`, {
            method: "POST",
        });
    },
    // Buscar atividade completa
    async buscarCompleta(idAtividade) {
        return await fetchComAuth(`${API_URL}/atividades/${idAtividade}`, {
            method: "GET",
        });
    },
    // Buscar apenas questões da atividade
    async buscarQuestoes(idAtividade) {
        return await fetchComAuth(`${API_URL}/atividades/${idAtividade}/questoes`, {
            method: "GET",
        });
    },
    // Registrar resposta de uma questão
    async registrarResposta(idAtividade, resposta) {
        return await fetchComAuth(`${API_URL}/atividades/${idAtividade}/resposta`, {
            method: "POST",
            body: JSON.stringify(resposta),
        });
    },
    // Corrigir atividade
    async corrigir(idAtividade) {
        return await fetchComAuth(`${API_URL}/atividades/${idAtividade}/corrigir`, {
            method: "POST",
        });
    },
    // Refazer atividade
    async refazer(idSave, idMateria) {
        return await fetchComAuth(`${API_URL}/atividades/${idSave}/${idMateria}/refazer`,
        {
            method: "POST",
        });
    },
    // Buscar média das atividades
    async calcularMedia(idSave) {
        return await fetchComAuth(`${API_URL}/atividades/${idSave}/media`, {
            method: "GET",
        });
    },
    // Verificar se matéria foi concluída
    async verificarMateria(idSave, idMateria) {
        return await fetchComAuth(`${API_URL}/atividades/${idSave}/${idMateria}/concluida`,
        {
            method: "GET",
        });
    },
    // Buscar progresso das matérias
    async buscarProgresso(idSave) {
        return await fetchComAuth(`${API_URL}/atividades/${idSave}/progresso`, {
            method: "POST",
        });
    },
    // Verificar liberação da prova final
    async verificarLiberacaoProva(idSave) {
        return await fetchComAuth(`${API_URL}/atividades/${idSave}/liberacao-prova`,
        {
            method: "POST",
        });
    },
};
