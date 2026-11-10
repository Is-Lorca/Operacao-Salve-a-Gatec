const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuariosController");

router.get("/", usuarioController.buscarTodos);
router.get("/:id", usuarioController.buscarPorId);
router.put("/:id", usuarioController.atualizar);
router.delete("/:id", usuarioController.deletar);

module.exports = router;