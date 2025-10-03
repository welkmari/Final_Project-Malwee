// Bibliotecas
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config()

const app = express();

app.use(cors());
app.use(express.json())

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
    try {
        const [rows] = await pool.query('SELECT * FROM data LIMIT 5'); 

        res.status(200).json({
            message: 'Conexão com Node.js e DB OK!',
            total_records: rows.length,
            data: rows,
            db_host: DB_HOST
        });
    } catch (erro) {
        console.error('ERRO ao acessar o DB:', erro.message);
        res.status(500).json({
            error: 'Erro de conexão com o banco de dados. Verifique credenciais e se o MySQL está rodando.',
            details: erro.code
        });
    }
});

//Gráfico 'Eficiência da máquina (%)'
app.get('/api/chart-data', async (req, res) => {
    try {
        const sqlQuery = `
            SELECT 
                Maquina, 
                AVG(\`Metros Produzidos\`) AS media_metros 
            FROM 
                data
            GROUP BY 
                Maquina
            ORDER BY 
                Maquina;
        `;

        const [results] = await pool.query(sqlQuery);

        const labels = results.map(row => `Máquina ${row.Maquina}`);
        const data = results.map(row => parseFloat(row.media_metros).toFixed(2)); 

        res.json({ labels, data });

    } catch (erro) {
        console.error('ERRO ao buscar dados para o gráfico:', erro.message);
        res.status(500).json({
            error: 'Erro ao buscar dados do gráfico.',
            details: erro.code
        });
    }
});

//Gráfico 'Atingimento de Meta'
app.get('/api/chart-meta', async (req, res) => {
    try {
        const debugQuery = `SELECT DISTINCT \`Tarefa completa?\` FROM data`;
        const [debugResults] = await pool.query(debugQuery);
        console.log('Valores únicos de "Tarefa completa?":', debugResults);

        const query = `
            SELECT 
                \`Tarefa completa?\` as valor_original,
                COUNT(*) as total 
            FROM data 
            GROUP BY \`Tarefa completa?\`
            ORDER BY \`Tarefa completa?\`;
        `;
        const [results] = await pool.query(query);
        
        console.log('Resultados brutos:', results);
        
        const labelMap = {
            '0': 'Incompleta',
            '1': 'Completa',
            'TRUE': 'Completa',
            'FALSE': 'Incompleta'
        };
        
        const labels = [];
        const data = [];
        
        results.forEach(item => {
            const valor = item.valor_original?.toString();
            const label = labelMap[valor] || 'Indefinida';
            labels.push(label);
            data.push(item.total);
        });
        
        console.log('Labels finais:', labels);
        console.log('Data final:', data);
        
        res.json({ labels, data });
        
    } catch (erro) {
        console.error('ERRO ao buscar dados para o gráfico de metas:', erro.message);
        res.status(500).json({ 
            error: 'Erro ao buscar dados do gráfico de metas.'
        });
    }
});

    
//Gráfico 'Gasto de material (real x previsto)'
app.get('/api/chart-producao-tecido', async (req, res) => {
    try {
        const query = `
            SELECT \`Tipo Tecido\`, SUM(\`Metros Produzidos\`) as total_produzido 
            FROM data 
            GROUP BY \`Tipo Tecido\`;
        `;
        const [results] = await pool.query(query);
        const labels = results.map(item => `Tecido Tipo ${item['Tipo Tecido']}`);
        const data = results.map(item => item.total_produzido);
        res.json({ labels, data });
    } catch (erro) {
        console.error('ERRO ao buscar dados de produção por tecido:', erro.message);
        res.status(500).json({ error: 'Erro ao buscar dados de produção por tecido.', details: erro.code });
    }
});


//Gráfico 'Produção ao Longo do Tempo'
app.get('/api/chart-producao-tempo', async (req, res) => {
    try {
        const query = `
            SELECT 
                DATE_FORMAT(\`Data (AAAA-MM-DD HH:MM:SS)\`, '%Y-%m-%d %H:00:00') as hora,
                SUM(\`Tempo de Produção\`) as total_por_hora
            FROM data 
            GROUP BY hora
            ORDER BY hora;
        `;

        const [results] = await pool.query(query);

        const labels = results.map(item =>
            new Date(item.hora).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            })
        );

        const data = results.map(item => item.total_por_hora);

        res.json({ labels, data });

    } catch (erro) {
        console.error('ERRO ao buscar dados de produção ao longo do tempo:', erro.message);
        res.status(500).json({ error: 'Erro ao buscar dados de produção ao longo do tempo.', details: erro.code });
    }
});

//Gráfico 'Produção por Localidade (Máquina)'
app.get('/api/chart-localidades', async (req, res) => {
    try {
        const query = `
            SELECT 
                Maquina, 
                SUM(\`Metros Produzidos\`) as total_produzido
            FROM data
            GROUP BY Maquina
            ORDER BY Maquina;
        `;
        const [results] = await pool.query(query);

        const labels = results.map(item => `Localidade ${item.Maquina}`);
        const data = results.map(item => item.total_produzido);

        res.json({ labels, data });

    } catch (erro) {
        console.error('ERRO ao buscar dados de produção por localidade:', erro.message);
        res.status(500).json({ error: 'Erro ao buscar dados de produção por localidade.', details: erro.code });
    }
});

app.listen(APP_PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${APP_PORT}`)
})