const botoes = document.querySelectorAll('.btnAcessando');

botoes.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const clicado = evento.currentTarget.id;

        if(clicado === 'btnCadastro'){
            window.location.href = 'cadastro.html'
        }
        else if(clicado === 'btnLogin'){
            window.location.href = 'login.html'
        }
    });
});