import { atividadesApi } from "./api/atividadesApi.js";

// 1. ELEMENTOS DO HTML

const rotuloFase = document.getElementById("rotulo-fase");
const textoEnunciado = document.getElementById("texto-enunciado");
const areaRespostas = document.getElementById("area-respostas");
const contadorQuestao = document.getElementById("contador-questao");

const areaDica = document.getElementById("area-dica");
const textoDica = document.getElementById("texto-dica");

const botaoResponder = document.getElementById("botao-responder");
const rotuloBotao = document.getElementById("rotulo-botao-responder");

const textoProgresso = document.getElementById("texto-progresso");
const barraProgresso = document.getElementById("barra-progresso");
const preenchimentoProgresso = document.getElementById("preenchimento-progresso");


// 2. MATÉRIAS
// O escolhaMateria.js guarda no localStorage o tema da materia (tipo "proposicao"),
// a API trabalha com o id numerico (id_materia).
// lembrar d conferir se os ids tao certo

const MATERIAS = {
    proposicao:      { id: 1, nome: "Proposição" },
    tabelaVerdade:   { id: 2, nome: "Tabela Verdade" },
    conjuntos:       { id: 3, nome: "Conjuntos" },
    planoCartesiano: { id: 4, nome: "Plano Cartesiano" },
    relacaoBinaria:  { id: 5, nome: "Relação Binária" },
    funcoes:         { id: 6, nome: "Funções" },
    equacaoReta:     { id: 7, nome: "Equação de uma Reta" }
};


// 3. VARIÁVEIS DE CONTROLE

let materiaAtual = null;
let idAtividade = null;
let questoes = [];

let questaoAtual = 0;
let respostaSelecionada = null;
let respostaVerificada = false;

// Define o que o botão principal faz depois que a atividade termina ou dá erro:
// null |  "sair"
let acaoFinal = null;

// Evita cliques duplicados enquanto espera o servidor
let ocupado = false;


// 4. FUNÇÕES AUXILIARES

// Todas as rotas respondem { sucesso, mensagem, data }.
// Erros do middleware de login vêm como { error }.
function extrairDados(resposta) {

    if (!resposta || resposta.sucesso === false || resposta.error) {
        throw new Error(
            resposta?.mensagem ||
            resposta?.error ||
            "Não foi possível falar com o servidor."
        );
    }

    return resposta.data;
}

function definirBotao(texto, desabilitado = false) {
    rotuloBotao.textContent = texto;
    botaoResponder.disabled = desabilitado;
}

// fetchComAuth lança "Erro 400: {json}". Aqui pegamos só o campo "mensagem".
function limparMensagem(mensagem) {

    const inicio = mensagem.indexOf("{");

    if (inicio === -1) {
        return mensagem;
    }

    try {
        const json = JSON.parse(mensagem.slice(inicio));
        return json.mensagem || json.error || mensagem;
    } catch {
        return mensagem;
    }
}

function mostrarErro(mensagem) {

    mensagem = limparMensagem(mensagem);

    textoEnunciado.textContent = `Ops! ${mensagem}`;
    areaRespostas.replaceChildren();
    areaDica.classList.add("oculto");

    acaoFinal = "recarregar";
    definirBotao("Tentar de novo");
}


// 5. CARREGAR ATIVIDADE (API)
// gerar() cria a atividade, ou retoma a que está EM_ANDAMENTO.
// Depois buscarQuestoes() traz enunciado + alternativas + "acertou" de cada questão.

