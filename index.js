/*  Aqui eu definido uma função assíncrona(async) que usa a API fetch para obter os dados da API do meu backend. Quando a resposta é recebida da API
, a função aguarda a conversão dos dados para o formato JSON usando o método json() 
da resposta e,  por fim, a função retorna os dados obtidos da API no formato JSON.*/

const API_URL = 'http://127.0.0.1:8000/tarefas'

async function obterTarefas() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}

//A função criar tarefa coleta os valores do formulario html atravez do getElementById e salva os dados na cont NOVA TAREFA

async function criarTarefa() {
    const descricao = document.getElementById('descricao').value;
    const responsavel = document.getElementById('responsavel').value;
    const nivel = document.getElementById('nivel').value;
    const situacao = document.getElementById('situacao').value;
    const prioridade = document.getElementById('prioridade').value;

    //aqui eu salvo os valores de cada tarefa
    const novaTarefa = {
        descricao: descricao,
        responsavel: responsavel,
        nivel: parseInt(nivel),
        situacao: situacao,
        prioridade: parseInt(prioridade)
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaTarefa)
    });
    // COMPARAÇÃO: se a tarefa for criada eu deixo os campos descricao e responsavel em branco
    //em seguida eu mostro uma mensagem caso funcione e outra pra quando der erro
    if (response.status === 201) {
        document.getElementById('descricao').value = '';
        document.getElementById('responsavel').value = '';
        mostrarTarefas()
        console.log("Tarefa criada com sucesso")
    }else{
        console.log("!!ERRO!!")
    }
}

async function mostrarTarefas() {
    const tarefas = await obterTarefas();
  
    const tabela = document.getElementById('tabela-tarefas');
    tabela.innerHTML = '';
    //Juntando o cabeçalho com o conteudo
    const cabecalho = `
      <thead>
        <tr>
          <th>Id</th>
          <th>Descrição</th>
          <th>Responsável</th>
          <th>Nível</th>
          <th>Situação</th>
          <th>Prioridade</th>
        </tr>
      </thead>
    `;
    tabela.innerHTML += cabecalho;

    for (let tarefa_atual of tarefas) {
        const row = tabela.insertRow();
        row.insertCell().innerText = tarefa_atual.id;
        row.insertCell().innerText = tarefa_atual.descricao;
        row.insertCell().innerText = tarefa_atual.responsavel;
        row.insertCell().innerText = tarefa_atual.nivel;
        row.insertCell().innerText = tarefa_atual.situacao;
        row.insertCell().innerText = tarefa_atual.prioridade;


        // Criando um botão de apagar para cada tarefa
        const botaoDeletar = document.createElement('button');
        botaoDeletar.innerText = 'Excluir';
        botaoDeletar.classList.add('botao-js');//adicionando essa classe para estilizar o botao das linhas
        botaoDeletar.addEventListener('click', () => {
            apagarTarefa(tarefa_atual.id);
        });
        row.insertCell().appendChild(botaoDeletar);


        const botaoAtualizar = document.createElement('button');
        botaoAtualizar.innerText = 'Atualizar';
        botaoAtualizar.classList.add('botao-js');//adicionando essa classe para estilizar o botao das linhas
        botaoAtualizar.addEventListener('click',()=>{
            AtualizarSituacao(tarefa_atual.id)
        })
        row.insertCell().appendChild(botaoAtualizar);
    }
}

function exibirTarefas(tarefas) {
    const tabela = document.getElementById("tabela-tarefas");
  
    // Limpar conteúdo da tabela
    tabela.innerHTML = "";
  
    // Adicionar cabeçalho da tabela
    const cabecalho = `
      <thead>
        <tr>
          <th>Id</th>
          <th>Descrição</th>
          <th>Responsável</th>
          <th>Nível</th>
          <th>Situação</th>
          <th>Prioridade</th>
        </tr>
      </thead>
    `;
    tabela.innerHTML += cabecalho;
  
    // Adiciona linhas da tabela com os dados das tarefas
    const linhas = tarefas.map((tarefa) => `
      <tr>
        <td>${tarefa.id}</td>
        <td>${tarefa.descricao}</td>
        <td>${tarefa.responsavel}</td>
        <td>${tarefa.nivel}</td>
        <td>${tarefa.situacao}</td>
        <td>${tarefa.prioridade}</td>
      </tr>
    `);
    tabela.innerHTML += linhas.join("");
}


async function listarPorSituacao() {
    const tarefas = await obterTarefas();
    const situacao = document.getElementById("filtro-situacao").value;
    const tarefasFiltradas = tarefas.filter((tarefa) => tarefa.situacao === situacao);
    exibirTarefas(tarefasFiltradas);
}


//Apagando a tarefa por id quando for apertado o botao EXCLUIR
async function apagarTarefa(id) {
    const response = await fetch(`${API_URL}${id} `,{
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.status === 200){
        console.log("Tarefa apagada com sucesso")
    }else{
        console.log("Erro ao apagar")
    }
    mostrarTarefas();
}

async function AtualizarSituacao(id) {
    const novaSituacao = prompt("NOVA SITUAÇÃO: ");
  
    const novaTarefa = {
      situacao: novaSituacao,
    };
  
    const response = await fetch(`${API_URL}${id}/${novaTarefa.situacao}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novaTarefa),
    });
    
    if (response.status === 200) {
      console.log("Situação atualizada com sucesso");
      mostrarTarefas();
    } else {
      console.log("Erro ao atualizar situação");
    }
  }
  


mostrarTarefas()

    
