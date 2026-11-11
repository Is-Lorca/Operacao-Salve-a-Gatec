import { authApi } from './api/authApi.js';

const btnCadastrar = document.getElementById("btnCadastrar");

const resultado = document.getElementById("resultado");

btnCadastrar.addEventListener("click", async () => {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    resultado.innerText = "Cadastrando...";

    try {
        if(senha !== confirmarSenha){
            throw new Error("As senhas não coincidem.");
        }

        const usuario = await authApi.cadastro(
            nome,
            email,
            senha
        );

        resultado.innerText = "Cadastro realizado com sucesso!";

    } 
    catch(error){
        resultado.innerText = "Erro: " + error.message;

        console.error(error);
    }
});