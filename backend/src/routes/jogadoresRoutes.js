const express = require("express");
const router = express.Router();

const jogadorController = require("../controllers/jogadoresController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/save/:idSave", jogadorController.buscarPorSave);
router.get("/:idJogador", jogadorController.buscarPorId);
router.post("/save/:idSave", jogadorController.criar);
router.patch("/:idJogador", jogadorController.atualizar);
router.delete("/:idJogador", jogadorController.excluir);

module.exports = router;