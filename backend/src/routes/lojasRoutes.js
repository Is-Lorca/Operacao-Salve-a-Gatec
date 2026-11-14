const express = require("express");
const router = express.Router();

const lojaController = require('../controllers/lojasController');
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/save/:idSave", lojaController.criar);
router.get("/save/:idSave", lojaController.buscarPorSave);
// esse envia sempre depois, quando a loja esta aberta
router.patch("/:idLoja/abrir", lojaController.abrirLoja);
// essa envia sempre que o jogador ja comprou o que queria e fechou a loja
router.patch("/:idLoja/fechar", lojaController.fecharLoja);
// esse que envia sempre que termina atividade, para verificar se a loja esta fechada ou não
router.patch("/:idLoja/verificar", lojaController.verificarGeracao);
router.get("/itens/:idLoja", lojaController.buscarItensLoja);
router.post("/:idLoja/comprar/:idItem", lojaController.comprarItem);

module.exports = router;