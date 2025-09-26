// Importa o express e o cors
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// Cria o servidor
const app = express(); 
const port = 3000;

let nextId = 1;

app.get("/", (req, res) => {
    res.send("Servidor da Malwee rodando!");
});

