// Chave para salvar no LocalStorage
const STORAGE_KEY_ADMIN = "admin_users_list";

// Funçao auxiliar para ler dados do localstorage
function getUsuariosStorage() {
    const usuarios = localStorage.getItem(STORAGE_KEY_ADMIN);
    // Retorna array vazio se não houver dados, ou faz o parse do JSON
    return usuarios ? JSON.parse(usuarios) : [];
}

// Função auxiliar para salvar dados no LocalStorage 
function setUsuariosStorage(usuarios) {
    localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(usuarios));
}

// 1. Função para INCLUIR dados na lista
function adicionarUsuarioAdmin(event) {
    event.preventDefault(); 

    // Captura os valores do formulário
    const nome = document.getElementById('adminNome').value;
    const email = document.getElementById('adminEmail').value;

    // Captura a data atual 
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    // Cria o objeto do usuário
    const novoUsuario = {
        nome: nome,
        email: email,
        data: dataAtual,
        id: Date.now() 
    };

    // Recupera lista atual/adiciona o novo e salva
    const listaUsuarios = getUsuariosStorage();
    listaUsuarios.push(novoUsuario);
    setUsuariosStorage(listaUsuarios);

    // Atualiza a visualização e limpa o form
    renderizarLista();
    limparCamposAdmin();
    alert("Usuário cadastrado com sucesso!");
}

// 2. Função para RENDERIZAR a lista na tela
function renderizarLista(filtro = "") {
    const listaUl = document.getElementById('listaUsuarios');
    // Verifica esta na pagina de admin
    if (!listaUl) return; 

    listaUl.innerHTML = ""; // Limpa a lista atual

    const usuarios = getUsuariosStorage();

    // Filtra usuários se houver termo de pesquisa
    const usuariosFiltrados = usuarios.filter(usuario => {
        const termo = filtro.toLowerCase();
        return usuario.nome.toLowerCase().includes(termo) || 
               usuario.email.toLowerCase().includes(termo);
    });

    // Cria os elementos HTML para cada usuário
    usuariosFiltrados.forEach(usuario => {
        const li = document.createElement('li');
        
        // Estrutura do LI/Dados + Botão Excluir
        li.innerHTML = `
            <div class="info">
                <strong>${usuario.nome}</strong> - ${usuario.email}
                <br><span>Cadastrado em: ${usuario.data}</span>
            </div>
            <button class="btn-delete-item" onclick="excluirUsuario(${usuario.id})" title="Excluir Usuário">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        
        listaUl.appendChild(li);
    });

    if (usuariosFiltrados.length === 0 && usuarios.length > 0) {
        listaUl.innerHTML = "<li style='text-align:center'>Nenhum usuário encontrado na pesquisa.</li>";
    } else if (usuarios.length === 0) {
        listaUl.innerHTML = "<li style='text-align:center'>Nenhum usuário cadastrado.</li>";
    }
}

// 3. Função para EXCLUIR UM ITEM da lista/LocalStorage
function excluirUsuario(idUsuario) {
    if(confirm("Tem certeza que deseja excluir este usuário?")) {
        const usuarios = getUsuariosStorage();
        // Filtra removendo o usuário com o ID correspondente
        const novaLista = usuarios.filter(user => user.id !== idUsuario);
        
        setUsuariosStorage(novaLista);
        renderizarLista(); // Atualiza a tela
    }
}

// 4. Função para EXCLUIR TODOS os itens
function excluirTodosUsuarios() {
    if(confirm("ATENÇÃO: Isso apagará TODOS os usuários cadastrados. Continuar?")) {
        localStorage.removeItem(STORAGE_KEY_ADMIN);
        renderizarLista();
    }
}

// 5. Função para LIMPAR CAMPOS do formulario
function limparCamposAdmin() {
    document.getElementById('adminNome').value = "";
    document.getElementById('adminEmail').value = "";
}

// 6. Função para PESQUISAR itens 
function pesquisarUsuario() {
    const termo = document.getElementById('adminBusca').value;
    renderizarLista(termo);
}

// Inicialização: Renderiza a lista ao carregar a página
window.addEventListener('load', () => {
    // Verifica esta na pagina admin
    if (document.getElementById('listaUsuarios')) {
        renderizarLista();
    }
});