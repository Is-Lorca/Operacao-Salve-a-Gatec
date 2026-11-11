const authService = require("../services/authService");

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ error: "Erro no formato do token" });
        }

        const token = parts[1];
        const usuario = await authService.verificarSessao(token);
        
        req.usuarioLogado = {
            id_usuario: usuario.id_usuario,
            email: usuario.email,
            nome: usuario.nome
        };
        
        return next();
    } 
    catch (error) {
        return res.status(401).json({ error: error.message });
    }
};