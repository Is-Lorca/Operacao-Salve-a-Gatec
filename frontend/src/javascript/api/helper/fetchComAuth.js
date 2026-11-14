export async function fetchComAuth(url, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if(token){
        headers.Authorization = `Bearer ${token}`;
    }
     
    const resposta = await fetch(url, {
        ...options,
        headers
    });

    return await resposta.json();
}