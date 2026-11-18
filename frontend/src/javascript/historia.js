const partesHistoria = [
  {
    titulo: "A GATEC",
    imagem: "src/img/gatecPredio.png", 
    impacto: false,
    texto: `A GATEC sempre foi conhecida como uma das melhores faculdades públicas de tecnologia do país. Mesmo com recursos limitados, seus professores são apaixonados pelo que fazem e acreditam que o verdadeiro conhecimento não vinha apenas dos livros, mas da curiosidade, da prática e da dedicação de cada aluno.\n\nFoi dessa forma que milhares de profissionais saíram de seus corredores, mudando empresas, criando tecnologias e ajudando a construir um futuro melhor.`
  },
  {
    titulo: "",
    imagem: "",
    impacto: true,
    texto: `Mas esse futuro está em perigo.`
  },
  {
    titulo: "Mister Plutônio",
    imagem: "src/img/MrPlutonio.gif",
    impacto: false,
    texto: `Nos últimos meses, um poderoso empresário conhecido como Mister Plutônio, herdeiro das misteriosas Indústrias Plutônio, iniciou uma grande campanha contra a educação pública. Em entrevistas e propagandas, ele afirma que instituições como a GATEC são ultrapassadas, caras para o governo e incapazes de acompanhar a evolução tecnológica.\n\nSua ideia? Transformar a GATEC em uma faculdade privada, totalmente "modernizada", onde todas as aulas seriam ministradas por inteligências artificiais. Segundo ele, isso reduziria custos, aumentaria o número de alunos e tornaria a educação mais eficiente.`
  },
  {
    titulo: "A Verdade Oculta",
    imagem: "src/img/interrogacao.jpg",
    impacto: false,
    texto: `Milhares de pessoas acreditaram em suas palavras.\nMas existe algo que ninguém sabe.\n\nO verdadeiro objetivo de Mister Plutônio nunca foi melhorar a educação.\nEle pretende comprar a GATEC apenas para transformá-la em um grande negócio. Professores seriam demitidos, laboratórios fechados e o ensino seria reduzido ao mínimo necessário para formar profissionais "bons o suficiente", enquanto os lucros cresceriam cada vez mais.`
  },
  {
    titulo: "Dra. Peixoto",
    imagem: "src/img/dragatinha.gif",
    impacto: false,
    texto: `Apenas os professores da GATEC sabem a real intenção de Mister Plutônio, entre eles está a respeitada professora Dra. Peixoto.\n\nPesquisadora e apaixonada pelo ensino, ela sabe que a tecnologia pode ser uma grande aliada da educação, mas jamais deve substituir aquilo que realmente forma um estudante: professores dedicados, pensamento crítico e a vontade de aprender.\n\nSem apoio suficiente para enfrentar Mister Plutônio sozinha, ela aposta sua última esperança em quem ainda pode fazer a diferença.`
  },
  {
    titulo: "",
    imagem: "",
    impacto: true,
    texto: `Você.`
  },
  {
    titulo: "Sua Missão",
    imagem: "src/img/determinacao.jpg",
    impacto: false,
    texto: `Sua missão vai muito além de assistir aulas. Será preciso estudar, superar atividades, enfrentar provas e demonstrar que o conhecimento verdadeiro ainda é a maior ferramenta para transformar o mundo.\n\nSupere os desafios das atividades e tire uma ótima nota na prova final.\nO destino da GATEC está em suas mãos.`
  }
];

const elementoTexto = document.getElementById("textoHistoria");
const cabecalhoCena = document.getElementById("cabecalhoCena");
const imgCena = document.getElementById("imgCena");
const tituloCena = document.getElementById("tituloCena");
const btContinuar = document.getElementById("btContinuar");
const btPular = document.getElementById("btPular");
const btSom = document.getElementById("btSom");
const tela = document.getElementById("bodyHistoria");

let indiceAtual = 0;
let i = 0;
let fala = "";
let somAtivo = true;

// Sintetizador simples para o som de digitação (sem arquivos externos) -> chocante
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function tocarSomTecla() {
  if (!somAtivo) return;
  if (audioCtx.state === "suspended") audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(520 + Math.random() * 80, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.03);
}

function irParaSelecaoMaterias() {
  window.location.href = "selecaoMateria.html";
}

function mostrarParte(indice) {
  indiceAtual = indice;
  const cena = partesHistoria[indiceAtual];

  // Configura destaque visual para frases de impacto
  if (cena.impacto) {
    elementoTexto.classList.add("textoImpacto");
  } else {
    elementoTexto.classList.remove("textoImpacto");
  }

  // Configura retrato e título da cena
  if (cena.titulo || cena.imagem) {
    cabecalhoCena.style.display = "flex";
    tituloCena.textContent = cena.titulo;

    if (cena.imagem) {
      imgCena.src = cena.imagem;
      imgCena.style.display = "block";
    } else {
      imgCena.style.display = "none";
    }
  } else {
    cabecalhoCena.style.display = "none";
  }

  // atualiza botão final
  btContinuar.textContent =
    indiceAtual === partesHistoria.length - 1 ? "Começar Missão!" : "Continuar";

  escrever(cena.texto, cena.impacto ? 55 : 30);
}

function escrever(texto, velocidade = 30) {
  function falaCompleta() {
    clearTimeout(escrever.timer);
    elementoTexto.textContent = fala;
    tela.removeEventListener("click", falaCompleta);
  }

  function passo() {
    if (i < fala.length) {
      const char = fala.charAt(i);
      elementoTexto.textContent += char;

      // Toca o som apenas em letras/números (ignora espaços e quebras de linha)
      if (char.trim() !== "" && i % 2 === 0) {
        tocarSomTecla();
      }

      i++;
      escrever.timer = setTimeout(passo, velocidade);
    } else {
      tela.removeEventListener("click", falaCompleta);
    }
  }

  clearTimeout(escrever.timer);
  elementoTexto.textContent = "";
  fala = texto;
  i = 0;

  tela.removeEventListener("click", falaCompleta);
  tela.addEventListener("click", falaCompleta);

  passo();
}

btContinuar.onclick = (evento) => {
  evento.stopPropagation();
  if (indiceAtual < partesHistoria.length - 1) {
    mostrarParte(indiceAtual + 1);
  } else {
    irParaSelecaoMaterias();
  }
};

btPular.onclick = (evento) => {
  evento.stopPropagation();
  irParaSelecaoMaterias();
};

btSom.onclick = (evento) => {
  evento.stopPropagation();
  somAtivo = !somAtivo;
  btSom.textContent = somAtivo ? "🔊 Som" : "🔇 Mudo";
};

mostrarParte(0);