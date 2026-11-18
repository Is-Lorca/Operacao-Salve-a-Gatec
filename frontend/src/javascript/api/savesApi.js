import { fetchComAuth } from "./helper/fetchComAuth.js";
import API_URL from "./api.js";

export const savesApi = {
    async carregarSaves(){
        const json = await fetchComAuth(`${API_URL}/saves`);
        return json.data;
    },
    async criarNovoJogo(nomeSave, nomeJogador){
        const json = await fetchComAuth(`${API_URL}/saves`,{
            method:"POST",
            
            body:JSON.stringify({
                nome_save: nomeSave,
                nome_jogador: nomeJogador
            })
        });
        
        return json.data;
    },
    async carregarJogo(idSave){
        const json = await fetchComAuth(`${API_URL}/saves/${idSave}`);
        return json.data;
    },
    async atualizarSave(idSave, novosDados){
        const json = await fetchComAuth(`${API_URL}/saves/${idSave}`,{
            method:"PUT",
            body:JSON.stringify(novosDados)
        });
        
        return json.data;
    },
    async deletarSave(idSave){
        const json = await fetchComAuth(`${API_URL}/saves/${idSave}`,{
            method:"DELETE"
        });
        
        return json.data;
    }
};