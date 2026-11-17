
// 1. ELEMENTOS DO HTML


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



// 2. QUESTÕES DE TESTE


const questoes = [
    {
        enunciado: "Qual das alternativas representa uma proposição verdadeira?",
        dica: "Pense em uma igualdade matemática que esteja correta.",
        alternativas: [
            { texto: "2 + 2 = 5", correta: false },
            { texto: "2 + 2 = 4", correta: true },
            { texto: "3 + 1 = 8", correta: false },
            { texto: "5 - 2 = 1", correta: false }
        ]
    },
    {
        enunciado: "Qual alternativa representa uma proposição falsa?",
        dica: "Uma proposição falsa é uma afirmação que não corresponde à realidade.",
        alternativas: [
            { texto: "O Sol é uma estrela.", correta: false },
            { texto: "A água é formada por hidrogênio e oxigênio.", correta: false },
            { texto: "10 é menor que 3.", correta: true },
            { texto: "O número 2 é par.", correta: false }
        ]
    },
    {
        enunciado: "Qual destas frases NÃO é uma proposição?",
        dica: "Uma proposição precisa ser uma afirmação que possa ser verdadeira ou falsa.",
        alternativas: [
            { texto: "O Brasil fica na América do Sul.", correta: false },
            { texto: "Feche a porta!", correta: true },
            { texto: "5 é maior que 2.", correta: false },
            { texto: "A Terra gira em torno do Sol.", correta: false }
        ]
    },
    {
        enunciado: "Se P é verdadeira e Q é falsa, qual é o resultado de P E Q?",
        dica: "Na conjunção (E), as duas proposições precisam ser verdadeiras.",
        alternativas: [
            { texto: "Verdadeiro", correta: false },
            { texto: "Falso", correta: true },
            { texto: "Indeterminado", correta: false },
            { texto: "Nenhuma das alternativas", correta: false }
        ]
    },
    {
        enunciado: "Qual é o resultado da negação de uma proposição verdadeira?",
        dica: "A negação inverte o valor lógico da proposição.",
        alternativas: [
            { texto: "Verdadeiro", correta: false },
            { texto: "Falso", correta: true },
            { texto: "Continua verdadeira", correta: false },
            { texto: "Não possui valor lógico", correta: false }
        ]
    },
    {
        enunciado: "Na disjunção (OU), quando o resultado é falso?",
        dica: "Basta uma das proposições ser verdadeira para a disjunção ser verdadeira.",
        alternativas: [
            { texto: "Quando as duas são verdadeiras.", correta: false },
            { texto: "Quando apenas uma é verdadeira.", correta: false },
            { texto: "Quando as duas são falsas.", correta: true },
            { texto: "Sempre que existe uma proposição falsa.", correta: false }
        ]
    },
    {
        enunciado: "Qual alternativa apresenta uma proposição composta?",
        dica: "Uma proposição composta une duas ou mais proposições usando conectivos lógicos.",
        alternativas: [
            { texto: "O número 8 é par.", correta: false },
            { texto: "Hoje é segunda-feira.", correta: false },
            { texto: "Está chovendo e está frio.", correta: true },
            { texto: "Abra o caderno.", correta: false }
        ]
    }
];



// 3. VARIÁVEIS DE CONTROLE


let questaoAtual = 0;
let respostaSelecionada = null;
let respostaVerificada = false;
let acertos = 0;



// 4. MOSTRAR QUESTÃO


