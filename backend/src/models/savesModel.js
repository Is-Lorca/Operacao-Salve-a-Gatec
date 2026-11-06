class SaveModel {
    constructor(){
        // tabela vazia para começar
        this.saveBd = [];
        // "contador" para gerar IDs automaticos e sequenciais
        this.proximoId = 1;
    }

    // criando saves
    async criar(dados){
        const agora = new Date().toISOString();

        const novoSave = {
            // por usarmos pós incremento (var++), ele colocará o valor primeiro e depois incrementará
            // ex. criamos um save e o proximoId = 1, ele coloca que aquele id é 1 e depois soma, agora 
            // proximoId = 2, no proximo save ele será 2 e será somado novamente, o próximo será 3, etc
            id_save: this.proximoId++,
            nome_save: dados.nome_save,
            data_criacao: agora, //salva data e hora atual
            ultimo_save: agora,
            ativo: true
        };

        this.saveBd.push(novoSave);
        return novoSave;
    }

    async buscarSaves(){
        // apenas mostrará aqueles que possuem propriedade ativo = true
        return this.saveBd.filter(save => save.ativo === true);
    }

    async buscarSavesId(id){
        const saveEncontrado = this.saveBd.find(save => save.id_save === Number(id));

        // se o save não for encontrado ou ele estiver ativo = false
        if(!saveEncontrado || !saveEncontrado.ativo){
            return null;
        }

        return saveEncontrado;
    }

    async atualizarSave(id, novosDados){
        const save = await this.buscarSavesId(id);

        if(!save){
            return null; // caso ele não exista, ele não atualiza
        }
        
        if(novosDados.nome_save){
            save.nome_save = novosDados.nome_save;
        }

        save.ultimo_save = new Date().toISOString();
        
        return save;
    }

    async excluirSave(id){
        const save = await this.buscarSavesId(id);

        // faz a mesma checagem que em atualizarSave, mas checa se ele já não foi "apagado"
        if(!save || !save.ativo){
            return false;
        }

        // o correto não é apagar do banco, mas fazer um soft delete
        save.ativo = false;
        return true;
    }
}

module.exports = new SaveModel();