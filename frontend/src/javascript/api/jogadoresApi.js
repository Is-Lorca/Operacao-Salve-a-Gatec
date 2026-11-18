import { fetchComAuth } from "./helper/fetchComAuth";

import API_URL from "./api.js";

export const jogadorApi = {
    // chame criarNovoJogo do save, ele faz o jogador tambem!
    async criarJogador(dados) {
        const resposta = await fetchComAuth(`${API_URL}/jogadores`,
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
    async buscarPorSave() {
        const resposta = await fetchComAuth(`${API_URL}/jogadores`);

        const json = await resposta.json();

        if (!resposta.ok) {
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async buscarPorId() {
        const resposta = await fetchComAuth(`${API_URL}/jogadores/me`);

        const json = await resposta.json();

        if (!resposta.ok) {
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async atualizarJogador(dados) {
        const resposta = await fetchComAuth(`${API_URL}/jogadores`, 
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
    async deletarJogador() {
        const resposta = await fetchComAuth(`${API_URL}/jogadores`, 
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
