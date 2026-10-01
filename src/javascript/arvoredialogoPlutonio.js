function mostrarDialogo(chave) {
  const no = dialogo[chave];
  // dialogo[logica]
  noAtual = chave;
  // logica

  // dialogo.inicio.texto -> abre dialogo -> pega inicio -> pega texto
  elemento.textContent = no.texto;

  // vai no documento e pega o elemento pelo id de nome "X"
  const bt1 = document.getElementById("bt1");
  const bt2 = document.getElementById("bt2");

  // dialogo.inicio.opção1 -> abre dialogo -> pega inicio -> pega opcao1
  bt1.textContent = no.opcao1;
  // quando bt1 apertado = mostrarDialogo(logica) e para a animação anterior
  bt1.onclick = (evento) => {
    evento.stopPropagation();
    mostrarDialogo(no.proximo1);
  };

  if (no.opcao2) {
    bt2.style.display = "inline-block";
    bt2.textContent = no.opcao2;

    bt2.onclick = (evento) => {
      evento.stopPropagation();
      mostrarDialogo(no.proximo2);
    };
  } else {
    bt2.style.display = "none";
  }

  escrever(no.texto);
}

function escrever(texto) {
  function falaCompleta() {
    clearTimeout(escrever.timer);
    elemento.textContent = fala;
    tela.removeEventListener("click", falaCompleta);
  }

  function passo() {
    if (i < fala.length) {
      // pega o elemento, altera o conteudo de texto dele e adiciona 1 letra por vez
      elemento.textContent += fala.charAt(i);
      // pega fala, "abre ele" e pega o caracter que está armazenado na posição i
      i++;
      // atualiza ponteiro
      escrever.timer = setTimeout(passo, 30);
      // espera 30 ms para recomeçar o if
    } else {
      tela.removeEventListener("click", falaCompleta);
    }
  }
  clearTimeout(escrever.timer);
  elemento.textContent = "";
  fala = texto;
  i = 0;
  // i é ponteiro, aponta para o local
  tela = document.getElementById("bodyPersona");
  tela.addEventListener("click", falaCompleta);

  passo();
}

