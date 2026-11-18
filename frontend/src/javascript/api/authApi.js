import API_URL from "./api.js";

export const authApi = {
    async login(email, senha) {
        const resposta = await fetch(`${API_URL}/auth/login`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                senha
            })
        });

        const json = await resposta.json();

        if (!resposta.ok || json.sucesso === false) {
            throw new Error(json.mensagem || "Erro ao fazer login.");
        }

        // O backend envia os tokens dentro de data
        localStorage.setItem("token", json.data.tokenAcesso);

        localStorage.setItem(
            "refreshToken",
            json.data.tokenRefresh
        );

        localStorage.setItem(
            "usuario",
            JSON.stringify(json.data)
        );

        return json;
    },

    async cadastro(nome, email, senha) {
        const resposta = await fetch(`${API_URL}/auth/cadastro`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nome,
                email,
                senha
            })
        });

        const json = await resposta.json();

        if (!resposta.ok) {
            throw new Error(json.mensagem);
        }

        return json.data;
    },

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("usuario");
    }
};