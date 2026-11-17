const express = require("express");
const router = express.Router();

const inventarioController = require('../controllers/inventariosController');
const authMiddleware = require("../middlewares/authMiddleware");
const saveMiddleware = require('../middlewares/saveMiddleware');

router.use(authMiddleware);
router.use(saveMiddleware);

router.get("/", inventarioController.buscarPorJogador);
router.get("/:idInventario", inventarioController.buscarPorId);
router.post("/item/:idItem", inventarioController.adicionarItem);
router.post("/item/:idItem/usar", inventarioController.usarItem);
router.delete("/:idInventario", inventarioController.removerItem);

module.exports = router;