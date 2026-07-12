const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const PORT = 3000; 

export function startServer() {
    app.listen(PORT, () => {
        console.log(`🛒 TechLoja Backend rodando em http://localhost:${PORT}`);
        const dbConfig = {
            host: '127.0.0.1',
            user: 'root',
            password: '', // ALTERE AQUI
            database: 'techloja',
            waitForConnections: true,
            connectionLimit: 10
        };
    });
    return dbConfig;
}

