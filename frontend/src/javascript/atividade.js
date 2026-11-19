import { atividadesApi } from "./api/atividadesApi.js";
// >>> NOVO 1/5: importar a API da loja (cantina)
import { lojaApi } from "./api/lojaApi.js";
// <<< FIM NOVO 1/5

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

// >>> NOVO 2/5: guarda para qual página o botão "Continuar" vai levar
// (a Dra. Peixoto, ou a seleção de matérias se algo der errado)
let destinoFinal = "selecaoMateria.html";
// <<< FIM NOVO 2/5

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


// >>> NOVO 3/5: funções que sorteiam a cantina e dizem para onde ir
// Depois que o jogador passa na atividade, o back-end sorteia se a cantina abre
// (50% de chance; na 4ª vez seguida fechada ela abre obrigatoriamente).

// Busca a loja do save. Se ela ainda não existir (404), cria.
async function obterLoja() {

    try {

        return extrairDados(await lojaApi.buscarPorSave());

    } catch (erro) {

        if (!erro.message.includes("404")) {
            throw erro;
        }

        return extrairDados(await lojaApi.criar());
    }
}

// Devolve o endereço da próxima página. Nunca lança erro:
// se algo falhar, o jogador vai para a seleção de matérias e não fica preso.
async function verificarCantina() {

    try {

        const loja = await obterLoja();

        let aberta;

        if (loja.aberta) {
            // Já estava aberta de antes: não sorteia de novo
            aberta = true;
        } else {
            const resultado = extrairDados(await lojaApi.verificarGeracao(loja.id_loja));

            // Fechada: { aberta: false, mensagem }
            // Aberta:  { loja: { aberta: true }, itens }
            aberta = resultado.aberta !== false && resultado.loja?.aberta === true;
        }

        // O "?aberta=true/false" é como avisamos a Dra. Peixoto do resultado
        return `draPeixoto.html?cena=cantina&aberta=${aberta}`;

    } catch (erro) {

        console.error("Não foi possível verificar a cantina:", erro);
        return "selecaoMateria.html";
    }
}
// <<< FIM NOVO 3/5


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
    calculadoraTravada = false; 
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

            // >>> NOVO 4/5: aqui sorteamos a cantina (antes era: acaoFinal = "sair")
            definirBotao("Aguarde", true);
            destinoFinal = await verificarCantina();

            acaoFinal = "cantina";
            definirBotao("Continuar");
            // <<< FIM NOVO 4/5
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

    // >>> NOVO 5/5: ao clicar em "Continuar", vai para a Dra. Peixoto
    // (destinoFinal já foi definido pelo verificarCantina)
    if (acaoFinal === "cantina") {
        window.location.href = destinoFinal;
        return;
    }
    // <<< FIM NOVO 5/5

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

// 14.5 INTEGRAÇÃO COM A MOCHILA (INVENTÁRIO)

// Controla a trava da Calculadora (1 uso -> trava 1 questão -> destrava na próxima)
let calculadoraTravada = false;

// 1. Informa à mochila o contexto atual da tela
window.obterContextoAtual = () => {
    const questao = questoes[questaoAtual];

    // Se não estiver respondendo uma questão ativa, retorna vazio
    if (!idAtividade || !questao || respostaVerificada || acaoFinal !== null) {
        return {};
    }

    return {
        idAtividade: idAtividade,
        idQuestao: questao.id_questao
    };
};

// 2. Intercepta antes de usar para checar a trava da Calculadora (opcional)
window.podeUsarItem = (infoItem) => {
    if (infoItem.efeito === "RESOLVE_QUESTAO_FACIL" && calculadoraTravada) {
        alert("A Calculadora deu pau! Responda esta questão para ela voltar a funcionar.");
        return false;
    }
    return true;
};

// 3. Reage na tela de Atividade ao efeito retornado pelo EfeitosService
window.addEventListener("itemUsado", async (evento) => {
    // inventarioApi.usarItem retorna { mensagem, efeito: { sucesso, mensagem, ... } }
    const payload = evento.detail;
    const efeito = payload?.efeito || payload;
    const questao = questoes[questaoAtual];

    if (!efeito) return;

    // Avisa o jogador com a mensagem vinda do EfeitosService
    if (efeito.mensagem) {
        textoDica.textContent = efeito.mensagem;
        mostrarDica();
    }

    if (!questao) return;

    // MOSTRA_DICA -> mostra a dica da questão
    if (efeito.dica) {
        textoDica.textContent = efeito.dica;
        mostrarDica();
    }

    // RESOLVE_QUESTAO (IA do Plutônio), RESOLVE_QUESTAO_FACIL (Calculadora) ou REVELA_RESPOSTA
    const altCorreta = efeito.respostaCorreta || efeito.resposta;
    if (altCorreta) {
        const idxCorreta = questao.alternativas.findIndex(
            alt => alt.correta === true || alt.texto === altCorreta.texto
        );

        if (idxCorreta !== -1) {
            const botoes = areaRespostas.querySelectorAll(".alternativa");
            selecionarAlternativa(botoes[idxCorreta], idxCorreta);
        }

        // Se foi a Calculadora (RESOLVE_QUESTAO_FACIL), trava ela para a próxima questão
        if (efeito.mensagem && efeito.mensagem.includes("fácil")) {
            calculadoraTravada = true;
        }
    }

    // PULA_QUESTAO -> avança para a próxima questão
    if (efeito.questaoPulada) {
        await proximaQuestao();
    }

    // APAGA_RESPOSTA_SEM_PENALIDADE -> desmarca a alternativa selecionada
    if (efeito.limparResposta) {
        respostaSelecionada = null;
        areaRespostas.querySelectorAll(".alternativa").forEach(botao => {
            botao.classList.remove("selecionada");
            botao.setAttribute("aria-checked", "false");
        });
        definirBotao("Dica");
    }
});

// 15. INICIAR ATIVIDADE

carregarAtividade();

