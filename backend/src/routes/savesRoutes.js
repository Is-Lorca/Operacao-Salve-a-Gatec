const express = require('express');
const router = express.Router();

const savesController = require('../controllers/savesController');

router.get('/:idUser', savesController.carregarTodos);
router.post('/', savesController.criarNovoJogo);
router.get('/:idUser/:idSave', savesController.carregarSave);
// método usado para atualizar ou substituir um recurso existente
router.put('/:idUser/:idSave', savesController.atualizarSave);
// método para deletar algo específico do servidor
router.delete('/:idUser/:idSave', savesController.deletarSave);

module.exports = router;