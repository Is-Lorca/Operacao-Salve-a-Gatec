const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuariosController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.get("/me", usuarioController.buscarPorId);
router.put("/", usuarioController.atualizar);
router.delete("/", usuarioController.deletar);

module.exports = router;