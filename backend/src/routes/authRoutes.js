const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", authController.login);
router.post("/cadastro", authController.cadastrar);
router.post("/refresh", authController.renovarToken);
router.post("/logout", authController.logout);
router.post("/esqueci-senha", authController.esqueciSenha);
router.post("/trocar-senha", authController.trocarSenha);
router.get("/me", authMiddleware, authController.me);
router.get("/verificar", authMiddleware, authController.verificarSessao);

module.exports = router;