class MateriaModel {
    // método especial para criar e inicializar objetos criados a partir de uma classe 
    // (disparado automaticamente no momento em que inicializamos um novo objeto (com new))

    // diferente de Java, só podemos criar um construtor por classe e o nome sempre será constructor()
    constructor(){
        // simula o bd dentro do Model
        this.materiasBd = [
            { id: 1, nome: "Proposição" },
            { id: 2, nome: "Conjuntos" },
            { id: 3, nome: "Tabela Verdade" }
        ];
    }
    async buscarMaterias(){
        return this.materiasB;
    }
}

module.exports = new MateriaModel();