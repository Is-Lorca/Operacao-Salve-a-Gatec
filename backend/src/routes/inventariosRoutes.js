const express = require("express");
const router = express.Router();

const inventarioController = require('../controllers/inventariosController');
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/jogador/:idJogador", inventarioController.buscarPorJogador);
router.get("/:idInventario", inventarioController.buscarPorId);
router.post("/jogador/:idJogador/item/:idItem", inventarioController.adicionarItem);
router.post("/jogador/:idJogador/item/:idItem/usar", inventarioController.usarItem);
router.delete("/:idInventario", inventarioController.removerItem);

module.exports = router;