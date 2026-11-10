class Validacoes {
    validarNome(nome){
        if(!nome || nome.trim() === ""){
            throw new Error("Nome obrigatório.");
        }

        if(nome.length < 3 || nome.length > 30){
            throw new Error("Nome deve possuir entre 3 e 30 caracteres.");
        }

        return true;
    }
    validarEmail(email){
        if(!email || email.trim() === ""){
            throw new Error("E-mail obrigatório.");
        }

        const partes = email.split("@");

        if(partes.length !== 2){
            throw new Error("E-mail inválido.");
        }

        const dominio = partes[1];

        if(!dominio.includes(".")){
            throw new Error("Domínio de e-mail inválido.");
        }

        return email.toLowerCase();
    }
    validarSenha(senha){
        if(!senha || senha.trim() === ""){
            throw new Error("Senha obrigatória.");
        }

        if(senha.length < 8){
            throw new Error("Senha deve possuir no mínimo 8 caracteres.");
        }

        return true;
    }
    validarId(id){
        const idConvertido = parseInt(id, 10);

        if(isNaN(idConvertido)){
            throw new Error("ID inválido.");
        }

        return idConvertido;
    }
}

module.exports = new Validacoes();