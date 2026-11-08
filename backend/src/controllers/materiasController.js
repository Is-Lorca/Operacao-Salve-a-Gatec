// chamamos o utils da resposta padrão que ele deve enviar
const respostaApi = require('../utils/respostaApi');
// chamamos o service para o controller
const materiaService = require('../services/materiasService')

// já exportei diretamente pois só tem uma função
exports.listarMaterias = async (req, res) => {
    try{
        const lista = await materiaService.listarMaterias();

        if (!lista) {
            return res.status(404).json(
                respostaApi(false, "Não foi possível carregar as matérias do banco.", null)
            );
        }

        if (lista.length === 0) {
            return res.status(200).json(
                respostaApi(true, "Nenhuma matéria cadastrada ainda.", [])
            );
        }

        return res.status(200).json(
            // aqui chamamos a resposta padrão que está no utils (que chamamos la em cima)
            respostaApi(true, "Matérias encontradas", lista)
        );
    }
    catch (error){
        console.error("ERRO REAL NO BANCO/SERVICE:", error);

        // para acessar aqui, os erros, normalmente, serão no service
        // mesmo se o model enviar uma lista vazia, ele ainda vai considerar como certo
        // por isso adicionei que, caso a lista que ele puxar esteja vazia (!lista), 
        // ele deve mandar um erro
        return res.status(500).json(
            respostaApi(false, "Matérias não encontradas", null)
        );
    }
}