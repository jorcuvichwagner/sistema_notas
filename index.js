const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos (HTML, CSS, JS) da pasta "public"
app.use(express.static('public'));

// Configura o body-parser para ler JSON
app.use(bodyParser.json());

// Conectando ao banco de dados SQLite
const db = new sqlite3.Database('escola.db');

// Criar as tabelas se não existirem
db.serialize(() => {
    // Criar a tabela alunos
    db.run(`
        CREATE TABLE IF NOT EXISTS alunos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cgm TEXT UNIQUE NOT NULL,
            nome VARCHAR(100) NOT NULL,
            data_nascimento TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela alunos:', err);
        } else {
            console.log('Tabela alunos criada com sucesso (ou já existe).');
        }
    });

    // Criar a tabela notas
    db.run(`
        CREATE TABLE IF NOT EXISTS notas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cgm_aluno TEXT,
            disciplina VARCHAR(20) NOT NULL,
            nota NUMERIC(3, 1) NOT NULL,
            FOREIGN KEY(cgm_aluno) REFERENCES alunos(cgm)
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela notas:', err);
        } else {
            console.log('Tabela notas criada com sucesso (ou já existe).');
        }
    });
});

// Rota para cadastrar um aluno
app.post('/cadastrar-aluno', (req, res) => {
    const { cgm, nome, d_n } = req.body;  // 'd_n' é a data de nascimento
    db.run("INSERT INTO alunos (cgm, nome, data_nascimento) VALUES (?, ?, ?)", [cgm, nome, d_n], function(err) {
        if (err) {
            console.error('Erro ao cadastrar aluno:', err);
            res.status(500).send('Erro ao cadastrar aluno');
        } else {
            res.send('Aluno cadastrado com sucesso!');
        }
    });
});

// Rota para cadastrar uma nota
app.post('/cadastrar-nota', (req, res) => {
    const { cgmAluno, materia, nota } = req.body;
    db.run("INSERT INTO notas (cgm_aluno, disciplina, nota) VALUES (?, ?, ?)", [cgmAluno, materia, nota], function(err) {
        if (err) {
            console.error('Erro ao cadastrar nota:', err);
            res.status(500).send('Erro ao cadastrar nota');
        } else {
            res.send('Nota cadastrada com sucesso!');
        }
    });
});

// Rota para buscar alunos (autocomplete no front-end)
app.get('/buscar-aluno', (req, res) => {
    const query = req.query.query;

    // Busca no banco de dados com base no CGM ou Nome
    db.all("SELECT cgm, nome FROM alunos WHERE cgm LIKE ? OR nome LIKE ?", [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar alunos:', err);
            res.status(500).send('Erro ao buscar alunos');
        } else {
            res.json(rows);  // Retorna os alunos encontrados
        }
    });
});

app.get('/consultar-alunos', (req, res) => {
    const { nome, cgm, materia, notaMin, notaMax } = req.query;

    let sql = "SELECT alunos.cgm, alunos.nome, notas.disciplina AS materia, notas.nota FROM alunos LEFT JOIN notas ON alunos.cgm = notas.cgm_aluno WHERE 1=1"; // 1=1 para facilitar a construção da query
    let params = [];

    if (nome) {
        sql += " AND alunos.nome LIKE ?";
        params.push(`%${nome}%`); // Adiciona o parâmetro da busca
    }

    if (cgm) {
        sql += " AND alunos.cgm LIKE ?";
        params.push(`%${cgm}%`); // Adiciona o parâmetro da busca
    }

    if (materia) {
        sql += " AND notas.disciplina LIKE ?";
        params.push(`%${materia}%`); // Adiciona o parâmetro da busca
    }

    if (notaMin) {
        sql += " AND notas.nota >= ?";
        params.push(notaMin); // Adiciona o parâmetro da busca
    }

    if (notaMax) {
        sql += " AND notas.nota <= ?";
        params.push(notaMax); // Adiciona o parâmetro da busca
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Erro ao consultar alunos:', err);
            return res.status(500).send('Erro ao consultar alunos.');
        }
        res.json(rows); // Retorna os alunos encontrados
    });
});


// Teste para ver se o servidor está rodando
app.get('/', (req, res) => {
    res.send('Servidor no Replit está rodando e tabelas criadas!');
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

