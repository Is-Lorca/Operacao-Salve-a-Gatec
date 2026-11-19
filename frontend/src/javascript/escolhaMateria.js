const botoesMateria = document.querySelectorAll(".botaoMateria");

// fase - matérias concluídas deste save (ex.: ["proposicao", "conjuntos"])
const chave = `concluidas_${localStorage.getItem("idSave")}`; //fase
const concluidas = JSON.parse(localStorage.getItem(chave) || "[]"); //fase

botoesMateria.forEach((botao, indice) => {

    // fase - a primeira sempre liberada; as outras só se a anterior foi concluída
    const anterior = botoesMateria[indice - 1]; // NOVO
    const liberada = indice === 0 || concluidas.includes(anterior.dataset.materia); // NOVO

    if (!liberada) { // fase
        botao.classList.add("bloqueada"); //
    } // 

    botao.addEventListener("click", () => {

        // fase- se estiver bloqueada, não faz nada
        if (botao.classList.contains("bloqueada")) { // fase
            return; // 
        } // 

        // pega o data-materia da materia que sera selecionada no botao
        const materia = botao.dataset.materia; // igual a: data-materia = nome_materia

        localStorage.setItem("materia", materia);

       window.location.href = "draPeixoto.html?aula=true";

    });

});