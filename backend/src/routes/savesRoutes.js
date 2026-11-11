const express = require('express');
const router = express.Router();

const savesController = require('../controllers/savesController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.get("/", savesController.carregarTodos);
router.post("/", savesController.criarNovoJogo);
router.get("/:idSave", savesController.carregarSave);
// método usado para atualizar ou substituir um recurso existente
router.put("/:idSave", savesController.atualizarSave);
// método para deletar algo específico do servidor
router.delete("/:idSave", savesController.deletarSave);

module.exports = router;