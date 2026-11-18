import { fetchComAuth } from "./helper/fetchComAuth.js";

import API_URL from "./api.js";

export const inventarioApi = {
    async buscarPorJogador() {
        const json = await fetchComAuth(`${API_URL}/inventario`,);
        
        return json.data;
    },
    async buscarPorId(idInventario) {
        const json = await fetchComAuth(`${API_URL}/inventario/${idInventario}`);

        return json.data;
    },
    async adicionarItem(idItem) {
        const json = await fetchComAuth(`${API_URL}/inventario/item/${idItem}`,
            {
                method: "POST",
            });

        return json.data;
    },
    async usarItem(idItem) {
        const json = await fetchComAuth(`${API_URL}/inventario/item/${idItem}/usar`,
            {
                method: "POST",
            });

        return json.data;
    },
    async removerItem(idInventario) {
        const json = await fetchComAuth(`${API_URL}/inventario/${idInventario}`,
            {
                method: "DELETE",
            });

        return json.data;
    },
};