const dialogo = {
    inicio: {
        texto: "Bom dia, nobres colegas! Eu sou o Mr. Plutônio, e sim, antes que perguntem, aquele Plutônio, das Indústrias Plutônio. Vim pessoalmente, o que já demonstra a seriedade desta proposta.",
        opcao1: "Próximo",
        proximo1: "conceito1",
        opcao2: null,
        proximo2: null,
    },

  conceito1: {
    texto:
      "Antes de falarmos de privatização, preciso que dominem um conceito básico: proposição, do contrário, nossa negociação vai por água abaixo. Prestem atenção, porque não repito duas vezes, ou melhor, repito, mas cobro juros.",
    opcao1: "Próximo",
    proximo1: "conceito2",
    opcao2: null,
    proximo2: null,
  },

  conceito2: {
    texto:
      'Proposição é toda frase que se consegue classificar como verdadeira ou falsa. Nada de ambiguidade, nada de "depende do ponto de vista".',
    opcao1: "Próximo",
    proximo1: "conceito3",
    opcao2: null,
    proximo2: null,
  },

    conceito3: {
        texto: "O que não pode ser julgado como verdadeiro ou falso não é proposição: perguntas, ordens, desejos e opiniões ficam de fora. Uma proposta vaga, sem números fechados, é exatamente isso: inútil tanto na lógica quanto nos negócios. ",
        opcao1: "Entendi!",
        proximo1: "resposta1a",
        opcao2: "Se negócio com números é difícil, então negócio com escola pública é impossível",
        proximo2: "resposta1b",
    },

  resposta1a: {
    texto: "Será? Continuando...",
    opcao1: "Próximo",
    proximo1: "pergunta1",
    opcao2: null,
    proximo2: null,
  },

  resposta1b: {
    texto:
      "Sua afirmativa é falsa, mas o raciocínio é surpreendentemente lógico para quem não usa terno. Vamos adiante.",
    opcao1: "Próximo",
    proximo1: "pergunta1",
    opcao2: null,
    proximo2: null,
  },

  pergunta1: {
    texto:
      'Com base no que expliquei, a frase "A privatização é vantajosa se e somente se não houver prejuízo à comunidade." é uma proposição?',
    opcao1: "Sim",
    proximo1: "pergunta1Certo",
    opcao2: "Não",
    proximo2: "pergunta1Errado",
  },

  pergunta1Certo: {
    texto:
      "Correto! É proposição porque é declarativa e tem valor de verdade determinável, apesar de ser uma afirmativa falsa. Afinal, não nos importamos com prejuízos à comunidade.",
    opcao1: "Próximo",
    proximo1: "pergunta2",
    opcao2: null,
    proximo2: null,
  },

  pergunta1Errado: {
    texto:
      "Errado... é proposição porque conseguimos julgar se é verdadeira ou falsa. Prestem mais atenção da próxima vez, o tempo de um empresário é precioso.",
    opcao1: "Próximo",
    proximo1: "pergunta2",
    opcao2: null,
    proximo2: null,
  },

  pergunta2: {
    texto: 'Agora, "A escola é pública e isso será vendido", é uma proposição?',
    opcao1: "Com certeza! É proposição",
    proximo1: "pergunta2Errado",
    opcao2: "A frase não é proposição e a escola é pública!",
    proximo2: "pergunta2Certo",
  },

  pergunta2Certo: {
    texto:
      'Isso mesmo! E fizeram uma ótima observação: a escola é pública, porém a frase não é proposição, pois "isso" não diz a que se refere, não dá para julgar se "isso será vendido" é verdade ou mentira. Ambiguidade, a inimiga de todo bom contrato.',
    opcao1: "Próximo",
    proximo1: "conjuncaoIntro",
    opcao2: null,
    proximo2: null,
  },

  pergunta2Errado: {
    texto:
      'Errado!!! Não é proposição, pois "isso" não diz a que se refere, não dá para julgar se "isso será vendido" é verdade ou mentira.',
    opcao1: "Próximo",
    proximo1: "conjuncaoIntro",
    opcao2: null,
    proximo2: null,
  },

    conjuncaoIntro: {
        texto: "Proposições isoladas são úteis, mas o verdadeiro poder está em conectá-las, assim como se controlam contratos e pessoas. O primeiro conectivo que o senhor precisa dominar é a conjunção, representada pelo símbolo ∧, que significa \"e\".",
        opcao1: "Próximo",
        proximo1: "conjuncaoIntro2",
        opcao2: null,
        proximo2: null,
    },

    conjuncaoIntro2: {
        texto: "Quando escrevemos A ∧ B, lemos \“A e B\”. A conjunção será verdadeira quando A é verdadeira e B também é verdadeira.",
        opcao1: "Dê um exemplo",
        proximo1: "conjuncaoExemplo",
        opcao2: null,
        proximo2: null,
    },

  conjuncaoExemplo: {
    texto:
      "O projeto foi aprovado e o investimento não foi liberado. De acordo com isso, a conjunção é:",
    opcao1: "Verdadeira",
    proximo1: "conjuncaoErrado",
    opcao2: "Falsa",
    proximo2: "conjuncaoCerto",
  },

  conjuncaoErrado: {
    texto:
      "Errado, se uma proposição é falsa, a conjunção inteira também será. Vejo que o senhor não é um investidor muito competente…",
    opcao1: "Próximo",
    proximo1: "disjuncaoIntro",
    opcao2: null,
    proximo2: null,
  },

  conjuncaoCerto: {
    texto:
      "Acertou. Fico satisfeito em ver que consegue acompanhar um raciocínio tão simples.",
    opcao1: "Próximo",
    proximo1: "disjuncaoIntro",
    opcao2: null,
    proximo2: null,
  },

    disjuncaoIntro: {
        texto: "Mas existe outro conectivo muito usado em negociações: a disjunção. Ela é representada pelo símbolo V e corresponde à palavra \"ou\". Quando escrevemos A V B, lemos \"A ou B\".",
        opcao1: "Próximo",
        proximo1: "disjuncaoIntro2",
        opcao2: null,
        proximo2: null,
    },

    disjuncaoIntro2: {
        texto: "Nela, basta que uma das proposições seja verdadeira para que a expressão inteira seja verdadeira.",
        opcao1: "Me explique melhor",
        proximo1: "disjuncaoExemplo",
        opcao2: null,
        proximo2: null,
    },

  disjuncaoExemplo: {
    texto:
      "O governo OU a iniciativa privada financiará o projeto. Imagine que apenas a iniciativa privada financie o projeto. Essa disjunção seria:",
    opcao1: "Verdadeira",
    proximo1: "disjuncaoCerto",
    opcao2: "Falsa",
    proximo2: "disjuncaoErrado",
  },

  disjuncaoCerto: {
    texto: "Correto, só é necessário que uma proposição ser verdadeira.",
    opcao1: "E se o governo e a iniciativa privada financiassem o projeto?",
    proximo1: "disjuncaoAmbos",
    opcao2: null,
    proximo2: null,
  },

  disjuncaoErrado: {
    texto:
      "Errado, apenas uma proposição seja verdadeira para que a disjunção também seja verdadeira.",
    opcao1: "E se o governo e a iniciativa privada financiassem o projeto?",
    proximo1: "disjuncaoAmbos",
    opcao2: null,
    proximo2: null,
  },

  disjuncaoAmbos: {
    texto:
      "Se as duas forem verdadeiras ao mesmo tempo, a disjunção continua sendo verdadeira. Mas seria meio irrealista pensar que dessa vez o governo ficaria do nosso lado…",
    opcao1: "Próximo",
    proximo1: "condicionalIntro",
    opcao2: null,
    proximo2: null,
  },

    condicionalIntro: {
        texto: "Agora vamos falar de outro conectivo muito útil para quem faz acordos: a condicional. Ela é representada por → e significa \"se... então...\". Quando escrevemos A → B, lemos: \"Se A, então B.\"",
        opcao1: "Próximo",
        proximo1: "condicionalIntro2",
        opcao2: null,
        proximo2: null,
    },

    condicionalIntro2: {
        texto: "Sempre que a primeira proposição for verdadeira, a segunda também deve ser verdadeira. Se a promessa foi feita, ela precisa ser cumprida.",
        opcao1: "Me explique melhor",
        proximo1: "condicionalExemplo",
        opcao2: null,
        proximo2: null,
    },

  condicionalExemplo: {
    texto:
      "Se o contrato for assinado, então o investimento será liberado. Imagine que o contrato foi assinado, mas o investimento não foi liberado. Essa proposição seria:",
    opcao1: "Verdadeira",
    proximo1: "condicionalErrado",
    opcao2: "Falsa",
    proximo2: "condicionalCerto",
  },

  condicionalCerto: {
    texto:
      "Correto. O contrato foi assinado, mas o investimento não foi liberado. A promessa falhou, e isso torna a condicional falsa.",
    opcao1: "Próximo",
    proximo1: "bicondicionalIntro",
    opcao2: null,
    proximo2: null,
  },

  condicionalErrado: {
    texto:
      "Errado. Quando a condição acontece e a consequência não acontece, a condicional é falsa. Em negociações, esse é o tipo de cláusula que costuma acabar nos tribunais.",
    opcao1: "Próximo",
    proximo1: "bicondicionalIntro",
    opcao2: null,
    proximo2: null,
  },

  bicondicionalIntro: {
    texto:
      'Agora o último conectivo: a bicondição. Ela é representada por ↔ e é lida como "A se e somente se B".',
    opcao1: "O que ela tem de diferente?",
    proximo1: "bicondicionalExplicacao",
    opcao2: null,
    proximo2: null,
  },

  bicondicionalExplicacao: {
    texto:
      "Ela exige compromisso dos dois lados. A condição vale na ida e na volta. Se A acontece, B também deve acontecer; e se B acontece, A também deve acontecer.",
    opcao1: "Me dê um exemplo",
    proximo1: "bicondicionalExemplo",
    opcao2: null,
    proximo2: null,
  },

  bicondicionalExemplo: {
    texto:
      "A empresa receberá exclusividade se e somente se investir no projeto. Imagine que a empresa investiu no projeto e recebeu exclusividade. Essa bicondição seria:",
    opcao1: "Verdadeira",
    proximo1: "bicondicionalCerto",
    opcao2: "Falsa",
    proximo2: "bicondicionalErrado",
  },

  bicondicionalCerto: {
    texto:
      "Correto. As duas condições foram satisfeitas, então a bicondição é verdadeira.",
    opcao1: "Próximo",
    proximo1: "final",
    opcao2: null,
    proximo2: null,
  },

  bicondicionalErrado: {
    texto:
      "Errado. Quando as duas proposições têm o mesmo valor lógico, a bicondição é verdadeira.",
    opcao1: "Próximo",
    proximo1: "final",
    opcao2: null,
    proximo2: null,
  },

  final: {
    texto:
      "Muito bem, nobres colegas, por hoje encerro por aqui, inclusive porque meu motorista está esperando.",
    opcao1: "Obrigado pelo conhecimento",
    proximo1: "despedida",
    opcao2: null,
    proximo2: null,
  },

    despedida: {
        texto: "Agradeça votando a favor da minha empresa, colega. Nos vemos na próxima sessão, ou nos corredores, se me permitirem circular por eles. Até mais!",
        opcao1: "RETURN",
        proximo1: "inicio",
        opcao2: null,
        proximo2: null,
    },
};

const elemento = document.getElementById("falaPersona");
let i = 0;
let fala = "";

mostrarDialogo("inicio");
