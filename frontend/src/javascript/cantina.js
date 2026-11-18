
import { lojaApi } from "./api/lojaApi.js";
import { jogadorApi } from "./api/jogadoresApi.js";

const areaItens = document.getElementById("itens");
const campoMoedas = document.querySelector("#campoMoeda h2");

let idLojaAtual = null;
let saldoAtual = 0;
let itensDisponiveis = [];

function mostrarMensagem(mensagem) {
    areaItens.replaceChildren();

    const texto = document.createElement("p");
    texto.className = "mensagem-vazia";
    texto.textContent = mensagem;

    areaItens.appendChild(texto);
}

function atualizarMoedas(valor) {
    const saldo = Number(valor);

    if (!Number.isFinite(saldo) || saldo < 0) {
        throw new Error("O servidor retornou um saldo inválido.");
    }

    saldoAtual = saldo;
    campoMoedas.textContent = String(saldoAtual);
}

function extrairMensagemErro(erro) {
    const mensagem = erro?.message || "Ocorreu um erro inesperado.";
    const inicioJson = mensagem.indexOf("{");

    if (inicioJson !== -1) {
        try {
            const resposta = JSON.parse(mensagem.slice(inicioJson));
            return resposta.mensagem || mensagem;
        } catch {
            // Mantém a mensagem original.
        }
    }

    return mensagem;
}

async function carregarJogador() {
    const jogador = await jogadorApi.buscarPorSave();

    if (!jogador) {
        throw new Error("Jogador deste save não foi encontrado.");
    }

    atualizarMoedas(jogador.dinheiro);
}

async function carregarLoja() {
    const resposta = await lojaApi.buscarPorSave();
    const loja = resposta.data;

    if (!loja) {
        throw new Error("Loja não encontrada.");
    }

    idLojaAtual = loja.id_loja;

    if (!loja.aberta) {
        mostrarMensagem("A cantina está fechada no momento. Volte depois!");
        return;
    }

    await carregarItens();
}

async function carregarItens() {
    const resposta = await lojaApi.buscarItensLoja(idLojaAtual);
    const itens = resposta.data;

    if (!Array.isArray(itens)) {
        throw new Error("A lista de produtos recebida é inválida.");
    }

    itensDisponiveis = itens;
    mostrarItens();
}

function criarCard(registro) {
    const item = registro.item;

    if (!item) {
        return null;
    }

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
    imagem.alt = item.nome || "Imagem do produto";

    if (item.imagem) {
        imagem.src = item.imagem;
    } else {
        imagem.style.display = "none";
    }

    imagem.onerror = () => {
        imagem.style.display = "none";
    };

    const detalhes = document.createElement("div");
    detalhes.className = "info";

    const descricao = document.createElement("p");
    descricao.textContent = item.descricao || "Sem descrição.";

    const preco = document.createElement("span");
    preco.textContent = `${registro.preco} moedas`;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "Comprar";

    botao.addEventListener("click", () => {
        comprarItem(registro, botao);
    });

    detalhes.append(descricao, preco, botao);
    informacoes.append(imagem, detalhes);

    card.append(topo, informacoes);

    return card;
}

function mostrarItens() {
    areaItens.replaceChildren();

    if (itensDisponiveis.length === 0) {
        mostrarMensagem("Todos os produtos foram comprados!");
        return;
    }

    itensDisponiveis.forEach(registro => {
        const card = criarCard(registro);

        if (card) {
            areaItens.appendChild(card);
        }
    });
}

async function comprarItem(registro, botao) {
    const item = registro.item;
    const preco = Number(registro.preco);

    if (!item || !item.id_item) {
        alert("Não foi possível identificar este produto.");
        return;
    }

    if (!Number.isFinite(preco) || preco < 0) {
        alert("O preço deste produto é inválido.");
        return;
    }

    if (saldoAtual < preco) {
        alert("Você não possui moedas suficientes!");
        return;
    }

    botao.disabled = true;
    botao.textContent = "Comprando...";

    try {
        const resposta = await lojaApi.comprarItem(
            idLojaAtual,
            item.id_item
        );

        if (!resposta.sucesso) {
            throw new Error(
                resposta.mensagem || "Não foi possível concluir a compra."
            );
        }

        const compra = resposta.data?.compra;
        const dinheiroRestante = compra?.dinheiroRestante;

        if (dinheiroRestante !== undefined) {
            atualizarMoedas(dinheiroRestante);
        } else {
            await carregarJogador();
        }

        itensDisponiveis = itensDisponiveis.filter(
            produto =>
                Number(produto.item?.id_item) !== Number(item.id_item)
        );

        mostrarItens();

    } catch (erro) {
        console.error("Erro ao comprar produto:", erro);
        alert(extrairMensagemErro(erro));

        botao.disabled = false;
        botao.textContent = "Comprar";
    }
}

async function iniciarCantina() {
    if (!areaItens || !campoMoedas) {
        console.error("Elementos da cantina não encontrados.");
        return;
    }

    mostrarMensagem("Carregando cantina...");

    try {
        await carregarJogador();
        await carregarLoja();

    } catch (erro) {
        console.error("Erro ao iniciar a cantina:", erro);

        const mensagem = extrairMensagemErro(erro);
        const mensagemMinuscula = mensagem.toLowerCase();

        if (
            mensagemMinuscula.includes("loja não encontrada") ||
            mensagemMinuscula.includes("loja nao encontrada")
        ) {
            mostrarMensagem(
                "A cantina ainda não foi gerada para este save. " +
                "Ela poderá aparecer após a conclusão de uma fase."
            );
            return;
        }

        mostrarMensagem(mensagem);
    }
}

iniciarCantina();
