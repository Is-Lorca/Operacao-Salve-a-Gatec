
import { provasApi } from './api/provasApi.js';


// ==========================================
// VARIÁVEIS DO DESAFIO
// ==========================================

let perguntas = [];

let idProva = null;

let questaoAtual = 0;
let pontuacao = 0;
let quantidadeAcertos = 0;

let alternativaSelecionada = null;

let enviandoResposta = false;
let finalizandoProva = false;


// ==========================================
// ELEMENTOS DO HTML
// ==========================================

const telaPrincipal = document.getElementById('telaPrincipal');
const telaInicial = document.getElementById('telaInicial');
const telaPerguntas = document.getElementById('telaPerguntas');
const telaResultado = document.getElementById('telaResultado');

const botaoIniciar = document.getElementById('botaoIniciar');
const botaoConfirmar = document.getElementById('botaoConfirmar');
const botaoProxima = document.getElementById('botaoProxima');
const botaoReiniciar = document.getElementById('botaoReiniciar');

const alternativas = document.getElementById('alternativas');
const enunciado = document.getElementById('enunciado');

const progresso = document.getElementById('progresso');
const pontuacaoTela = document.getElementById('pontuacao');
const feedback = document.getElementById('feedback');

const preenchimentoProgresso =
    document.getElementById('preenchimentoProgresso');


// ==========================================
// INICIAR DESAFIO
// ==========================================

botaoIniciar.addEventListener('click', iniciarDesafio);

async function iniciarDesafio() {

    botaoIniciar.disabled = true;

    try {

        feedback.textContent = '';

        // Solicita a prova ao backend
        const resposta = await provasApi.gerarProva();

        if (!resposta.sucesso) {
            throw new Error(
                resposta.mensagem || 'Não foi possível carregar a prova.'
            );
        }

        const prova = resposta.data;

        if (!prova || !prova.id_prova) {
            throw new Error('O backend não retornou uma prova válida.');
        }

        if (!Array.isArray(prova.questoes) || prova.questoes.length === 0) {
            throw new Error('Nenhuma questão foi encontrada na prova.');
        }

        idProva = prova.id_prova;


        // Transforma os dados do banco no formato usado pela tela
        perguntas = prova.questoes.map(questao => {

            if (
                !Array.isArray(questao.alternativas) ||
                questao.alternativas.length === 0
            ) {
                throw new Error(
                    `A questão ${questao.id_questao} não possui alternativas.`
                );
            }

            const indiceCorreto = questao.alternativas.findIndex(
                alternativa => alternativa.correta === true
            );

            if (indiceCorreto === -1) {
                throw new Error(
                    `A questão ${questao.id_questao} não possui alternativa correta.`
                );
            }

            return {

                idQuestao: questao.id_questao,

                enunciado: questao.enunciado,

                alternativas: questao.alternativas.map(alternativa => ({
                    idAlternativa: alternativa.id_alternativa,
                    texto: alternativa.texto,
                    correta: alternativa.correta
                })),

                respostaCorreta: indiceCorreto

            };

        });


        // Reinicia os valores visuais
        questaoAtual = 0;
        pontuacao = 0;
        quantidadeAcertos = 0;
        alternativaSelecionada = null;


        // Mostra somente a tela das perguntas
        telaPrincipal.hidden = true;
        telaInicial.hidden = true;
        telaPerguntas.hidden = false;
        telaResultado.hidden = true;

        mostrarQuestao();

    } catch (erro) {

        console.error('Erro ao iniciar o desafio:', erro);

        alert(
            'Não foi possível iniciar o desafio:\n' + erro.message
        );

    } finally {

        botaoIniciar.disabled = false;

    }

}


// ==========================================
// MOSTRAR QUESTÃO
// ==========================================

function mostrarQuestao() {

    alternativaSelecionada = null;
    enviandoResposta = false;

    const questao = perguntas[questaoAtual];

    enunciado.textContent = questao.enunciado;

    progresso.textContent =
        `Questão ${questaoAtual + 1} de ${perguntas.length}`;

    pontuacaoTela.textContent =
        `Pontos: ${pontuacao}`;

    preenchimentoProgresso.style.width =
        `${(questaoAtual / perguntas.length) * 100}%`;

    feedback.textContent = '';

    alternativas.innerHTML = '';


    // Cria os botões das alternativas
    questao.alternativas.forEach((alternativa, indice) => {

        const botao = document.createElement('button');

        botao.textContent = alternativa.texto;

        botao.classList.add('alternativa');

        botao.addEventListener('click', () => {

            selecionarAlternativa(indice, botao);

        });

        alternativas.appendChild(botao);

    });


    botaoConfirmar.hidden = false;
    botaoConfirmar.disabled = true;

    botaoProxima.hidden = true;
    botaoProxima.disabled = false;

}


// ==========================================
// SELECIONAR ALTERNATIVA
// ==========================================

function selecionarAlternativa(indice, botaoClicado) {

    if (enviandoResposta) {
        return;
    }

    alternativaSelecionada = indice;

    const botoes = document.querySelectorAll('.alternativa');

    botoes.forEach(botao => {
        botao.classList.remove('selecionada');
    });

    botaoClicado.classList.add('selecionada');

    botaoConfirmar.disabled = false;

}


