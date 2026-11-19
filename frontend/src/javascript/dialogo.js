
async function carregarDialogo() {
  // >>> NOVO 1/3: ler o que a atividade.js avisou pelo endereço da página
  // Exemplo: draPeixoto.html?cena=cantina&aberta=true
  const parametros = new URLSearchParams(window.location.search);
  const cena = parametros.get("cena"); // "cantina", ou null nos diálogos normais

  // NOVO: identificar se estamos carregando uma aula
  const aula = parametros.get("aula") === "true";
  //

  // >>> NOVO 1/3 (continuação): se for a cena da cantina, usa o cantina.json da Peixoto.
  // Se não for, funciona exatamente como antes (matéria e personagem do localStorage).
  const materia = cena || localStorage.getItem("materia");

  // NOVO: nas aulas, a personagem será sempre a Peixoto
  const personagem = (cena || aula)
    ? "peixoto"
    : localStorage.getItem("personagem");
  //

  // NOVO: ajustar o nome do arquivo da matéria, caso necessário
  const arquivoMateria = materia === "planoCartesiano"
    ? "produtoCartesiano"
    : materia;

  const resposta = await fetch(`src/dialogos/${personagem}/${arquivoMateria}.json`); // adicionar var de personagem

  if (!resposta.ok) {
    console.error("Não foi possível carregar o diálogo.");
    return;
  }

  dialogo = await resposta.json();

  document.getElementById("tituloMateria").textContent = dialogo.titulo;

  // >>> NOVO 2/3: escolher qual fala começa (antes era só: mostrarDialogo(dialogo.inicio);)
  let inicio = dialogo.inicio;

  // Só o cantina.json tem "inicios". Os diálogos de matéria não têm,
  // então continuam usando o "inicio" normal.
  if (dialogo.inicios) {
    inicio =
      parametros.get("aberta") === "true"
        ? dialogo.inicios.aberta // cantina aberta
        : dialogo.inicios.fechada; // cantina fechada (ou sem aviso nenhum)
  }

  mostrarDialogo(inicio);
  //
}

function mostrarDialogo(chave) {
  const no = dialogo.dialogos[chave];

  if (!no) {
    console.error(`Nó "${chave}" não encontrado.`);
    return;
  }

  // dialogo[logica]
  noAtual = chave;
  // logica

  // vai no documento e pega o elemento pelo id de nome "X"
  const bt1 = document.getElementById("bt1");
  const bt2 = document.getElementById("bt2");

  // dialogo.inicio.opção1 -> abre dialogo -> pega inicio -> pega opcao1
  bt1.textContent = no.opcao1;

  // quando bt1 apertado = mostrarDialogo(logica) e para a animação anterior
  bt1.onclick = (evento) => {
    evento.stopPropagation();

    if (no.acao1 === "voltarMaterias") {
      window.location.href = "selecaoMateria.html";
      return;
    }

    // >>> NOVO 3/3: nova ação, para o botão levar à cantina
    if (no.acao1 === "irCantina") {
      window.location.href = "cantina.html";
      return;
    }

    // NOVO: depois de terminar a aula, vai para a atividade
    if (no.acao1 === "irAtividade") {
      window.location.href = "atividade.html";
      return;
    }

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
    // dialogo.inicio.texto -> abre dialogo -> pega inicio -> pega texto
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

const elemento = document.getElementById("falaPersona");
let dialogo = {};
let noAtual = "";
let i = 0;
let fala = "";

carregarDialogo();
