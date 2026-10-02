const botoesMateria = document.querySelectorAll(".botaoMateria");

botoesMateria.forEach(botao => {

    botao.addEventListener("click", () => {

        // pega o data-materia da materia que sera selecionada no botao
        const materia = botao.dataset.materia; // igual a: data-materia = nome_materia

        localStorage.setItem("materia", materia);

        window.location.href = "selecaoPersona.html";

    });

});