// ==========================================
// CONFIRMAR RESPOSTA
// ==========================================

botaoConfirmar.addEventListener('click', confirmarResposta);

async function confirmarResposta() {

    if (
        alternativaSelecionada === null ||
        enviandoResposta
    ) {
        return;
    }

    enviandoResposta = true;

    botaoConfirmar.disabled = true;

    const questao = perguntas[questaoAtual];

    const acertou =
        alternativaSelecionada === questao.respostaCorreta;


    try {

        // Envia a resposta para o backend
        const resposta = await provasApi.responderQuestao(
            idProva,
            questao.idQuestao,
            acertou
        );

        if (!resposta.sucesso) {
            throw new Error(
                resposta.mensagem || 'Não foi possível registrar a resposta.'
            );
        }


        // Atualiza a pontuação visual
        if (acertou) {

            pontuacao++;
            quantidadeAcertos++;

            feedback.textContent = 'Resposta correta! +1 ponto.';

        } else {

            feedback.textContent = 'Resposta incorreta!';

        }


        pontuacaoTela.textContent =
            `Pontos: ${pontuacao}`;


        // Impede que o jogador altere a resposta
        const botoes = document.querySelectorAll('.alternativa');

        botoes.forEach(botao => {
            botao.disabled = true;
        });


        botaoConfirmar.hidden = true;
        botaoProxima.hidden = false;

        if (questaoAtual === perguntas.length - 1) {
            botaoProxima.textContent = 'Ver resultado';
        } else {
            botaoProxima.textContent = 'Próxima questão';
        }

    } catch (erro) {

        console.error('Erro ao registrar resposta:', erro);

        feedback.textContent =
            'Não foi possível registrar sua resposta. Tente novamente.';

        botaoConfirmar.disabled = false;

    } finally {

        enviandoResposta = false;

    }

}


// ==========================================
// PRÓXIMA QUESTÃO
// ==========================================

botaoProxima.addEventListener('click', proximaQuestao);

async function proximaQuestao() {

    if (enviandoResposta || finalizandoProva) {
        return;
    }

    botaoProxima.disabled = true;


    // Se ainda existem questões, mostra a próxima
    if (questaoAtual < perguntas.length - 1) {

        questaoAtual++;

        mostrarQuestao();

    } else {

        // Se terminou as questões, finaliza a prova
        await finalizarDesafio();

    }

}


// ==========================================
// FINALIZAR DESAFIO
// ==========================================

async function finalizarDesafio() {

    if (finalizandoProva) {
        return;
    }

    finalizandoProva = true;

    botaoProxima.disabled = true;

    botaoProxima.textContent = 'Calculando resultado...';

    feedback.textContent = 'Calculando sua média final...';


    try {

        // O backend calcula a nota e a média final
        const resposta = await provasApi.finalizarProva(idProva);

        if (!resposta.sucesso) {
            throw new Error(
                resposta.mensagem || 'Não foi possível finalizar a prova.'
            );
        }

        const resultado = resposta.data;

        if (
            !resultado ||
            typeof resultado.mediaFinal !== 'number' ||
            !resultado.resultado
        ) {
            throw new Error('O backend não retornou um resultado válido.');
        }


        // Exibe o resultado enviado pelo backend
        mostrarResultado(resultado);

    } catch (erro) {

        console.error('Erro ao finalizar prova:', erro);

        feedback.textContent =
            'Não foi possível calcular o resultado. Clique para tentar novamente.';

        botaoProxima.textContent = 'Tentar novamente';

        botaoProxima.disabled = false;

    } finally {

        finalizandoProva = false;

    }

}


// ==========================================
// MOSTRAR RESULTADO
// ==========================================

function mostrarResultado(resultado) {

    telaPrincipal.hidden = true;
    telaInicial.hidden = true;
    telaPerguntas.hidden = true;
    telaResultado.hidden = false;

    preenchimentoProgresso.style.width = '100%';


    document.getElementById('quantidadeAcertos').textContent =
        `Você acertou ${quantidadeAcertos} de ${perguntas.length} questões!`;


    document.getElementById('pontuacaoFinal').textContent =
        `Nota da prova: ${resultado.notaProva}/10 | ` +
        `Média das atividades: ${resultado.mediaAtividades} | ` +
        `Média final: ${resultado.mediaFinal}`;


    const classificacao =
        document.getElementById('classificacao');

    const tituloResultado =
        document.getElementById('tituloResultado');


    // A decisão é feita pelo backend
    if (resultado.resultado === 'GOOD_ENDING') {

        tituloResultado.textContent = 'GOOD ENDING!';

        classificacao.textContent =
            'Você conseguiu salvar a GATEC!';

    } else {

        tituloResultado.textContent = 'BAD ENDING!';

        classificacao.textContent =
            'Mr. Plutônio venceu... A GATEC foi perdida!';

    }

}


// ==========================================
// BOTÃO DE VOLTAR
// ==========================================

botaoReiniciar.addEventListener('click', () => {

    // A prova já foi finalizada no banco.
    // Não é possível reiniciá-la no mesmo save.
    window.history.back();

});
