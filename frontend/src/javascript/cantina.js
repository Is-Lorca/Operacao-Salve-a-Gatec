
import API_URL from "./api/api.js";

// Elementos da página
const areaItens = document.getElementById("itens");
const campoMoedas = document.querySelector("#campoMoeda h2");

// Mensagem de carregamento e erros
let mensagem = document.getElementById("mensagemCantina");

if (!mensagem && areaItens) {
    mensagem = document.createElement("p");
    mensagem.id = "mensagemCantina";
    mensagem.setAttribute("role", "status");
    areaItens.parentElement.insertBefore(mensagem, areaItens);
}

let lojaAtual = null;

// Recupera o token salvo pelo login
function obterToken() {
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
            console.error("Erro ao recuperar o token:", erro);
        }
    }

    if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
    }

    return token;
}

// Função responsável pela comunicação com o backend
async function chamarApi(caminho, opcoes = {}) {
    const token = obterToken();
    const idSave = localStorage.getItem("idSave");

    if (!idSave) {
        throw new Error("Nenhum save selecionado.");
    }

    const resposta = await fetch(`${API_URL}${caminho}`, {
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-save-id": idSave,
            ...opcoes.headers
        }
    });

    // Evita tentar interpretar uma página HTML como JSON
    const texto = await resposta.text();

    let json;

    try {
        json = JSON.parse(texto);
    } catch {
        throw new Error(
            `O servidor retornou uma resposta inválida (HTTP ${resposta.status}).`
        );
    }

    if (!resposta.ok || json.sucesso === false) {
        throw new Error(
            json.mensagem ||
            json.error ||
            "Não foi possível realizar a operação."
        );
    }

    return json.data;
}

// Busca as moedas do jogador
async function carregarMoedas() {
    const jogador = await chamarApi("/jogador");

    if (!jogador) {
        throw new Error("Jogador não encontrado.");
    }

    campoMoedas.textContent =
        `${Number(jogador.dinheiro ?? 0)} moedas`;
}

// Busca a loja do save
async function carregarLoja() {
    lojaAtual = await chamarApi("/loja");

    if (!lojaAtual || !lojaAtual.id_loja) {
        throw new Error("Não foi possível encontrar a loja deste save.");
    }

    // Não abre a loja automaticamente.
    // Respeita o funcionamento definido pelo backend.
    if (!lojaAtual.aberta) {
        areaItens.replaceChildren();
        mostrarMensagem("A cantina está fechada no momento.");
        return;
    }

    await carregarItens();
}

// Busca os produtos disponíveis na loja
async function carregarItens() {
    try {
        const itens = await chamarApi(
            `/loja/itens/${lojaAtual.id_loja}`
        );

        mostrarItens(itens);

    } catch (erro) {
        areaItens.replaceChildren();

        if (erro.message.toLowerCase().includes("não possui itens")) {
            mostrarMensagem("Não existem itens disponíveis na cantina.");
            return;
        }

        throw erro;
    }
}

// Cria o espaço visual de cada produto
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
    imagem.alt = item.nome
        ? `Imagem de ${item.nome}`
        : "Imagem do item";

    if (item.imagem) {
        imagem.src = item.imagem;
    }

    const detalhes = document.createElement("div");
    detalhes.className = "info";

    const descricao = document.createElement("p");
    descricao.textContent =
        item.descricao || "Descrição indisponível.";

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

// Preenche a área de produtos com os dados do banco
function mostrarItens(itens) {
    areaItens.replaceChildren();

    if (!Array.isArray(itens) || itens.length === 0) {
        mostrarMensagem("Não existem produtos disponíveis.");
        return;
    }

    itens.forEach(registro => {
        areaItens.appendChild(criarCard(registro));
    });

    mostrarMensagem("Bem-vindo(a) à cantina!");
}

// Realiza a compra do produto
async function comprarItem(idItem, botao) {
    botao.disabled = true;
    botao.textContent = "Comprando...";

    try {
        await chamarApi(
            `/loja/${lojaAtual.id_loja}/comprar/${idItem}`,
            {
                method: "POST"
            }
        );

        mostrarMensagem("Compra realizada com sucesso!");

        // Consulta novamente os dados atualizados no banco
        await carregarMoedas();
        await carregarItens();

    } catch (erro) {
        console.error("Erro ao comprar:", erro);

        mostrarMensagem(erro.message);

        botao.disabled = false;
        botao.textContent = "Comprar";
    }
}

// Inicializa a cantina
async function iniciarCantina() {
    try {
        if (!areaItens || !campoMoedas) {
            throw new Error(
                "Não foi possível localizar a área dos itens ou das moedas no HTML."
            );
        }

        mostrarMensagem("Carregando cantina...");

        await carregarMoedas();
        await carregarLoja();

    } catch (erro) {
        console.error("Erro ao iniciar a cantina:", erro);
        mostrarMensagem(erro.message);
    }
}

iniciarCantina();
