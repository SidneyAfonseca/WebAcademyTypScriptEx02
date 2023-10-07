class Aluno {
  id: number;
  nome: string;
  idade: number;
  altura: number;
  peso: number;

  constructor(id: number, nome: string, idade: number, altura: number, peso: number) {
      this.id = id;
      this.nome = nome;
      this.idade = idade;
      this.altura = altura;
      this.peso = peso;
  }
}

class Turma {
  id: number;
  nome: string;
  alunos: Aluno[] = [];

  constructor(id: number, nome: string) {
      this.id = id;
      this.nome = nome;
  }

  getNumAlunos(): number {
      return this.alunos.length;
  }

  private calcularMedia(propriedade: string): number {
      const total = this.alunos.reduce((soma, aluno) => soma + (aluno[propriedade as keyof Aluno] as number) , 0);
      if(total === 0){
        return 0;
      }
      return total / this.alunos.length;
  }

  getMediaIdades(): number {
      return this.calcularMedia('idade');
  }

  getMediaAlturas(): number {
      return this.calcularMedia('altura');
  }

  getMediaPesos(): number {
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

  if(numAlunosElement)
  numAlunosElement.textContent = turma.getNumAlunos().toString();
  if(mediaIdadesElement)
  mediaIdadesElement.textContent = turma.getMediaIdades().toFixed(2);
  if(mediaAlturasElement)
  mediaAlturasElement.textContent = turma.getMediaAlturas().toFixed(2);
  if(mediaPesosElement)
  mediaPesosElement.textContent = turma.getMediaPesos().toFixed(2);
}

function adicionarAluno(event:any ) {
  const nomeInput = document.getElementById("nomeAluno") as HTMLInputElement;
  const idadeInput = document.getElementById("idadeAluno") as HTMLInputElement;
  const alturaInput = document.getElementById("alturaAluno") as HTMLInputElement;
  const pesoInput = document.getElementById("pesoAluno") as HTMLInputElement;

  const nome = nomeInput.value;
  const idade = parseInt(idadeInput.value);
  const altura = parseFloat(alturaInput.value);
  const peso = parseFloat(pesoInput.value);

  if (nome && !isNaN(idade) && !isNaN(altura) && !isNaN(peso)) {
      const aluno = new Aluno(turma.getNumAlunos() + 1, nome, idade, altura, peso);
      turma.alunos.push(aluno);

      const listaAlunos = document.getElementById("listaAlunos");
      const itemLista = document.createElement("li");
      itemLista.id = `li-${aluno.id}`
      itemLista.innerHTML = `
          ${aluno.nome} - Idade: ${aluno.idade}, Altura: ${aluno.altura}cm, Peso: ${aluno.peso}kg
          <button class="edit-button" onclick="editarAluno(${aluno.id})">Editar</button>
          <button onclick="removerAluno(${aluno.id})">Remover</button>
      `;

      if(listaAlunos)
      listaAlunos.appendChild(itemLista);
      atualizarEstatisticas();

      // Limpar campos de entrada
      nomeInput.value = "";
      idadeInput.value = "";
      alturaInput.value = "";
      pesoInput.value = "";
  }
}

function editarAluno(alunoId: number) {
  const aluno = turma.alunos.find(aluno => aluno.id === alunoId);


  if (aluno) {
      const nomeInput = document.getElementById("nomeAluno") as HTMLInputElement;
      const idadeInput = document.getElementById("idadeAluno") as HTMLInputElement;
      const alturaInput = document.getElementById("alturaAluno") as HTMLInputElement;
      const pesoInput = document.getElementById("pesoAluno") as HTMLInputElement;
      const botaoAdicionar = document.getElementById("addAluno") as HTMLButtonElement;

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

function salvarEdicaoAluno(): void {
  const alunoId = idEditarAluno;
  const nomeInput = document.getElementById("nomeAluno") as HTMLInputElement;
  const idadeInput = document.getElementById("idadeAluno") as HTMLInputElement;
  const alturaInput = document.getElementById("alturaAluno") as HTMLInputElement;
  const pesoInput = document.getElementById("pesoAluno") as HTMLInputElement;

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
      if(listaAlunos){
        const itemLista = document.getElementById(`li-${alunoId}`);

        if (itemLista) {
          itemLista.innerHTML = `
              ${aluno.nome} - Idade: ${aluno.idade}, Altura: ${aluno.altura}cm, Peso: ${aluno.peso}kg
              <button class="edit-button" onclick="editarAluno(${aluno.id})">Editar</button>
              <button onclick="removerAluno(${aluno.id})">Remover</button> `;
      }
      }  

      atualizarEstatisticas();

      // Limpar campos de entrada e reverter o botão "Adicionar Aluno" para seu estado original
      nomeInput.value = "";
      idadeInput.value = "";
      alturaInput.value = "";
      pesoInput.value = "";
      const botaoAdicionar = document.getElementById("addAluno") as HTMLButtonElement;
      botaoAdicionar.textContent = "Adicionar Aluno";
      idEditarAluno = -1
      botaoAdicionar.removeEventListener("click", salvarEdicaoAluno)
      botaoAdicionar.addEventListener("click", adicionarAluno);
  }
}

function removerAluno(alunoId: number) {
  turma.alunos = turma.alunos.filter(aluno => aluno.id !== alunoId);
  atualizarEstatisticas();
  const itemLista = document.getElementById(`li-${alunoId}`);
  if (itemLista) {
      itemLista.remove();
  }
}
const botaoAdicionar = document.getElementById("addAluno");
if (botaoAdicionar) {
  botaoAdicionar.addEventListener("click", adicionarAluno);
}

atualizarEstatisticas();
