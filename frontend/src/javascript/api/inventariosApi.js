import { fetchComAuth } from "./helper/fetchComAuth";

import API_URL from "../config/api.js";

export const inventarioApi = {
    async buscarPorJogador(idJogador) {
        const resposta = await fetchComAuth(`${API_URL}/inventario/jogador/${idJogador}`,);

        const json = await resposta.json();

        if (!resposta.ok) {
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async buscarPorId(idInventario) {
        const resposta = await fetchComAuth(`${API_URL}/inventario/${idInventario}`);

        const json = await resposta.json();

        if (!resposta.ok) {
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async adicionarItem(idJogador, idItem) {
        const resposta = await fetchComAuth(`${API_URL}/inventario/jogador/${idJogador}/item/${idItem}`,
            {
                method: "POST",
            });

        const json = await resposta.json();

        if (!resposta.ok) {
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async usarItem(idJogador, idItem) {
        const resposta = await fetchComAuth(`${API_URL}/inventario/jogador/${idJogador}/item/${idItem}/usar`,
            {
                method: "POST",
            });

        const json = await resposta.json();

        if (!resposta.ok) {
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async removerItem(idInventario) {
        const resposta = await fetchComAuth(`${API_URL}/inventario/${idInventario}`,
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
