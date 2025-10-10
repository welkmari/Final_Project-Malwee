// Bibliotecas
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const saltRounds = 10;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


/**
 * Função auxiliar para criar a cláusula WHERE e os parâmetros
 * @param {object} queryParams - Os parâmetros da URL (req.query)
 * @returns {object} - Um objeto com a string whereClause e o array de params
 */
const criarFiltroWhere = (queryParams) => {
    const { ano, mes } = queryParams;

    if (ano && mes) {
        const whereClause = `
            WHERE YEAR(\`Data (AAAA-MM-DD HH:MM:SS)\`) = ?
            AND MONTH(\`Data (AAAA-MM-DD HH:MM:SS)\`) = ?
        `;
        const params = [ano, mes];
        return { whereClause, params };
    }

    return { whereClause: '', params: [] };
};


//Gráfico 'Eficiência da máquina (%)'
app.get('/api/chart-data', async (req, res) => {
    try {
        const { whereClause, params } = criarFiltroWhere(req.query);
        const sqlQuery = `
            SELECT
                Maquina,
                AVG(\`Metros Produzidos\`) AS media_metros
            FROM data
            ${whereClause}
            GROUP BY Maquina
            ORDER BY Maquina;
        `;
        const [results] = await pool.query(sqlQuery, params);
        const labels = results.map(row => `Máquina ${row.Maquina}`);
        const data = results.map(row => parseFloat(row.media_metros).toFixed(2));
        res.json({ labels, data });
    } catch (erro) {
        console.error('ERRO ao buscar dados para o gráfico (Eficiência):', erro.message);
        res.status(500).json({ error: 'Erro ao buscar dados do gráfico.' });
    }
});

//Gráfico 'Atingimento de Meta'
app.get('/api/chart-meta', async (req, res) => {
    try {
        const { whereClause, params } = criarFiltroWhere(req.query);
        const query = `
            SELECT
                \`Tarefa completa?\` as valor_original,
                COUNT(*) as total
            FROM data
            ${whereClause}
            GROUP BY \`Tarefa completa?\`
            ORDER BY \`Tarefa completa?\`;
        `;
        const [results] = await pool.query(query, params);
        const labelMap = { '0': 'Incompleta', '1': 'Completa', 'TRUE': 'Completa', 'FALSE': 'Incompleta' };
        const labels = results.map(item => labelMap[item.valor_original?.toString()] || 'Indefinida');
        const data = results.map(item => item.total);
        res.json({ labels, data });
    } catch (erro) {
        console.error('ERRO ao buscar dados para o gráfico de metas:', erro.message);
        res.status(500).json({ error: 'Erro ao buscar dados do gráfico de metas.' });
    }
});

//Gráfico 'Produção por Tecido'
app.get('/api/chart-producao-tecido', async (req, res) => {
    try {
        const { whereClause, params } = criarFiltroWhere(req.query);
        const query = `
            SELECT \`Tipo Tecido\`, SUM(\`Metros Produzidos\`) as total_produzido
            FROM data
            ${whereClause}
            GROUP BY \`Tipo Tecido\`;
        `;
        const [results] = await pool.query(query, params);
        const labels = results.map(item => `Tecido Tipo ${item['Tipo Tecido']}`);
        const data = results.map(item => item.total_produzido);
        res.json({ labels, data });
    } catch (erro) {
        console.error('ERRO ao buscar dados de produção por tecido:', erro.message);
        res.status(500).json({ error: 'Erro ao buscar dados de produção por tecido.' });
    }
});

