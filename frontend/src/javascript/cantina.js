
const API_TESTE = "http://localhost:3000/api/cantina-teste/itens";

// Novas chaves para começar a apresentação com saldo de 100.
const CHAVE_MOEDAS = "cantinaTesteMoedas_apresentacao_v1";
const CHAVE_ITENS = "cantinaTesteItens_apresentacao_v1";

const MOEDAS_INICIAIS = 100;
const QUANTIDADE_ITENS = 4;

const areaItens = document.getElementById("itens");
const campoMoedas = document.querySelector("#campoMoeda h2");

let saldoSalvo = localStorage.getItem(CHAVE_MOEDAS);

let moedas = saldoSalvo === null
    ? MOEDAS_INICIAIS
    : Number(saldoSalvo);

let itensDisponiveis = [];

if (!Number.isFinite(moedas) || moedas < 0) {
    moedas = MOEDAS_INICIAIS;
}

function atualizarMoedas() {
    // Mostra somente o número.
    campoMoedas.textContent = String(moedas);

    localStorage.setItem(CHAVE_MOEDAS, String(moedas));
}

// Sorteio dos produtos usando o peso cadastrado no banco.
function sortearItens(lista, quantidade) {
    const restantes = [...lista];
    const sorteados = [];

    while (sorteados.length < quantidade && restantes.length > 0) {
        const pesoTotal = restantes.reduce(
            (total, item) =>
                total + Math.max(0, Number(item.peso) || 0),
            0
        );

        let escolhido = 0;

        if (pesoTotal > 0) {
            let sorteio = Math.random() * pesoTotal;

            for (let i = 0; i < restantes.length; i++) {
                sorteio -= Math.max(
                    0,
                    Number(restantes[i].peso) || 0
                );

                if (sorteio < 0) {
                    escolhido = i;
                    break;
                }
            }
        } else {
            escolhido = Math.floor(
                Math.random() * restantes.length
            );
        }

        sorteados.push(restantes.splice(escolhido, 1)[0]);
    }

    return sorteados;
}

// Busca os produtos reais no banco.

async function buscarProdutos() {
    const resposta = await fetch(API_TESTE);
    const json = await resposta.json();

    if (!resposta.ok || !json.sucesso) {
        throw new Error(
            json.mensagem || `Erro HTTP ${resposta.status}`
        );
    }

    if (!Array.isArray(json.data) || json.data.length === 0) {
        throw new Error("Nenhum produto encontrado no banco.");
    }

    // Remove produtos duplicados.
    const todosProdutos = json.data.filter(
        (item, index, lista) =>
            lista.findIndex(
                outro => Number(outro.id_item) === Number(item.id_item)
            ) === index
    );

    // Sorteia novamente os produtos.
    itensDisponiveis = sortearItens(
        todosProdutos,
        QUANTIDADE_ITENS
    );

    salvarItens();
    atualizarMoedas();
    mostrarItens();
}


function salvarItens() {
    localStorage.setItem(
        CHAVE_ITENS,
        JSON.stringify(
            itensDisponiveis.map(item => item.id_item)
        )
    );
}

// Criação dos cards.
function criarCard(item) {
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
    preco.textContent = `${item.preco} moedas`;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "Comprar";

    botao.addEventListener("click", () => {
        comprar(item);
    });

    detalhes.append(descricao, preco, botao);
    informacoes.append(imagem, detalhes);

    card.append(topo, informacoes);

    return card;
}

// Exibição dos produtos.
function mostrarItens() {
    areaItens.replaceChildren();

    if (itensDisponiveis.length === 0) {
        const vazio = document.createElement("p");
        vazio.className = "mensagem-vazia";
        vazio.textContent = "Todos os produtos foram comprados!";

        areaItens.appendChild(vazio);
        return;
    }

    itensDisponiveis.forEach(item => {
        areaItens.appendChild(criarCard(item));
    });
}

// Compra com moedas fictícias.
function comprar(item) {
    const preco = Number(item.preco);

    if (!Number.isFinite(preco) || preco < 0) {
        alert("Preço inválido para este produto.");
        return;
    }

    if (moedas < preco) {
        alert("Você não possui moedas suficientes!");
        return;
    }

    moedas -= preco;

    itensDisponiveis = itensDisponiveis.filter(
        produto =>
            Number(produto.id_item) !== Number(item.id_item)
    );

    atualizarMoedas();
    salvarItens();
    mostrarItens();
}

// Inicialização.
async function iniciarCantina() {
    if (!areaItens || !campoMoedas) {
        console.error("Elementos da cantina não encontrados.");
        return;
    }

    atualizarMoedas();

    try {
        await buscarProdutos();
    } catch (erro) {
        console.error("Erro na cantina:", erro);

        areaItens.replaceChildren();

        const mensagemErro = document.createElement("p");
        mensagemErro.className = "mensagem-vazia";
        mensagemErro.textContent = erro.message;

        areaItens.appendChild(mensagemErro);
    }
}

function resetarCantina() {
    moedas = 100;

    localStorage.removeItem(CHAVE_ITENS);
    localStorage.setItem(CHAVE_MOEDAS, "100");

    itensDisponiveis = [];

    atualizarMoedas();
    buscarProdutos();
}

iniciarCantina();
