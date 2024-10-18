const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// serve os arquivos estáticos (html, css) da pasta "public"
app.use(express.static('public'));

// configura o body-parser para ler JSON
app.use(bodyParser.json());

// conectando ao banco de dados SQLite
const db = new sqlite3.Database('escola.db');

// criar as tabelas se não existirem
db.serialize(() => {
    // criar a tabela alunos
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

    // criar a tabela notas
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

//app.post('/cadastrar-aluno', (req, res) => {
//    const { cgm, nome, data_nascimento } = req.body;
//    db.run("INSERT INTO alunos (cgm, nome, data_nascimento) VALUES (?, ?, ?)", [cgm, nome, data_nascimento]);
//    res.send('Aluno cadastrado com sucesso!');
//});

//app.post('/cadastrar-nota', (req, res) => {
//   const { cgm_aluno, disciplina, nota } = req.body;
//    db.run("INSERT INTO notas (cgm_aluno, disciplina, nota) VALUES (?, ?, ?)", [cgm_aluno, disciplina, nota]);
//    res.send('Nota cadastrada com sucesso!');
//});

// teste para ver se o servidor está rodando
app.get('/', (req, res) => {
    res.send('Servidor no Replit está rodando e tabelas criadas!');
});

// iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

