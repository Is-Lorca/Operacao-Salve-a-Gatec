import { lojaApi } from "./api/lojaApi.js";
import { fetchComAuth } from "./api/helper/fetchComAuth.js";

import API_URL from "./api/api.js";

// Elementos do HTML
const areaItens = document.getElementById("itens");
const campoMoedas = document.querySelector("#campoMoeda h2");

let mensagem = document.getElementById("mensagemCantina");
let lojaAtual = null;

// Cria uma área para mensagens sem modificar o HTML
if (!mensagem && areaItens) {
    mensagem = document.createElement("p");
    mensagem.id = "mensagemCantina";
    mensagem.setAttribute("role", "status");
    areaItens.parentElement.insertBefore(mensagem, areaItens);
}

function mostrarMensagem(texto) {
    if (mensagem) {
        mensagem.textContent = texto;
    }
}

// Recupera o token que o login já salvou
function prepararToken() {
    let token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
        try {
            const usuario = JSON.parse(
                localStorage.getItem("usuario")
            );

            token = usuario?.tokenAcesso;

            if (token) {
                localStorage.setItem("token", token);
            }
        } catch (erro) {
            console.error("Erro ao recuperar token:", erro);
        }
    }

    if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
    }
}

// Trata o formato de resposta utilizado pelo backend
function obterDados(resposta) {
    if (!resposta || resposta.sucesso === false) {
        throw new Error(
            resposta?.mensagem ||
            resposta?.error ||
            "Não foi possível consultar o servidor."
        );
    }

    return resposta.data ?? resposta;
}

// Busca o saldo do jogador
async function carregarMoedas() {
    const resposta = await fetchComAuth(
        `${API_URL}/jogador`
    );

    const jogador = obterDados(resposta);

    if (!jogador) {
        throw new Error("Jogador não encontrado.");
    }

    campoMoedas.textContent =
        `${Number(jogador.dinheiro ?? 0)} moedas`;
}

// Busca a loja do save
async function carregarLoja() {
    const resposta = await lojaApi.buscarPorSave();

    lojaAtual = obterDados(resposta);

    if (!lojaAtual || !lojaAtual.id_loja) {
        throw new Error("Não foi possível encontrar a loja.");
    }

    // Respeita a abertura controlada pelo backend
    if (!lojaAtual.aberta) {
        areaItens.replaceChildren();
        mostrarMensagem("A cantina está fechada no momento.");
        return;
    }

    await carregarItens();
}

// Busca os produtos da loja
async function carregarItens() {
    const resposta = await lojaApi.buscarItensLoja(
        lojaAtual.id_loja
    );

    const itens = obterDados(resposta);

    mostrarItens(itens);
}

// Cria os cards com os dados recebidos do banco
function criarCard(registro) {
    const item = registro.item || registro;

    const card = document.createElement("div");
    card.className = "item";

    const topo = document.createElement("div");
    topo.className = "nomeItem";

    const nome = document.createElement("h2");
    nome.textContent = item.nome || "Item";

    topo.appendChild(nome);

    const informacoes = document.createElement("div");
    informacoes.className = "infoItem";

    const imagem = document.createElement("img");
    imagem.alt = `Imagem de ${item.nome || "item"}`;

    if (item.imagem) {
        imagem.src = item.imagem;
    }

    const detalhes = document.createElement("div");
    detalhes.className = "info";

    const descricao = document.createElement("p");
    descricao.textContent =
        item.descricao || "Sem descrição.";

    const preco = document.createElement("span");
    preco.textContent = `${registro.preco} moedas`;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "Comprar";

    botao.addEventListener("click", () => {
        comprarItem(item.id_item, botao);
    });

    detalhes.append(descricao, preco, botao);
    informacoes.append(imagem, detalhes);
    card.append(topo, informacoes);

    return card;
}

// Coloca os produtos na tela
function mostrarItens(itens) {
    areaItens.replaceChildren();

    if (!Array.isArray(itens) || itens.length === 0) {
        mostrarMensagem("Não existem itens disponíveis.");
        return;
    }

    itens.forEach(registro => {
        areaItens.appendChild(criarCard(registro));
    });

    mostrarMensagem("Bem-vindo(a) à cantina!");
}

// Compra utilizando a lojaApi
async function comprarItem(idItem, botao) {
    botao.disabled = true;
    botao.textContent = "Comprando...";

    try {
        const resposta = await lojaApi.comprarItem(
            lojaAtual.id_loja,
            idItem
        );

        obterDados(resposta);

        mostrarMensagem("Compra realizada com sucesso!");

        // Atualiza o saldo e os produtos consultando o backend
        await carregarMoedas();
        await carregarItens();

    } catch (erro) {
        console.error("Erro na compra:", erro);

        mostrarMensagem(erro.message);

        botao.disabled = false;
        botao.textContent = "Comprar";
    }
}

// Inicialização
async function iniciarCantina() {
    try {
        if (!areaItens || !campoMoedas) {
            throw new Error("Não foi possível localizar os elementos do HTML.");
        }

        prepararToken();

        mostrarMensagem("Carregando cantina...");

        await carregarMoedas();
        await carregarLoja();

    } catch (erro) {
        console.error("Erro ao iniciar cantina:", erro);
        mostrarMensagem(erro.message);
    }
}

iniciarCantina();
