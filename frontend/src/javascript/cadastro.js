import { authApi } from './api/authApi.js';

const formCadastro = document.getElementById("formCadastro");

const resultado = document.getElementById("resultado");

formCadastro.addEventListener("submit", async(event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    resultado.innerText = "Cadastrando...";

    try {
        if(senha !== confirmarSenha){
            throw new Error("As senhas não coincidem.");
        }

        const resposta = await authApi.cadastro(nome, email, senha);

        resultado.innerText = `Cadastro realizado com sucesso!\nSeja bem-vindo(a) ${resposta.nome}`;

        setTimeout(()=>{window.location.href = "./inicio.html";}, 2000);

    } 
    catch(error){
        resultado.innerText = "Erro: " + error.message;

        console.error(error);
    }
});