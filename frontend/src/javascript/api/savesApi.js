import { fetchComAuth } from "./helper/fetchComAuth";

const BASE_URL = "http://localhost:3000/api";

export const savesApi = {
    async carregarSaves(idUser){
        const resposta = await fetchComAuth(`${BASE_URL}/saves/${idUser}`);

        const json = await resposta.json();

        if(!resposta.ok){
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async criarNovoJogo(nomeSave,idUser){
        const resposta = await fetchComAuth(`${BASE_URL}/saves`,{
            method:"POST",

            body:JSON.stringify({
                nome_save:nomeSave,
                id_usuario:idUser
            })
        });

        const json = await resposta.json();

        if(!resposta.ok){
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async carregarJogo(idUser,idSave){
        const resposta = await fetchComAuth(`${BASE_URL}/saves/${idUser}/${idSave}`);

        const json = await resposta.json();

        if(!resposta.ok){
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async atualizarSave(idUser,idSave,novosDados){
        const resposta = await fetchComAuth(`${BASE_URL}/saves/${idUser}/${idSave}`,{
            method:"PUT",

            body:JSON.stringify(novosDados)
        });

        const json = await resposta.json();

        if(!resposta.ok){
            throw new Error(json.mensagem);
        }

        return json.data;
    },
    async deletarSave(idUser,idSave){
        const resposta = await fetchComAuth(`${BASE_URL}/saves/${idUser}/${idSave}`,{
            method:"DELETE"
        });

        const json = await resposta.json();

        if(!resposta.ok){
            throw new Error(json.mensagem);
        }

        return json.data;
    }
};