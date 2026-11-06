const express = require('express');
const router = express.Router();

const savesController = require('../controllers/savesController');

router.get('/', savesController.carregarTodos);
router.post('/', savesController.criarNovoJogo);
router.get('/:id', savesController.carregarSave);
// método usado para atualizar ou substituir um recurso existente
router.put('/:id', savesController.atualizarSave);
// método para deletar algo específico do servidor
router.delete('/:id', savesController.deletarSave);

module.exports = router;