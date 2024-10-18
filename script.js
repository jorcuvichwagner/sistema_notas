async function cadastrarAluno() {
    const cgm = document.getElementById('cgm').value;
    const nome = document.getElementById('nome').value;
    const d_n = document.getElementById('data_nascimento').value;

    await fetch('/cadastrar-aluno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cgm, nome, d_n })
    });

    alert('Aluno cadastrado com sucesso!');
}



async function consultarAlunos() {
    const nome = document.getElementById('nome').value;
    const cgm = document.getElementById('cgm').value;
    const materia = document.getElementById('materia').value;
    const notaMin = document.getElementById('notaMin').value;
    const notaMax = document.getElementById('notaMax').value;
    
    const response = await fetch('/consultar-alunos', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cgm, materia, notaMin, notaMax })
    });
    const alunos = await response.json();
    const tabelaResultados = document.getElementById('resultadoConsulta');
    const tbody = tabelaResultados.querySelector('tbody');
    tbody.innerHTML = ''; // limpa a tabela antes de adicionar resultados
    if (alunos.length > 0) {
        tabelaResultados.style.display = 'table';
        alunos.forEach(aluno => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${aluno.cgm}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.materia || '-'}</td>
                <td>${aluno.nota || '-'}</td>
            `;
            tbody.appendChild(row);
        });
    } else {
        tabelaResultados.style.display = 'none';
        alert('Nenhum aluno encontrado com os critérios informados.');
    }
}
async function buscarAluno() {
    const buscaAluno = document.getElementById('buscaAluno').value;
    // Se o campo de busca estiver vazio, não faz nada
    if (buscaAluno === '') return;
    // faz a busca no servidor
    const response = await fetch(`/buscar-aluno?query=${buscaAluno}`);
    const alunos = await response.json();
    
    // seleciona o dropdown de alunos
    const alunoSelecionado = document.getElementById('alunoSelecionado');
    alunoSelecionado.innerHTML = '<option value="">Selecione um aluno</option>';
    // preenche o dropdown com os resultados da busca
    alunos.forEach(aluno => {
        const option = document.createElement('option');
        option.value = aluno.cgm;
        option.textContent = `${aluno.nome} (CGM: ${aluno.cgm})`;
        alunoSelecionado.appendChild(option);
    });
}
async function cadastrarNota() {
    const cgmAluno = document.getElementById('alunoSelecionado').value;
    const materia = document.getElementById('materia').value;
    const nota = document.getElementById('nota').value;
    if (!cgmAluno) {
        alert('Por favor, selecione um aluno.');
        return;
    }
    await fetch('/cadastrar-nota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cgmAluno, materia, nota })
    });
    alert('Nota cadastrada com sucesso!');
}
