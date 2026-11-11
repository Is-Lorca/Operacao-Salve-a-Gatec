import { authApi } from './api/authApi.js';

const formLogin = document.getElementById("formLogin");

const resultado = document.getElementById("resultado");

formLogin.addEventListener("submit", async(event) =>{
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    resultado.innerText = "Entrando...";

    try{
        const resposta = await authApi.login(email, senha);

        resultado.innerText = `Bem-vindo(a) ${resposta.data.usuario.nome}`;

        setTimeout(()=>{
            window.location.href = "./index.html";
        }, 1000);
    }
    catch(error){
        resultado.innerText = "Erro: " + error.message;

        console.error(error);
    }
});