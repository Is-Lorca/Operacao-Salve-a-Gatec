const BASE_URL = 'http://localhost:3000/api'

export const savesApi = {
    async carregarSaves(){
        try{
            const resposta = await fetch(`${BASE_URL}/saves`)

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
    async criarNovoJogo(nomeSave){
        try{
            const resposta = await fetch(`${BASE_URL}/saves/criarsave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome_save: nomeSave })
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
    async carregarJogo(id){
        try{
            const resposta = await fetch(`${BASE_URL}/saves/carregarjogo/${id}`);

            if(!resposta.ok){
                throw new Error(`Erro ao carregar jogo: ${resposta.status}`);
            }

            const json = await resposta.json();

            return json.data; 
        }
        catch(error){
            console.error(`Erro na API carregarJogo para o ID ${id}:`, error);
            throw error;
        }
    },
    async atualizarSave(id, novosDados){
        try{
            const resposta = await fetch(`${BASE_URL}/saves/updtsave/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novosDados)
            });

            if(!resposta.ok){
                throw new Error(`Erro ao atualizar save ${id}: ${resposta.status}`);
            }

            const json = await resposta.json();

            return json.data; 
        }
        catch(error){
            console.error(`Erro na API atualizarSave para o ID ${id}:`, error);
            throw error;
        }
    },
    async deletarSave(id){
        try{
            const resposta = await fetch(`${BASE_URL}/saves/delsave/${id}`, {
                method: 'DELETE'
            });

            if(!resposta.ok){
                throw new Error(`Erro ao deletar save ${id}: ${resposta.status}`);
            }

            const json = await resposta.json();

            return json.data; 
        }
        catch(error){
            console.error(`Erro na API deletarSave para o ID ${id}:`, error);
            throw error;
        }
    }
}