async function carregarAtividade() {

    ocupado = true;
    acaoFinal = null;

    questoes = [];
    questaoAtual = 0;
    respostaSelecionada = null;
    respostaVerificada = false;

    textoEnunciado.textContent = "Carregando questões...";
    areaRespostas.replaceChildren();
    areaDica.classList.add("oculto");
    definirBotao("Aguarde", true);

    try {

        materiaAtual = MATERIAS[localStorage.getItem("materia")];

        if (!materiaAtual) {
            throw new Error("Nenhuma matéria selecionada. Volte e escolha uma matéria.");
        }

        rotuloFase.textContent = `Fase ${materiaAtual.id}`;

        const atividade = extrairDados(await atividadesApi.gerar(materiaAtual.id));
        idAtividade = atividade.id_atividade;

        questoes = extrairDados(await atividadesApi.buscarQuestoes(idAtividade));

        // Se o jogador saiu no meio, continua da primeira questão sem resposta
        questaoAtual = questoes.findIndex(q => q.acertou === null || q.acertou === undefined);

        if (questaoAtual === -1) {
            // Respondeu tudo, mas ainda não foi corrigida
            questaoAtual = questoes.length;
            await finalizarAtividade();
            return;
        }

        mostrarQuestao();

    } catch (erro) {

        console.error(erro);

        // Matéria já aprovada: não é um erro de verdade, só avisamos e voltamos
        if (limparMensagem(erro.message).includes("já foi concluída")) {

            textoEnunciado.textContent = "Você já concluiu esta matéria! Escolha outra para continuar.";
            areaRespostas.replaceChildren();
            areaDica.classList.add("oculto");

            acaoFinal = "sair";
            definirBotao("Voltar");

        } else {
            mostrarErro(erro.message);
        }

    } finally {

        ocupado = false;

    }
}


// 6. MOSTRAR QUESTÃO

function mostrarQuestao() {

    const questao = questoes[questaoAtual];

    textoEnunciado.textContent = questao.enunciado;

    contadorQuestao.textContent =
        `Questão ${questaoAtual + 1}/${questoes.length}`;

    // A API pode não enviar dica; nesse caso mostramos um aviso
    textoDica.textContent = questao.dica || "Esta questão não tem dica.";

    areaDica.classList.add("oculto");

    areaRespostas.replaceChildren();

    // menos de 4 alternativas (ex.: V/F): agrupa as opções no meio
    areaRespostas.classList.toggle("poucas-alternativas", questao.alternativas.length < 4);

    respostaSelecionada = null;
    respostaVerificada = false;

    definirBotao("Dica");

    questao.alternativas.forEach((alternativa, indice) => {

        const botao = document.createElement("button");

        botao.classList.add("alternativa");
        botao.type = "button";
        botao.setAttribute("role", "radio");
        botao.setAttribute("aria-checked", "false");

        const letra = document.createElement("span");
        letra.className = "letra-alternativa";
        letra.textContent = String.fromCharCode(65 + indice);

        // textContent (e não innerHTML) para o texto do banco nunca virar HTML
        const texto = document.createElement("span");
        texto.className = "texto-alternativa";
        texto.textContent = alternativa.texto;

        botao.append(letra, texto);

        botao.addEventListener("click", () => {
            selecionarAlternativa(botao, indice);
        });

        areaRespostas.appendChild(botao);

    });

    atualizarProgresso();
}


// 7. SELECIONAR ALTERNATIVA

function selecionarAlternativa(botaoClicado, indice) {

    if (respostaVerificada || ocupado) {
        return;
    }

    areaRespostas.querySelectorAll(".alternativa").forEach(botao => {

        botao.classList.remove("selecionada");
        botao.setAttribute("aria-checked", "false");

    });

    botaoClicado.classList.add("selecionada");
    botaoClicado.setAttribute("aria-checked", "true");

    respostaSelecionada = indice;

    rotuloBotao.textContent = "Responder";
}


// 8. MOSTRAR DICA

function mostrarDica() {
    areaDica.classList.remove("oculto");
}


// 9. VERIFICAR RESPOSTA
// O front vê qual alternativa tem "correta: true", pinta a tela
// e avisa o back-end se o jogador acertou ou não.

async function verificarResposta() {

    const questao = questoes[questaoAtual];
    const acertou = questao.alternativas[respostaSelecionada].correta === true;

    ocupado = true;
    definirBotao("Enviando...", true);

    try {

        extrairDados(await atividadesApi.registrarResposta(idAtividade, {
            idQuestao: questao.id_questao,
            acertou
        }));

    } catch (erro) {

        console.error(erro);

        // Mantém a questão na tela para o jogador tentar de novo
        textoDica.textContent = `Não foi possível salvar sua resposta: ${erro.message}`;
        areaDica.classList.remove("oculto");

        definirBotao("Responder");
        ocupado = false;
        return;
    }

    questao.acertou = acertou;

    areaRespostas.querySelectorAll(".alternativa").forEach((botao, indice) => {

        botao.disabled = true;

        if (questao.alternativas[indice].correta) {
            botao.classList.add("correta");
        }

        if (indice === respostaSelecionada && !acertou) {
            botao.classList.add("errada");
        }

    });

    respostaVerificada = true;

    definirBotao("Próxima");
    ocupado = false;
}


