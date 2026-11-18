import { savesApi } from "./api/savesApi.js";
import { jogadorApi } from "./api/jogadoresApi.js";

// pega usuario no storage
const usuario = JSON.parse(localStorage.getItem("usuario"));
const idUsuario = usuario.id_usuario;

// inicia a variavel saves globalmente
let saves = [];

// busca campos presentes no inicio
const botaoNovoJogo = document.getElementById("botaoInicio");
const botaoContinuar = document.getElementById("botaoContinuar");
const lista = document.getElementById("listaSaves");

// para aparecer e tirar os modais
const overlay = document.getElementById("overlay");
const modalNovo = document.getElementById("modalNovo");
const modalContinuar = document.getElementById("modalContinuar");

// Função para deixar a data amigável (Ex: 18/11/2026 às 16:06)
function formatarData(dataString) {
    if (!dataString) return "Data desconhecida";
    
    const data = new Date(dataString);
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(data).replace(",", " às");
}

// carregamos os saves com o jogador junto
async function carregarSaves() {
    try {
        const resposta = await savesApi.carregarSaves(idUsuario);
        
        if (!resposta) {
            saves = [];
        } else {
            saves = Array.isArray(resposta) ? resposta : [resposta];
        }

        // pega o nome do jogador que veio junto
        saves.forEach((save) => {
            // agora usamos jogador:id_jogador, o Supabase retorna um objeto
            const dadosJogador = Array.isArray(save.jogador) ? save.jogador[0] : save.jogador;
            save.nome_jogador = dadosJogador?.nome || "Sem personagem";
        });


        console.log("Saves carregados:", saves)

        if (saves.length === 0) {
            botaoContinuar.disabled = true;
            botaoContinuar.style.opacity = "0.5";
        } else {
            botaoContinuar.disabled = false;
            botaoContinuar.style.opacity = "1";
        }
    } catch (erro) {
        console.error("Erro ao carregar saves:", erro);
    }
}

function renderizarLista() {
    lista.innerHTML = "";

    saves.forEach((save) => {
        const card = document.createElement("div");
        card.className = "cardSave";

        card.innerHTML = `
            <h3>${save.nome_save}</h3>
            <p>Jogador: ${save.nome_jogador}</p>
            <small>Último save: ${formatarData(save.ultimo_save)}</small>
        `;

        card.onclick = () => {
            // Salva no localStorage para o fetchComAuth funcionar nas próximas telas
            localStorage.setItem("idSave", save.id_save);
            sessionStorage.setItem("saveAtual", save.id_save);
            window.location.href = "selecaoMateria.html";
        };

        lista.appendChild(card);
    });

    // se houver menos de 3 saves ativos, aparece botao para criar novo jogo
    if (saves.length < 3) {
        const novo = document.createElement("div");
        novo.className = "cardNovo";
        novo.textContent = "+ Novo Jogo";
        novo.onclick = () => {
            fecharModalContinuar();
            abrirModalNovo();
        };

        lista.appendChild(novo);
    }
}

function abrirModalNovo() {
    document.getElementById("nomeSave").value = "";
    document.getElementById("nomeJogador").value = "";
    overlay.classList.remove("hidden");
    modalNovo.classList.remove("hidden");
}

function fecharModalNovo() {
    overlay.classList.add("hidden");
    modalNovo.classList.add("hidden");
}

function abrirModalContinuar() {
    overlay.classList.remove("hidden");
    modalContinuar.classList.remove("hidden");
}

function fecharModalContinuar() {
    overlay.classList.add("hidden");
    modalContinuar.classList.add("hidden");
}

// FUNÇÕES DO BOTAO NOVO JOGO
botaoNovoJogo.addEventListener("click", () => {
    if (saves.length >= 3) {
        alert("Você já possui 3 saves ativos.");
        return;
    }
    abrirModalNovo();
});

// evento do botão "criarNovo":
document.getElementById("criarNovo").addEventListener("click", async () => {
    const nomeSave = document.getElementById("nomeSave").value.trim();
    const nomeJogador = document.getElementById("nomeJogador").value.trim();

    if (!nomeSave || !nomeJogador) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        // O SaveService retorna { save, jogador }
        const resposta = await savesApi.criarNovoJogo(nomeSave, nomeJogador, idUsuario);
        console.log("RESPOSTA DO BACK-END:", resposta);

        // Pegamos o id_save de dentro de resposta.save (com fallback caso mude)
        const idSaveCriado = resposta.save?.id_save || resposta.id_save;

        localStorage.setItem("idSave", idSaveCriado);
        sessionStorage.setItem("saveAtual", idSaveCriado);
        window.location.href = "selecaoMateria.html";
    } catch (erro) {
        alert(erro.message);
    }
});

document.getElementById("cancelarNovo").addEventListener("click", () => {
    fecharModalNovo();
});

// FUNÇÕES DO BOTAO CONTINUAR
botaoContinuar.addEventListener("click", async () => {
    await carregarSaves();
    renderizarLista();
    abrirModalContinuar();
});

document.getElementById("fecharContinuar").addEventListener("click", () => {
    fecharModalContinuar();
});

// se clicar fora, na area escura
overlay.addEventListener("click", () => {
    fecharModalNovo();
    fecharModalContinuar();
});

// Carrega os saves assim que a página abre
carregarSaves();
