"use strict";
class Aluno {
    constructor(id, nome, idade, altura, peso) {
        this.id = id;
        this.nome = nome;
        this.idade = idade;
        this.altura = altura;
        this.peso = peso;
    }
}
class Turma {
    constructor(id, nome) {
        this.alunos = [];
        this.id = id;
        this.nome = nome;
    }
    getNumAlunos() {
        return this.alunos.length;
    }
    calcularMedia(propriedade) {
        const total = this.alunos.reduce((soma, aluno) => soma + aluno[propriedade], 0);
        if (total === 0) {
            return 0;
        }
        return total / this.alunos.length;
    }
    getMediaIdades() {
        return this.calcularMedia('idade');
    }
    getMediaAlturas() {
        return this.calcularMedia('altura');
    }
    getMediaPesos() {
        return this.calcularMedia('peso');
    }
}
const turma = new Turma(1, "Turma de Educação Física");
let idEditarAluno = -1;
function atualizarEstatisticas() {
    const numAlunosElement = document.getElementById("totalAlunos");
    const mediaIdadesElement = document.getElementById("mediaIdade");
    const mediaAlturasElement = document.getElementById("mediaAltura");
    const mediaPesosElement = document.getElementById("mediaPeso");
    if (numAlunosElement)
        numAlunosElement.textContent = turma.getNumAlunos().toString();
    if (mediaIdadesElement)
        mediaIdadesElement.textContent = turma.getMediaIdades().toFixed(2);
    if (mediaAlturasElement)
        mediaAlturasElement.textContent = turma.getMediaAlturas().toFixed(2);
    if (mediaPesosElement)
        mediaPesosElement.textContent = turma.getMediaPesos().toFixed(2);
}
function adicionarAluno(event) {
    const nomeInput = document.getElementById("nomeAluno");
    const idadeInput = document.getElementById("idadeAluno");
    const alturaInput = document.getElementById("alturaAluno");
    const pesoInput = document.getElementById("pesoAluno");
    const nome = nomeInput.value;
    const idade = parseInt(idadeInput.value);
    const altura = parseFloat(alturaInput.value);
    const peso = parseFloat(pesoInput.value);
    if (nome && !isNaN(idade) && !isNaN(altura) && !isNaN(peso)) {
        const aluno = new Aluno(turma.getNumAlunos() + 1, nome, idade, altura, peso);
        turma.alunos.push(aluno);
        const listaAlunos = document.getElementById("listaAlunos");
        const itemLista = document.createElement("li");
        itemLista.id = `li-${aluno.id}`;
        itemLista.innerHTML = `
          ${aluno.nome} - Idade: ${aluno.idade}, Altura: ${aluno.altura}cm, Peso: ${aluno.peso}kg
          <button class="edit-button" onclick="editarAluno(${aluno.id})">Editar</button>
          <button onclick="removerAluno(${aluno.id})">Remover</button>
      `;
        if (listaAlunos)
            listaAlunos.appendChild(itemLista);
        atualizarEstatisticas();
        // Limpar campos de entrada
        nomeInput.value = "";
        idadeInput.value = "";
        alturaInput.value = "";
        pesoInput.value = "";
    }
}
function editarAluno(alunoId) {
    const aluno = turma.alunos.find(aluno => aluno.id === alunoId);
    if (aluno) {
        const nomeInput = document.getElementById("nomeAluno");
        const idadeInput = document.getElementById("idadeAluno");
        const alturaInput = document.getElementById("alturaAluno");
        const pesoInput = document.getElementById("pesoAluno");
        const botaoAdicionar = document.getElementById("addAluno");
        nomeInput.value = aluno.nome;
        idadeInput.value = aluno.idade.toString();
        alturaInput.value = aluno.altura.toString();
        pesoInput.value = aluno.peso.toString();
        // Atualizar o botão "Adicionar Aluno" para funcionar como "Salvar Edição"
        botaoAdicionar.textContent = "Salvar Edição";
        botaoAdicionar.removeEventListener("click", adicionarAluno);
        // Adicionar um novo evento de clique para salvar a edição
        idEditarAluno = aluno.id;
        botaoAdicionar.addEventListener("click", salvarEdicaoAluno);
    }
}
function salvarEdicaoAluno() {
    const alunoId = idEditarAluno;
    const nomeInput = document.getElementById("nomeAluno");
    const idadeInput = document.getElementById("idadeAluno");
    const alturaInput = document.getElementById("alturaAluno");
    const pesoInput = document.getElementById("pesoAluno");
    const nome = nomeInput.value;
    const idade = parseInt(idadeInput.value);
    const altura = parseFloat(alturaInput.value);
    const peso = parseFloat(pesoInput.value);
    const aluno = turma.alunos.find(aluno => aluno.id === alunoId);
    if (aluno && nome && !isNaN(idade) && !isNaN(altura) && !isNaN(peso)) {
        aluno.nome = nome;
        aluno.idade = idade;
        aluno.altura = altura;
        aluno.peso = peso;
        const listaAlunos = document.getElementById("listaAlunos");
        if (listaAlunos) {
            const itemLista = document.getElementById(`li-${alunoId}`);
            if (itemLista) {
                itemLista.innerHTML = `
              ${aluno.nome} - Idade: ${aluno.idade}, Altura: ${aluno.altura}cm, Peso: ${aluno.peso}kg
              <button class="edit-button" onclick="editarAluno(${aluno.id})">Editar</button>
              <button onclick="removerAluno(${aluno.id})">Remover</button>
          `;
            }
        }
        atualizarEstatisticas();
        // Limpar campos de entrada e reverter o botão "Adicionar Aluno" para seu estado original
        nomeInput.value = "";
        idadeInput.value = "";
        alturaInput.value = "";
        pesoInput.value = "";
        const botaoAdicionar = document.getElementById("addAluno");
        botaoAdicionar.textContent = "Adicionar Aluno";
        idEditarAluno = -1;
        botaoAdicionar.removeEventListener("click", salvarEdicaoAluno);
        botaoAdicionar.addEventListener("click", adicionarAluno);
    }
}
function removerAluno(alunoId) {
    turma.alunos = turma.alunos.filter(aluno => aluno.id !== alunoId);
    atualizarEstatisticas();
    const itemLista = document.getElementById(`li-${alunoId}`);
    if (itemLista) {
        itemLista.remove();
    }
}
// Adicionar um evento de clique ao botão "Adicionar Aluno"
const botaoAdicionar = document.getElementById("addAluno");
if (botaoAdicionar) {
    botaoAdicionar.addEventListener("click", adicionarAluno);
}
// Inicializar as estatísticas na página
atualizarEstatisticas();