function mostrarQuestao() {

    const questao = questoes[questaoAtual];

    textoEnunciado.textContent = questao.enunciado;

    contadorQuestao.textContent =
        `Questão ${questaoAtual + 1}/${questoes.length}`;

    textoDica.textContent = questao.dica;

    areaDica.classList.add("oculto");

    areaRespostas.innerHTML = "";

    respostaSelecionada = null;
    respostaVerificada = false;

    rotuloBotao.textContent = "Dica";
    botaoResponder.disabled = false;

    questao.alternativas.forEach((alternativa, indice) => {

        const botao = document.createElement("button");

        botao.classList.add("alternativa");
        botao.type = "button";
        botao.setAttribute("role", "radio");
        botao.setAttribute("aria-checked", "false");

        botao.innerHTML = `
            <span class="letra-alternativa">
                ${String.fromCharCode(65 + indice)}
            </span>

            <span class="texto-alternativa">
                ${alternativa.texto}
            </span>
        `;

        botao.addEventListener("click", () => {
            selecionarAlternativa(botao, indice);
        });

        areaRespostas.appendChild(botao);

    });

    atualizarProgresso();
}



// 5. SELECIONAR ALTERNATIVA


function selecionarAlternativa(botaoClicado, indice) {

    if (respostaVerificada) {
        return;
    }

    const botoes = areaRespostas.querySelectorAll(".alternativa");

    botoes.forEach(botao => {

        botao.classList.remove("selecionada");
        botao.setAttribute("aria-checked", "false");

    });

    botaoClicado.classList.add("selecionada");
    botaoClicado.setAttribute("aria-checked", "true");

    respostaSelecionada = indice;

    rotuloBotao.textContent = "Responder";
}



// 6. MOSTRAR DICA


function mostrarDica() {

    areaDica.classList.remove("oculto");

}



// 7. VERIFICAR RESPOSTA


function verificarResposta() {

    const questao = questoes[questaoAtual];

    const botoes = areaRespostas.querySelectorAll(".alternativa");

    const acertou = questao.alternativas[respostaSelecionada].correta;

    if (acertou) {
        acertos++;
    }

    botoes.forEach((botao, indice) => {

        botao.disabled = true;

        if (questao.alternativas[indice].correta) {
            botao.classList.add("correta");
        }

        if (indice === respostaSelecionada && !acertou) {
            botao.classList.add("errada");
        }

    });

    respostaVerificada = true;

    rotuloBotao.textContent = "Próxima";

}


// 8. PRÓXIMA QUESTÃO


function proximaQuestao() {

    questaoAtual++;

    if (questaoAtual < questoes.length) {

        mostrarQuestao();

    } else {

        finalizarAtividade();

    }

}



// 9. FINALIZAR ATIVIDADE


function finalizarAtividade() {

    const total = questoes.length;
    const nota = Math.round((acertos / total) * 100);

    contadorQuestao.textContent =
        `Questão ${total}/${total}`;

    textoEnunciado.textContent =
        `Atividade concluída! Você acertou ${acertos} de ${total} questões. Nota: ${nota}%.`;

    areaRespostas.innerHTML = "";
    areaDica.classList.add("oculto");

    textoProgresso.textContent = "Progresso: 100%";
    preenchimentoProgresso.style.width = "100%";
    barraProgresso.setAttribute("aria-valuenow", 100);

    rotuloBotao.textContent = "Concluído";
    botaoResponder.disabled = true;

}



// 10. ATUALIZAR PROGRESSO

function atualizarProgresso() {

    const progresso = (questaoAtual / questoes.length) * 100;

    textoProgresso.textContent =
        `Progresso: ${Math.round(progresso)}%`;

    preenchimentoProgresso.style.width =
        `${progresso}%`;

    barraProgresso.setAttribute(
        "aria-valuenow",
        progresso
    );

}



// 11. BOTÃO PRINCIPAL


botaoResponder.addEventListener("click", () => {

    // Se já respondeu, passa para a próxima questão
    if (respostaVerificada) {
        proximaQuestao();
        return;
    }

    // Se não selecionou alternativa, mostra a dica
    if (respostaSelecionada === null) {
        mostrarDica();
        return;
    }

    // Se selecionou, verifica a resposta
    verificarResposta();

});



// 12. INICIAR ATIVIDADE


mostrarQuestao();
