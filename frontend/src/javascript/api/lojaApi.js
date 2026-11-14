import { fetchComAuth } from "./fetchAuth.js";

import API_URL from "./api.js";

export const lojaApi = {
    async criar(idSave){
        return await fetchComAuth(`${API_URL}/loja/save/${idSave}`,
            {
                method:"POST"
            }
        );
    },
    async buscarPorSave(idSave){
        return await fetchComAuth(`${API_URL}/loja/save/${idSave}`,
            {
                method:"GET"
            }
        );
    },
    async abrirLoja(idLoja){
        return await fetchComAuth(`${API_URL}/loja/${idLoja}/abrir`,
            {
                method:"PATCH"
            }
        );
    },
    async fecharLoja(idLoja){
        return await fetchComAuth(`${API_URL}/loja/${idLoja}/fechar`,
            {
                method:"PATCH"
            }
        );
    },
    async verificarGeracao(idLoja){

        return await fetchComAuth(`${API_URL}/loja/verificar/${idLoja}`,
            {
                method:"GET"
            }
        );
    },
    async buscarItensLoja(idLoja){
        return await fetchComAuth(`${API_URL}/loja/itens/${idLoja}`,
            {
                method:"GET"
            }
        );
    },
}