import { fetchComAuth } from "./helper/fetchComAuth";

import API_URL from "./api.js";

export const inventarioApi = {
    async buscarPorJogador() {
        const resposta = await fetchComAuth(`${API_URL}/inventario`,);

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
    async adicionarItem(idItem) {
        const resposta = await fetchComAuth(`${API_URL}/inventario/item/${idItem}`,
            {
                method: "POST",
            });

        const json = await resposta.json();

        if (!resposta.ok) {
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async usarItem(idItem) {
        const resposta = await fetchComAuth(`${API_URL}/inventario/item/${idItem}/usar`,
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
