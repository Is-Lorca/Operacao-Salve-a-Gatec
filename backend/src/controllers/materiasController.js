// chamamos o utils da resposta padrão que ele deve enviar
const respostaApi = require('../utils/respostaApi');
// chamamos o service para o controller
const materiaService = require('../services/materiasService')

// já exportei diretamente pois só tem uma função
exports.listarMaterias = async (req, res) => {
    try{
        const lista = await materiaService.listarMaterias();

        if(!lista || lista.length === 0){
            throw new Error();
        }

        return res.status(200).json(
            // aqui chamamos a resposta padrão que está no utils (que chamamos la em cima)
            respostaApi(true, "Matérias encontradas", lista)
        );
    }
    catch (error){
        // para acessar aqui, os erros, normalmente, serão no service
        // mesmo se o model enviar uma lista vazia, ele ainda vai considerar como certo
        // por isso adicionei que, caso a lista que ele puxar esteja vazia (!lista), 
        // ele deve mandar um erro
        return res.status(500).json(
            respostaApi(false, "Matérias não encontradas", null)
        );
    }
}