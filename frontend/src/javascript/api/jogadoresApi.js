import { fetchComAuth } from "./helper/fetchComAuth.js";

import API_URL from "./api.js";

export const jogadorApi = {
    // chame criarNovoJogo do save, ele faz o jogador tambem!
    async criarJogador(dados) {
        const json = await fetchComAuth(`${API_URL}/jogador`,
            {
                method: "POST",
                body: JSON.stringify(dados),
            });

        return json.data;
    },
    async buscarPorSave() {
        const json = await fetchComAuth(`${API_URL}/jogador`);

        return json.data;
    },
    async buscarPorId() {
        const json = await fetchComAuth(`${API_URL}/jogador/me`);
        
        return json.data;
    },
    async atualizarJogador(dados) {
        const json = await fetchComAuth(`${API_URL}/jogador`, 
            {
                method: "PATCH",
                body: JSON.stringify(dados),
            });

        return json.data;
    },
    async deletarJogador() {
        const json = await fetchComAuth(`${API_URL}/jogador`, 
            {
                method: "DELETE",
            });

        return json.data;
    },
};