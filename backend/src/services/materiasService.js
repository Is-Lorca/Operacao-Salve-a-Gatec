const materiaModel = require('../models/materiasModel');

class MateriaService {
    // A consulta ao BD, no Node, demora alguns milissegundos, por isso usamos o async (assíncrono)
    // assim o programa não fica parado esperando.
    async listarMaterias() {
        const materias = await materiaModel.buscarMaterias();

        if(!materias){
            return null;
        }
        
        return materias;
    }
}

// exporta a classe, ja criando (iniciando) ela
module.exports = new MateriaService();