//Gráfico 'Produção ao Longo do Tempo'
app.get('/api/chart-producao-tempo', async (req, res) => {
    try {
        const { whereClause, params } = criarFiltroWhere(req.query);
        const query = `
            SELECT
                DATE_FORMAT(\`Data (AAAA-MM-DD HH:MM:SS)\`, '%Y-%m-%d %H:00:00') as hora,
                SUM(\`Tempo de Produção\`) as total_por_hora
            FROM data
            ${whereClause}
            GROUP BY hora
            ORDER BY hora;
        `;
        const [results] = await pool.query(query, params);
        const labels = results.map(item => new Date(item.hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        const data = results.map(item => item.total_por_hora);
        res.json({ labels, data });
    } catch (erro) {
        console.error('ERRO ao buscar dados de produção ao longo do tempo:', erro.message);
        res.status(500).json({ error: 'Erro ao buscar dados de produção ao longo do tempo.' });
    }
});

//Gráfico 'Produção por Localidade (Máquina)'
app.get('/api/chart-localidades', async (req, res) => {
    try {
        const { whereClause, params } = criarFiltroWhere(req.query);
        const query = `
            SELECT Maquina, SUM(\`Metros Produzidos\`) as total_produzido
            FROM data
            ${whereClause}
            GROUP BY Maquina
            ORDER BY Maquina;
        `;
        const [results] = await pool.query(query, params);
        const labels = results.map(item => `Localidade ${item.Maquina}`);
        const data = results.map(item => item.total_produzido);
        res.json({ labels, data });
    } catch (erro) {
        console.error('ERRO ao buscar dados de produção por localidade:', erro.message);
        res.status(500).json({ error: 'Erro ao buscar dados de produção por localidade.' });
    }
});

// Gráfico 'Sobras de Rolo'
app.get('/api/chart-sobras', async (req, res) => {
    try {
        const { whereClause, params } = criarFiltroWhere(req.query);
        const query = `
            SELECT \`Sobra de Rolo?\` as valor_original, COUNT(*) as total
            FROM data
            ${whereClause}
            GROUP BY \`Sobra de Rolo?\`;
        `;
        const [results] = await pool.query(query, params);
        const labelMap = { 'TRUE': 'Com Sobra', 'FALSE': 'Sem Sobra', '1': 'Com Sobra', '0': 'Sem Sobra' };
        const labels = results.map(item => labelMap[item.valor_original?.toString()] || 'Indefinido');
        const data = results.map(item => item.total);
        res.json({ labels, data });
    } catch (erro) {
        console.error('ERRO ao buscar dados de sobras de rolo:', erro.message);
        res.status(500).json({ error: 'Erro ao buscar dados de sobras de rolo.' });
    }
});

// Gráfico 'Tempo Médio de Setup por Máquina'
app.get('/api/chart-setup', async (req, res) => {
    try {
        const { whereClause, params } = criarFiltroWhere(req.query);
        const sqlQuery = `
            SELECT Maquina, AVG(\`Tempo de Setup\`) AS media_setup
            FROM data
            ${whereClause}
            GROUP BY Maquina
            ORDER BY Maquina;
        `;
        const [results] = await pool.query(sqlQuery, params);
        const labels = results.map(row => `Máquina ${row.Maquina}`);
        const data = results.map(row => parseFloat(row.media_setup).toFixed(2));
        res.json({ labels, data });
    } catch (erro) {
        console.error('ERRO ao buscar dados de setup:', erro.message);
        res.status(500).json({ error: 'Erro ao buscar dados de setup.' });
    }
});

// Gráfico 'Distribuição da Quantidade de Tiras'
app.get('/api/chart-tiras', async (req, res) => {
    try {
        const { whereClause, params } = criarFiltroWhere(req.query);
        const query = `
            SELECT \`Quantidade de Tiras\`, COUNT(*) as total_ocorrencias
            FROM data
            ${whereClause}
            GROUP BY \`Quantidade de Tiras\`
            ORDER BY \`Quantidade de Tiras\`;
        `;
        const [results] = await pool.query(query, params);
        const labels = results.map(item => `${item['Quantidade de Tiras']} Tira(s)`);
        const data = results.map(item => item.total_ocorrencias);
        res.json({ labels, data });
    } catch (erro) {
        console.error('ERRO ao buscar dados de quantidade de tiras:', erro.message);
        res.status(500).json({ error: 'Erro ao buscar dados de quantidade de tiras.' });
    }
});

// FIM DO CÓDIGO ADICIONADO

app.post('/registro', (req, res) =>{
    const {nome, email, senha} = req.body;

    if(!nome || !email || !senha){
        return res.status(400).json({erro: 'Todos os ampos são obrigatórios'})
    }

    bcrypt.hash(senha, saltRounds)
    .then(senhaHash => {
        return pool.execute(
            'INSERT INTO usuario (nome, email, senha) VALUES (?,?,?)',
            [nome, email, senhaHash]
        );
    }).then(([result]) => {
        res.status(201).json({mensagem: 'Usuário registrado com sucesso!', id: result.insertId})
    }).catch(error => {
        if(error.errno === 1062){
            return res.status(409).json({erro: 'Este e-mail já está em uso.'})
        }
        console.error('ERRO ao registrar usuário: ', error);
        res.status(500).json({erro: 'Erro interno no servidor.'})
    });
});

app.post('/login', (req, res) => {
    const {email, senha} = req.body;

    if(!email || !senha){
        return res.status(400).json({erro: 'E-mail e senha são obrigatórios'})
    }

    let usuarioEncontrado;
    const JWT_SECRET = process.env.JWT_SECRET;

    pool.query('SELECT id, nome, senha FROM usuario where email = ?', [email])
    
    .then(([rows]) => {
        usuarioEncontrado = rows[0];

        if(!usuarioEncontrado){
            return Promise.reject({status: 401, message: 'E-mail ou senha inválidos.'});
        }
        
        return bcrypt.compare(senha, usuarioEncontrado.senha);
    })
    .then(match => {
        if(!match){
            return Promise.reject({status: 401, message: 'E-mail ou senha inválidos.'});
        }

        const token = jwt.sign(
            {id: usuarioEncontrado.id, nome: usuarioEncontrado.nome},
            JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            token: token,
            usuario: {id: usuarioEncontrado.id, nome: usuarioEncontrado.nome}
        });
    })
    .catch(error => {
        const status = error.status || 500;
        const message = error.message || 'Erro interno no servidor durante o login.';

        if(status === 500){
            console.error('ERRO interno no login: ', error);
        }

        res.status(status).json({erro: message})
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});