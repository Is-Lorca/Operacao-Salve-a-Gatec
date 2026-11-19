
export async function fetchComAuth(url, options = {}) {

    const token = localStorage.getItem('token');
    const idSave = localStorage.getItem('idSave');

    const headers = {
        ...options.headers
    };


    // Envia o token de autenticação
    if (token && token !== 'undefined') {
        headers.Authorization = `Bearer ${token}`;
    }


    // Envia o save selecionado
    if (idSave) {
        headers['x-save-id'] = idSave;
    }


    // Define o tipo do conteúdo quando existe um corpo JSON
    if (
        options.body &&
        !headers['Content-Type'] &&
        !headers['content-type']
    ) {
        headers['Content-Type'] = 'application/json';
    }


    // Faz a requisição
    const resposta = await fetch(url, {
        ...options,
        headers
    });


    // Lê a resposta
    const texto = await resposta.text();

    let dados;

    try {
        dados = texto ? JSON.parse(texto) : {};
    } catch {
        dados = {
            mensagem: texto
        };
    }


    // Trata erros do servidor
    if (!resposta.ok) {

        throw new Error(
            dados.mensagem ||
            dados.error ||
            `Erro ${resposta.status}`
        );
    }


    return dados;
}
