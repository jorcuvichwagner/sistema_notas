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

    const queryParams = new URLSearchParams();
    if (nome) queryParams.append('nome', nome);
    if (cgm) queryParams.append('cgm', cgm);
    if (materia) queryParams.append('materia', materia);
    if (notaMin) queryParams.append('notaMin', notaMin);
    if (notaMax) queryParams.append('notaMax', notaMax);

    // Faz a requisição para a rota de consulta
    const response = await fetch(`/consultar-alunos?${queryParams.toString()}`);

    // Verifica se a resposta foi bem sucedida
    if (!response.ok) {
        console.error('Erro ao consultar alunos:', response.statusText);
        return;
    }

    const alunos = await response.json();
    console.log('Alunos retornados:', alunos); // Adiciona log para verificar dados retornados
    const tabelaResultados = document.getElementById('resultadoConsulta');
    const tbody = tabelaResultados.querySelector('tbody');
    tbody.innerHTML = ''; // Limpa a tabela antes de adicionar resultados

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
      alert("ok");
    } else {
        tabelaResultados.style.display = 'none';
        alert('Nenhum aluno encontrado com os critérios informados.');
    }
}

async function buscarAluno() {
  const buscaAluno = document.getElementById('buscaAluno').value;

  // Se o campo de busca estiver vazio, não faz nada
  if (buscaAluno === '') return;

  // Faz a busca no servidor
  const response = await fetch(`/buscar-aluno?query=${buscaAluno}`);

  // Verifica se a resposta foi bem-sucedida
  if (response.ok) {
      const alunos = await response.json();

      // Seleciona o dropdown de alunos
      const alunoSelecionado = document.getElementById('alunoSelecionado');
      alunoSelecionado.innerHTML = '<option value="">Selecione um aluno</option>';

      // Preenche o dropdown com os resultados da busca
      alunos.forEach(aluno => {
          const option = document.createElement('option');
          option.value = aluno.cgm;
          option.textContent = `${aluno.nome} (CGM: ${aluno.cgm})`;
          alunoSelecionado.appendChild(option);
      });

  } else {
      alert('Erro ao buscar alunos. Tente novamente.');
  }
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
