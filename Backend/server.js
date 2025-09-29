// Importa o express e o cors
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config()

// Cria o servidor
const app = express(); 

//Pega os dados do .env
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const APP_PORT = process.env.PORT || 3000;

console.log(`Tentando conectar ao banco de dados em: ${DB_HOST} com o usuário: ${DB_USER}`)

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10
});

app.get('/', async (req, res) => {
    //O try faz uma promessa que se conseguir acessar o db ele ira apresentar os dados do arquivo csv 
    try {
        const [rows] = await pool.query('SELECT * FROM data');
        
        res.status(200).json({ 
            message: 'Conexão com Node.js e DB OK!',
            total_records: rows.length,
            data: rows,
            db_host: DB_HOST 
        });
    //Caso o try de errado, vai cair no catch que vai mostrar uma mensagem apontando os possiveis erros
    } catch (erro) {
        console.error('ERRO ao acessar o DB:', erro.message);
        res.status(500).json({ 
            error: 'Erro de conexão com o banco de dados. Verifique credenciais e se o MySQL está rodando.',
            details: erro.code 
        });
    }
});

app.listen(APP_PORT, '0.0.0.0',  () => {
    console.log(`http://localhost:${APP_PORT}`)
})
