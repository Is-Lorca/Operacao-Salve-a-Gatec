async function carregarDialogo() {
  const materia = localStorage.getItem("materia");

  const personagem = localStorage.getItem("personagem");

  const resposta = await fetch(`src/dialogos/${personagem}/${materia}.json`); // adicionar var de personagem

  if (!resposta.ok) {
    console.error("Não foi possível carregar o diálogo.");
    return;
  }

  dialogo = await resposta.json();

  document.getElementById("tituloMateria").textContent = dialogo.titulo;

  mostrarDialogo(dialogo.inicio);
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
