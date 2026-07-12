// =============================================
// LojaTech Backend - Node.js + Express + MySQL
// Conexão via JavaScript (fetch) - mesmo padrão da BiblioTrack
// =============================================

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "techloja",
    waitForConnections: true,
    connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

const path = require("path");

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, "../public")));

// Rota principal - serve o index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// GET /api/produtos - Listar produtos (com busca e filtro)
app.get("/api/produtos", async (req, res) => {
    try {
        const { search, categoria } = req.query;
        let sql = "SELECT * FROM produtos";
        let params = [];
        let conditions = [];

        if (search) {
            conditions.push("(nome LIKE ? OR descricao LIKE ?)");
            params.push(`%${search}%`, `%${search}%`);
        }

        if (categoria) {
            conditions.push("categoria = ?");
            params.push(categoria);
        }

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        sql += " ORDER BY data_cadastro DESC";

        const [rows] = await pool.execute(sql, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/produtos - Criar produto
app.post("/api/produtos", async (req, res) => {
    try {
        const { nome, descricao, preco, estoque, categoria, imagem_url } =
            req.body;

        if (!nome || !preco) {
            return res
                .status(400)
                .json({ error: "Nome e preço são obrigatórios" });
        }

        const sql = `INSERT INTO produtos (nome, descricao, preco, estoque, categoria, imagem_url) 
                    VALUES (?, ?, ?, ?, ?, ?)`;

        const [result] = await pool.execute(sql, [
            nome,
            descricao || null,
            preco,
            estoque || 0,
            categoria || null,
            imagem_url || null,
        ]);

        res.status(201).json({
            message: "Produto criado com sucesso!",
            id: result.insertId,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/produtos/:id - Atualizar produto
app.put("/api/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, preco, estoque, categoria, imagem_url } =
            req.body;

        const sql = `UPDATE produtos SET nome=?, descricao=?, preco=?, estoque=?, categoria=?, imagem_url=? WHERE id=?`;

        const [result] = await pool.execute(sql, [
            nome,
            descricao,
            preco,
            estoque,
            categoria,
            imagem_url,
            id,
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        res.json({ message: "Produto atualizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/produtos/:id
app.delete("/api/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.execute(
            "DELETE FROM produtos WHERE id = ?",
            [id],
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        res.json({ message: "Produto excluído com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🛒 TechLoja Backend rodando em http://localhost:${PORT}`);
    console.log(`📦 API de produtos: http://localhost:${PORT}/api/produtos`);
});
