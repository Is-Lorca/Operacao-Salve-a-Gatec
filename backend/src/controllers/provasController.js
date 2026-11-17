const provasService = require("../services/provasService");
const respostaApi = require("../utils/respostaApi");

class ProvasController {
    async gerarProva(req, res) {
        try {
            const idSave = req.save.id_save;

            const materias = req.body.materias;

            const prova = await provasService.gerarProva(idSave, materias);

            return res.status(201).json(respostaApi(true, "Prova final gerada com sucesso.", prova));
        } 
        catch (error) {
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async buscarProva(req, res) {
        try {
            const idSave = req.save.id_save;

            const prova = await provasService.buscarProvaPorSave(idSave);

            return res.status(200).json(respostaApi(true, "Prova encontrada.", prova));
        } 
        catch (error) {
            return res.status(404).json(respostaApi(false, error.message));
        }
    }
    async buscarQuestoes(req, res) {
        try {
            const { idProva } = req.params;

            const questoes = await provasService.buscarQuestoesProva(idProva);

            return res.status(200).json(respostaApi(true, "Questões carregadas.", questoes));
        } 
        catch (error) {
            return res.status(404).json(respostaApi(false, error.message));
        }
    }
    async responderQuestao(req, res) {
        try {
            const { idProva, idQuestao } = req.params;

            const { acertou } = req.body;

            const resposta = await provasService.registrarResposta(
                idProva,
                idQuestao,
                acertou,
            );

            return res.status(200).json(respostaApi(true, "Resposta registrada.", resposta));
        } 
        catch (error) {
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async finalizarProva(req, res) {
        try {
            const { idProva } = req.params;

            const resultado = await provasService.corrigirProva(idProva);

            return res.status(200).json(respostaApi(true, "Prova finalizada.", resultado));
        } 
        catch (error) {
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
}

module.exports = new ProvasController();