// 10. PRÓXIMA QUESTÃO

async function proximaQuestao() {

    questaoAtual++;

    if (questaoAtual < questoes.length) {
        mostrarQuestao();
    } else {
        await finalizarAtividade();
    }
}


// 11. FINALIZAR ATIVIDADE
// O back-end corrige: a questão 7 vale 4 pontos, as outras 1 ponto (nota máxima 10).
// Nota 6 ou mais = CONCLUIDA e o jogador recebe as moedas.

async function finalizarAtividade() {

    ocupado = true;

    const total = questoes.length;

    contadorQuestao.textContent = `Questão ${total}/${total}`;
    textoEnunciado.textContent = "Corrigindo atividade...";
    areaRespostas.replaceChildren();
    areaDica.classList.add("oculto");
    definirBotao("Aguarde", true);

    textoProgresso.textContent = "Progresso: 100%";
    preenchimentoProgresso.style.width = "100%";
    barraProgresso.setAttribute("aria-valuenow", 100);

    try {

        const resultado = extrairDados(await atividadesApi.corrigir(idAtividade));

        const aprovado = resultado.status === "CONCLUIDA";

        if (aprovado) {
            textoEnunciado.textContent =
                `Atividade concluída! Você acertou ${resultado.acertos} de ${resultado.totalQuestoes} ` +
                `questões. Nota: ${resultado.nota}/10. Você ganhou ${resultado.moedasGanhar} moedas!`;

            acaoFinal = "sair";
            definirBotao("Continuar");
        } else {
            textoEnunciado.textContent =
                `Você acertou ${resultado.acertos} de ${resultado.totalQuestoes} questões. ` +
                `Nota: ${resultado.nota}/10. Você precisa de 6 para passar. Tente de novo!`;

            acaoFinal = "refazer";
            definirBotao("Refazer");
        }

    } catch (erro) {

        console.error(erro);
        mostrarErro(erro.message);

    } finally {

        ocupado = false;

    }
}


// 12. REFAZER ATIVIDADE (quando reprovado)

async function refazerAtividade() {

    ocupado = true;
    acaoFinal = null;

    textoEnunciado.textContent = "Preparando nova tentativa...";
    definirBotao("Aguarde", true);

    try {

        extrairDados(await atividadesApi.refazer(materiaAtual.id));

    } catch (erro) {

        console.error(erro);
        ocupado = false;
        mostrarErro(erro.message);
        return;
    }

    // carregarAtividade() pega a nova tentativa (EM_ANDAMENTO) e mostra as questões
    await carregarAtividade();
}


// 13. ATUALIZAR PROGRESSO

function atualizarProgresso() {

    const progresso = (questaoAtual / questoes.length) * 100;

    textoProgresso.textContent = `Progresso: ${Math.round(progresso)}%`;

    preenchimentoProgresso.style.width = `${progresso}%`;

    barraProgresso.setAttribute("aria-valuenow", progresso);
}


// 14. BOTÃO PRINCIPAL

botaoResponder.addEventListener("click", async () => {

    if (ocupado) {
        return;
    }

    // Botões que aparecem no fim da atividade ou depois de um erro
    if (acaoFinal === "recarregar") {
        await carregarAtividade();
        return;
    }

    if (acaoFinal === "refazer") {
        await refazerAtividade();
        return;
    }

    if (acaoFinal === "sair") {
        window.location.href = "selecaoMateria.html";
        return;
    }

    // Se já respondeu, passa para a próxima questão
    if (respostaVerificada) {
        await proximaQuestao();
        return;
    }

    // Se não selecionou alternativa, mostra a dica
    if (respostaSelecionada === null) {
        mostrarDica();
        return;
    }

    // Se selecionou, verifica a resposta
    await verificarResposta();

});


// 15. INICIAR ATIVIDADE

carregarAtividade();

