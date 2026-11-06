// Criando APIs é a melhor forma de chamar o backend, assim concentrando a comunicação nele e depois
// passando para o html que ele será realmente utilizado

// Para que funcione corretamente o Fetch e não dê problemas como o CORS -> Cross-Origin Resource Sharing,
// que nada mais é que um esta localizado em uma porta e o outro esta em outra, precisamos instalar
// o cors na parte do Node.js, depois, no server.js, importar e ativar o cors antes de todas as rotas

// salvamos em uma variável a base do nosso url a ser consumido pelo Fetch()
const BASE_URL = 'http://localhost:3000/api';

export const materiasApi = {
    // busca as materias da rota /api/materias
    // da retorno da lista de materias, vindas do BD
    async listarMaterias(){
        try{
            const resposta = await fetch(`${BASE_URL}/materias`);

            // O fetch() não considera erro HTTP como erro de Promise -> resultado de operação assíncrona
            // ele está basicamente dizendo: 
            // se o código de status HTTP da resposta estiver entre 200 e 299 (como o famoso 200 OK) 
            // = entao tudo certo
            // do contrário, se o status for 404 Not Found, ou 500 Internal Server Error, ele deu erro
            if (!resposta.ok) {
                throw new Error(`Erro na requisição: ${resposta.status} - ${resposta.statusText}`);
            }

            return await resposta.json();

        }
        catch(error){
            console.error('Erro ao buscar matérias na API: ', error);
            throw error;
        }
    }
}