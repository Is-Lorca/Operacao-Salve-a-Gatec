const express = require('express');
const router = express.Router();

const atividadesController = require('../controllers/atividadesController');
const authMiddleware = require('../middlewares/authMiddleware');
const saveMiddleware = require('../middlewares/saveMiddleware');

router.use(authMiddleware);
router.use(saveMiddleware);
// Gerar nova atividade
router.post('/:idMateria', atividadesController.gerar);
// Buscar atividade completa
router.get('/:idAtividade', atividadesController.buscarCompleta);
// Buscar questões da atividade
router.get('/:idAtividade/questoes',atividadesController.buscarQuestoes);
// Registrar resposta
router.post('/:idAtividade/resposta', atividadesController.registrarResposta);
// Corrigir atividade
router.post('/:idAtividade/corrigir', atividadesController.corrigir);
// Refazer atividade
router.post('/:idMateria/refazer', atividadesController.refazer);
// Média das atividades
router.get('/media', atividadesController.calcularMedia);
// Verifica se uma matéria foi concluída
router.get('/:idMateria/concluida', atividadesController.verificarMateria);
// Progresso das matérias
router.post('/progresso', atividadesController.buscarProgresso);
// Liberação da prova final
router.post('/liberacao-prova', atividadesController.verificarLiberacaoProva);

module.exports = router;