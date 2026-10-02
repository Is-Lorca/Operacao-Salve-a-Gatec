const personagens = document.querySelectorAll("button.escolhaPersona");

personagens.forEach((botao) => {
  botao.addEventListener("click", () => {
    const personagem = botao.dataset.personagem;

    localStorage.setItem("personagem", personagem);

    const paginas = {
      peixoto: "draPeixoto.html",

      plutonio: "mrPlutonio.html",
    };

    window.location.href = paginas[personagem];
  });
});
