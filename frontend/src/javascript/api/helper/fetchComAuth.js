export async function fetchComAuth(url, options = {}) {
    const token = localStorage.getItem("token");
    const idSave = localStorage.getItem("idSave");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if(token && token !== "undefined"){
        headers.Authorization = `Bearer ${token}`;
    }

    if(idSave){
        headers["x-save-id"] = idSave;
    }
     
    const resposta = await fetch(url, {
        ...options,
        headers
    });

    if (!resposta.ok) {
        const textoErro = await resposta.text();
        throw new Error(`Erro ${resposta.status}: ${textoErro}`);
    }

    return await resposta.json();
}