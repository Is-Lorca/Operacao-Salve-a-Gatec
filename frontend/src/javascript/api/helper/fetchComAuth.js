export async function fetchComAuth(url, options = {}) {
    const token = localStorage.getItem("token");
    const idSave = localStorage.getItem("idSave");

    const headers = {
        ...options.headers
    };

    if (options.body) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (idSave) {
        headers["x-save-id"] = idSave;
    }

    const resposta = await fetch(url, {
        ...options,
        headers
    });

    const texto = await resposta.text();

    let dados;

    try {
        dados = texto ? JSON.parse(texto) : {};
    } catch {
        throw new Error(
            `O servidor retornou uma resposta inválida. HTTP ${resposta.status}. Verifique a rota e o backend.`
        );
    }

    if (!resposta.ok) {
        throw new Error(
            dados.mensagem ||
            dados.error ||
            `Erro HTTP ${resposta.status}`
        );
    }

    return dados;
}