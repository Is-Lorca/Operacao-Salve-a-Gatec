
// PERGUNTAS DO DESAFIO
const perguntas = [

    {
        enunciado: `Considere as afirmações:

I. 8 é um número par.
II. Qual é o seu nome?
III. 5 + 3 = 10.

Qual alternativa apresenta apenas proposições?`,

        alternativas: [
            "A) Apenas I.",
            "B) Apenas II.",
            "C) I e III.",
            "D) II e III."
        ],

        respostaCorreta: 2,
        pontos: 1
    },

    {
        enunciado: `Dados os conjuntos:

A = {1, 2, 3, 4}
B = {3, 4, 5, 6}

Qual é a interseção entre A e B?`,

        alternativas: [
            "A) {1, 2}",
            "B) {3, 4}",
            "C) {1, 2, 3, 4, 5, 6}",
            "D) {5, 6}"
        ],

        respostaCorreta: 1,
        pontos: 1
    },

    {
        enunciado: `Considere:

A = Verdadeiro
B = Falso

Qual é o resultado de A ∧ ¬B?`,

        alternativas: [
            "A) Verdadeiro.",
            "B) Falso.",
            "C) Indeterminado.",
            "D) Não é uma proposição."
        ],

        respostaCorreta: 0,
        pontos: 1
    },

    {
        enunciado: `Um jogador está localizado no ponto (-3, 4).

Em qual quadrante ele está?`,

        alternativas: [
            "A) Primeiro quadrante.",
            "B) Segundo quadrante.",
            "C) Terceiro quadrante.",
            "D) Quarto quadrante."
        ],

        respostaCorreta: 1,
        pontos: 1
    },

    {
        enunciado: `Uma máquina transforma cada número de entrada multiplicando-o por 2 e adicionando 3.

Se a entrada for 4, qual será o resultado?`,

        alternativas: [
            "A) 8",
            "B) 10",
            "C) 11",
            "D) 14"
        ],

        respostaCorreta: 2,
        pontos: 1
    },

    {
        enunciado: `Considere:

A = {1, 2}
B = {3, 4}

R = {(1,3), (2,4)}

Qual alternativa representa corretamente essa relação?`,

        alternativas: [
            "A) 1 está relacionado com 4 e 2 com 3.",
            "B) 1 está relacionado com 3 e 2 com 4.",
            "C) 1 está relacionado com 2 e 3 com 4.",
            "D) Todos os elementos estão relacionados entre si."
        ],

        respostaCorreta: 1,
        pontos: 1
    },

    {
        enunciado: `Uma reta passa pelos pontos A(2, 3) e B(4, 7).

Qual é o coeficiente angular dessa reta?`,

        alternativas: [
            "A) 1",
            "B) 2",
            "C) 3",
            "D) 4"
        ],

        respostaCorreta: 1,
        pontos: 1
    },

    {
        enunciado: `Considere a relação:

R = {(1,2), (2,4), (3,6), (3,8)}

Essa relação representa uma função?`,

        alternativas: [
            "A) Sim, porque todos os elementos possuem resultados.",
            "B) Sim, porque existem quatro pares ordenados.",
            "C) Não, porque o elemento 3 possui duas imagens diferentes.",
            "D) Não, porque os resultados são números pares."
        ],

        respostaCorreta: 2,
        pontos: 1
    },

    {
        enunciado: `Em uma turma:

A = {1, 2, 3, 4}
B = {3, 4, 5, 6}

Considere:

X = (A ∪ B) - (A ∩ B)

Qual é o conjunto X?`,

        alternativas: [
            "A) {3, 4}",
            "B) {1, 2, 5, 6}",
            "C) {1, 2, 3, 4, 5, 6}",
            "D) {1, 2}"
        ],

        respostaCorreta: 1,
        pontos: 1
    },

    {
        enunciado: `Uma empresa desenvolveu um sistema utilizando:

f(x) = 2x + 1

Considere:

I. Quando x = 3, o resultado é 7.
II. O coeficiente angular é 1.
III. A reta corta o eixo Y no ponto (0, 1).

Quais afirmações são verdadeiras?`,

        alternativas: [
            "A) Apenas I.",
            "B) Apenas II e III.",
            "C) Apenas I e III.",
            "D) Todas são verdadeiras."
        ],

        respostaCorreta: 2,
        pontos: 1
    }

];


// VARIÁVEIS DO DESAFIO
let questaoAtual = 0;
let pontuacao = 0;
let quantidadeAcertos = 0;
let alternativaSelecionada = null;


// ELEMENTOS DO HTML
const telaPrincipal = document.getElementById("telaPrincipal");
const telaInicial = document.getElementById("telaInicial");
const telaPerguntas = document.getElementById("telaPerguntas");
const telaResultado = document.getElementById("telaResultado");

