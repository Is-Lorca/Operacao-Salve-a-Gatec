const express = require("express");
const router = express.Router();

const jogadorController = require("../controllers/jogadoresController");
const authMiddleware = require("../middlewares/authMiddleware");
const saveMiddleware = require('../middlewares/saveMiddleware');

router.use(authMiddleware);
router.use(saveMiddleware);

router.get("/", jogadorController.buscarPorSave);
router.get("/me", jogadorController.buscarPorId);
router.post("/", jogadorController.criar);
router.patch("/", jogadorController.atualizar);
router.delete("/", jogadorController.excluir);

module.exports = router;