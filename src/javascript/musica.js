const botao = document.getElementById("botaoAudio")
const audio = document.getElementById("audio")
let icone = document.getElementById("iconMute")

botao.addEventListener("click", function () {
     if (audio.paused) {
    audio.play();
    icone.src = "./src/img/opcoes audio/Audio3.png";
  } else {
    audio.pause();
    icone.src = "./src/img/opcoes audio/AudioMute3.png";
  }
});

