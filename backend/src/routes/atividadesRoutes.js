const express = require('express');
const router = express.Router();

const atividadesController = require('../controllers/atividadesController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);
// Gerar nova atividade
router.post('/:idSave/:idMateria', atividadesController.gerar);
// Buscar atividade completa
router.get('/:idAtividade', atividadesController.buscarCompleta);
// Buscar questões da atividade
router.get('/:idAtividade/questoes',atividadesController.buscarQuestoes);
// Registrar resposta
router.post('/:idAtividade/resposta', atividadesController.registrarResposta);
// Corrigir atividade
router.post('/:idAtividade/corrigir', atividadesController.corrigir);
// Refazer atividade
router.post('/:idSave/:idMateria/refazer', atividadesController.refazer);
// Média das atividades
router.get('/:idSave/media', atividadesController.calcularMedia);
// Verifica se uma matéria foi concluída
router.get('/:idSave/:idMateria/concluida', atividadesController.verificarMateria);
// Progresso das matérias
router.post('/:idSave/progresso', atividadesController.buscarProgresso);
// Liberação da prova final
router.post('/:idSave/liberacao-prova', atividadesController.verificarLiberacaoProva);

module.exports = router;