const express = require("express");
const router = express.Router();

const inventarioController = require('../controllers/inventariosController');
const authMiddleware = require("../middlewares/authMiddleware");
const saveMiddleware = require('../middlewares/saveMiddleware');

router.use(authMiddleware);
router.use(saveMiddleware);

// mostra todos os itens presentes no inventario do jogador
router.get("/", inventarioController.buscarPorJogador);
// procura um id especifico de inventario, com um item especifico dentro
router.get("/:idInventario", inventarioController.buscarPorId);
router.post("/item/:idItem", inventarioController.adicionarItem);
router.post("/item/:idItem/usar", inventarioController.usarItem);
router.delete("/:idInventario", inventarioController.removerItem);

module.exports = router;