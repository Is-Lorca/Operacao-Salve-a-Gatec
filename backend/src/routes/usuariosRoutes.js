const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuariosController");

router.post("/", usuarioController.criar);
router.get("/", usuarioController.buscarTodos);
router.get("/:id", usuarioController.buscarPorId);
router.get("/email/:email", usuarioController.buscarPorEmail);
router.put("/:id", usuarioController.atualizar);
router.delete("/:id", usuarioController.deletar);
router.patch("/:id/login", usuarioController.atualizarLogin);

module.exports = router;