const express = require('express');
const router = express.Router();

// chamamos o controller para o routes
const materiasController = require('../controllers/materiasController');

router.get('/', materiasController.listarMaterias);

module.exports = router;