const botaoIniciar = document.getElementById("botaoIniciar");
const botaoConfirmar = document.getElementById("botaoConfirmar");
const botaoProxima = document.getElementById("botaoProxima");
const botaoReiniciar = document.getElementById("botaoReiniciar");

const alternativas = document.getElementById("alternativas");
const enunciado = document.getElementById("enunciado");

const progresso = document.getElementById("progresso");
const pontuacaoTela = document.getElementById("pontuacao");
const feedback = document.getElementById("feedback");

const preenchimentoProgresso =
    document.getElementById("preenchimentoProgresso");


// INICIAR DESAFIO
botaoIniciar.addEventListener("click", () => {

    telaPrincipal.hidden = true;
    telaInicial.hidden = true;
    telaPerguntas.hidden = false;
    telaResultado.hidden = true;

    mostrarQuestao();

});


// MOSTRAR QUESTÃO
function mostrarQuestao() {

    alternativaSelecionada = null;

    const questao = perguntas[questaoAtual];

    enunciado.textContent = questao.enunciado;

    progresso.textContent =
        `Questão ${questaoAtual + 1} de ${perguntas.length}`;

    pontuacaoTela.textContent = `Pontos: ${pontuacao}`;

    preenchimentoProgresso.style.width =
        `${(questaoAtual / perguntas.length) * 100}%`;

    feedback.textContent = "";

    alternativas.innerHTML = "";

    questao.alternativas.forEach((alternativa, indice) => {

        const botao = document.createElement("button");

        botao.textContent = alternativa;
        botao.classList.add("alternativa");

        botao.addEventListener("click", () => {
            selecionarAlternativa(indice, botao);
        });

        alternativas.appendChild(botao);

    });

    botaoConfirmar.hidden = false;
    botaoConfirmar.disabled = true;

    botaoProxima.hidden = true;

}


// SELECIONAR ALTERNATIVA
function selecionarAlternativa(indice, botaoClicado) {

    alternativaSelecionada = indice;

    const botoes = document.querySelectorAll(".alternativa");

    botoes.forEach((botao) => {
        botao.classList.remove("selecionada");
    });

    botaoClicado.classList.add("selecionada");

    botaoConfirmar.disabled = false;

}


// CONFIRMAR RESPOSTA
botaoConfirmar.addEventListener("click", () => {

    if (alternativaSelecionada === null) {
        return;
    }

    const questao = perguntas[questaoAtual];

    const acertou =
        alternativaSelecionada === questao.respostaCorreta;

    if (acertou) {

        pontuacao += questao.pontos;
        quantidadeAcertos++;

        feedback.textContent =
            `Resposta correta! +${questao.pontos} ponto.`;

    } else {

        feedback.textContent = "Resposta incorreta!";

    }

    pontuacaoTela.textContent = `Pontos: ${pontuacao}`;

    // Impede trocar a resposta depois da confirmação
    const botoes = document.querySelectorAll(".alternativa");

    botoes.forEach((botao) => {
        botao.disabled = true;
    });

    botaoConfirmar.hidden = true;
    botaoProxima.hidden = false;

});


// PRÓXIMA QUESTÃO
botaoProxima.addEventListener("click", () => {

    questaoAtual++;

    if (questaoAtual < perguntas.length) {

        mostrarQuestao();

    } else {

        mostrarResultado();

    }

});


// MOSTRAR RESULTADO
function mostrarResultado() {

    telaPrincipal.hidden = true;
    telaInicial.hidden = true;
    telaPerguntas.hidden = true;
    telaResultado.hidden = false;

    preenchimentoProgresso.style.width = "100%";

    document.getElementById("quantidadeAcertos").textContent =
        `Você acertou ${quantidadeAcertos} de ${perguntas.length} questões!`;

    document.getElementById("pontuacaoFinal").textContent =
        `Pontuação: ${pontuacao} de 10 pontos.`;

    const classificacao =
        document.getElementById("classificacao");

    const tituloResultado =
        document.getElementById("tituloResultado");

    if (pontuacao >= 8) {

        // GOOD ENDING
        tituloResultado.textContent = "GOOD ENDING!";

        classificacao.textContent =
            "Você conseguiu salvar a GATEC!";

    } else {

        // BAD ENDING
        tituloResultado.textContent = "BAD ENDING!";

        classificacao.textContent =
            "Mr. Plutônio venceu... A GATEC foi perdida!";

    }

}


// REINICIAR DESAFIO
botaoReiniciar.addEventListener("click", () => {

    questaoAtual = 0;
    pontuacao = 0;
    quantidadeAcertos = 0;
    alternativaSelecionada = null;

    telaResultado.hidden = true;

    telaPrincipal.hidden = false;
    telaInicial.hidden = false;
    telaPerguntas.hidden = true;

    pontuacaoTela.textContent = "Pontos: 0";

    preenchimentoProgresso.style.width = "0%";

});
