const respostaApi = require("../utils/respostaApi");
const atividadesService = require("../services/atividadesService");

class AtividadesController {
    async gerar(req, res) {
        try {
            const idSave = req.save.id_save;
            const { idMateria } = req.params;

            const atividade = await atividadesService.gerarAtividade(idSave, idMateria);

            return res.status(201).json(respostaApi(true, "Atividade gerada com sucesso.", atividade));
        } 
        catch (error) {
            console.error(error);

            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async buscarCompleta(req, res) {
        try {
            const { idAtividade } = req.params;

            const atividade = await atividadesService.buscarAtividadeCompleta(idAtividade);

            return res.status(200).json(respostaApi(true, "Atividade encontrada.", atividade));
        } 
        catch (error) {
            console.error(error);

            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async buscarQuestoes(req, res) {
        try {
            const { idAtividade } = req.params;

            const questoes = await atividadesService.buscarQuestoes(idAtividade);

            return res.status(200).json(respostaApi(true, "Questões encontradas.", questoes));
        } 
        catch (error) {
            console.error(error);

            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async registrarResposta(req, res) {
        try {
            const { idAtividade } = req.params;

            const { idQuestao, acertou } = req.body;

            const resultado = await atividadesService.registrarResposta(idAtividade, idQuestao, acertou);

            return res.status(200).json(respostaApi(true, "Resposta registrada.", resultado));
        } 
        catch (error) {
            console.error(error);

            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async corrigir(req, res) {
        try {
            const { idAtividade } = req.params;

            const resultado = await atividadesService.corrigirAtividade(idAtividade);

            return res.status(200).json(respostaApi(true, "Atividade corrigida.", resultado));
        } 
        catch (error) {
            console.error(error);

            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async refazer(req, res) {
        try {
            const idSave = req.save.id_save;

            const { idMateria } = req.params;

            const atividade = await atividadesService.refazerAtividade(idSave, idMateria);

            return res.status(201).json(respostaApi(true, "Nova tentativa criada.", atividade));
        } 
        catch (error) {
            console.error(error);

            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async calcularMedia(req, res) {
        try {
            const idSave = req.save.id_save;

            const media = await atividadesService.calcularMediaAtividades(idSave);

            return res.status(200).json(respostaApi(true, "Média calculada.", {
                    media,
            }));
        } 
        catch (error) {
            console.error(error);

            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async verificarMateria(req, res) {
        try {
            const idSave = req.save.id_save;

            const { idMateria } = req.params;

            const concluida = await atividadesService.verificarMateriaConcluida(idSave, idMateria);

            return res.status(200).json(respostaApi(true, "Status da matéria retornado.", {
                    concluida
            }));
        } 
        catch (error) {
            console.error(error);

            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async buscarProgresso(req, res) {
        try {
            const idSave = req.save.id_save;

            const { materias } = req.body;

            const progresso = await atividadesService.buscarProgressoMaterias(idSave, materias);

            return res.status(200).json(respostaApi(true, "Progresso retornado.", progresso));
        } 
        catch (error) {
            console.error(error);

            return res.status(400).json(respostaApi(false, error.message));
        }
    }
    async verificarLiberacaoProva(req, res) {
        try {
            const idSave = req.save.id_save;

            const { materias } = req.body;

            const liberacao = await atividadesService.verificarLiberacaoProva(idSave, materias);

            return res.status(200).json(respostaApi(true, "Liberação verificada.", liberacao));
        } 
        catch (error) {
            console.error(error);
            
            return res.status(400).json(respostaApi(false, error.message));
        }
    }
}

module.exports = new AtividadesController();
