const BASE_URL = 'http://localhost:3000/api'

export const savesApi = {
    async carregarSaves(idUser){
        try{
            const resposta = await fetch(`${BASE_URL}/saves/${idUser}`)

            if(!resposta.ok){
                throw new Error(`Erro ao carregar os saves: ${resposta.status}`);
            }

            const json = await resposta.json();

            return json.data;        
        }
        catch(error){
            console.error('Erro na API carregarSaves: ', error);
            throw error;
        }
    },
    async criarNovoJogo(nomeSave, idUser){
        try{
            const resposta = await fetch(`${BASE_URL}/saves`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome_save: nomeSave, id_usuario: idUser})
            });

            if(!resposta.ok){
                throw new Error(`Erro ao criar jogo: ${resposta.status}`)
            }

            const json = await resposta.json();

            return json.data; 
        }
        catch(error){
            console.error('Erro na API criarNovoJogo: ', error);
            throw error;
        }
    },
    async carregarJogo(idUser, idSave){
        try{
            const resposta = await fetch(`${BASE_URL}/saves/${idUser}/${idSave}`);

            if(!resposta.ok){
                throw new Error(`Erro ao carregar jogo: ${resposta.status}`);
            }

            const json = await resposta.json();

            return json.data; 
        }
        catch(error){
            console.error(`Erro na API carregarJogo para o ID ${idSave}:`, error);
            throw error;
        }
    },
    async atualizarSave(idUser, idSave, novosDados){
        try{
            const resposta = await fetch(`${BASE_URL}/saves/${idUser}/${idSave}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novosDados)
            });

            if(!resposta.ok){
                throw new Error(`Erro ao atualizar save ${idSave}: ${resposta.status}`);
            }

            const json = await resposta.json();

            return json.data; 
        }
        catch(error){
            console.error(`Erro na API atualizarSave para o ID ${idSave}:`, error);
            throw error;
        }
    },
    async deletarSave(idUser, idSave){
        try{
            const resposta = await fetch(`${BASE_URL}/saves/${idUser}/${idSave}`, {
                method: 'DELETE'
            });

            if(!resposta.ok){
                throw new Error(`Erro ao deletar save ${idSave}: ${resposta.status}`);
            }

            const json = await resposta.json();

            return json.data; 
        }
        catch(error){
            console.error(`Erro na API deletarSave para o ID ${idSave}:`, error);
            throw error;
        }
    }
}