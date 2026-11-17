const express = require("express");
const router = express.Router();

const provasController = require("../controllers/provasController");
const authMiddleware = require("../middlewares/authMiddleware");

// Todas as rotas de prova precisam de usuário autenticado
router.use(authMiddleware);

// Gera ou continua uma prova existente
router.post("/:idSave", provasController.gerarProva);
// Busca prova pelo save
router.get("/save/:idSave", provasController.buscarProva);
// Busca questões da prova
router.get("/:idProva/questoes", provasController.buscarQuestoes);
// Registra resposta de uma questão
router.put("/:idProva/questao/:idQuestao", provasController.responderQuestao);
// Corrige e finaliza prova
router.put("/:idProva/finalizar", provasController.finalizarProva);

module.exports = router;