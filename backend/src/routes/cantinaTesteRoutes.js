
const express = require("express");
const router = express.Router();

const supabase = require("../config/supabase");

// Rota temporária: consulta somente o catálogo de itens.
// Não exige login e não modifica nenhum dado do banco.
router.get("/itens", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("item")
            .select(`
                id_item,
                nome,
                descricao,
                preco,
                imagem,
                peso
            `);

        if (error) {
            console.error("Erro ao buscar itens:", error.message);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Não foi possível carregar os itens.",
                data: null
            });
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: "Itens carregados com sucesso.",
            data
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            sucesso: false,
            mensagem: error.message,
            data: null
        });
    }
});

module.exports = router;
