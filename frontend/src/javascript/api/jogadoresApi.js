import { fetchComAuth } from "./helper/fetchComAuth";

import API_URL from "../config/api.js";

export const jogadorApi = {
    async criarJogador(idSave, dados) {
        const resposta = await fetchComAuth(`${API_URL}/jogadores/save/${idSave}`,
            {
                method: "POST",
                body: JSON.stringify(dados),
            });

        const json = await resposta.json();

        if (!resposta.ok) {
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async buscarPorSave(idSave) {
        const resposta = await fetchComAuth(`${API_URL}/jogadores/save/${idSave}`);

        const json = await resposta.json();

        if (!resposta.ok) {
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async buscarPorId(idJogador) {
        const resposta = await fetchComAuth(`${API_URL}/jogadores/${idJogador}`);

        const json = await resposta.json();

        if (!resposta.ok) {
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async atualizarJogador(idJogador, dados) {
        const resposta = await fetchComAuth(`${API_URL}/jogadores/${idJogador}`, 
            {
                method: "PATCH",
                body: JSON.stringify(dados),
            });

        const json = await resposta.json();

        if (!resposta.ok) {
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async deletarJogador(idJogador) {
        const resposta = await fetchComAuth(`${API_URL}/jogadores/${idJogador}`, 
            {
                method: "DELETE",
            });

        const json = await resposta.json();

        if (!resposta.ok) {
            throw new Error(json.mensagem);
        }

        return json.data;
    },
};
