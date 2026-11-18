import { fetchComAuth } from "./helper/fetchComAuth.js";

import API_URL from "./api.js";

export const lojaApi = {
    async criar(){
        return await fetchComAuth(`${API_URL}/loja`,
            {
                method:"POST"
            }
        );
    },
    async buscarPorSave(){
        return await fetchComAuth(`${API_URL}/loja`,
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

        return await fetchComAuth(`${API_URL}/loja/${idLoja}/verificar`,
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
    async comprarItem(idLoja, idItem) {
        return await fetchComAuth(
            `${API_URL}/loja/${idLoja}/comprar/${idItem}`,
            {
                method: "POST"
            }
        );
    }
}