const API_URL = 'http://localhost:5001'; 
const FILMES_ENDPOINT = `${API_URL}/filmes`;
const FILMES_BUSCA_EXTERNA_ENDPOINT = `${FILMES_ENDPOINT}/busca_externa`; 
const CLIENTES_ENDPOINT = `${API_URL}/clientes`;

const MAPA_GENEROS = {
    "Action": "Ação",
    "Adventure": "Aventura",
    "Animation": "Animação",
    "Comedy": "Comédia",
    "Crime": "Crime",
    "Documentary": "Documentário",
    "Drama": "Drama",
    "Family": "Família",
    "Fantasy": "Fantasia",
    "History": "História",
    "Horror": "Terror",
    "Music": "Musical",
    "Mystery": "Mistério",
    "Romance": "Romance",
    "Sci-Fi": "Ficção Científica",
    "Thriller": "Suspense",
    "War": "Guerra",
    "Western": "Faroeste"
};

let idClienteEmEdicao = null; 

const filmesSec = document.getElementById("secao-filmes");
const clientesSec = document.getElementById("secao-clientes");

const filmesLista = document.getElementById("listaFilmes");
const clientesLista = document.getElementById("listaClientes"); 
const btnCadastrarCliente = document.getElementById("btnCadastrarCliente");
const btnAlterarCliente = document.getElementById("btnAlterarCliente");

const tituloFilmeInput = document.getElementById("tituloFilme"); 
const generoFilmeSelect = document.getElementById("sessoesFilme"); 
const anoFilmeInput = document.getElementById("anoFilme");

const mensagemTopo = document.getElementById("areaMensagemTopo");

function mostrarMensagemTopo(mensagem, isErro = false) {
    if (!mensagemTopo) {
        console.error("ERRO CRÍTICO: Elemento de Mensagem no Topo não encontrado.");
        if (isErro) {
            alert(`[ERRO] ${mensagem}`);
        } else {
            alert(mensagem);
        }
        return;
    }

    mensagemTopo.textContent = mensagem;
    mensagemTopo.style.display = 'block';

    mensagemTopo.classList.remove('alerta-erro', 'alerta-sucesso');
    if (isErro) {
        mensagemTopo.classList.add('alerta-erro');
    } else {
        mensagemTopo.classList.add('alerta-sucesso');
    }

    setTimeout(ocultarMensagemTopo, 5000); 
}

function ocultarMensagemTopo() {
    if (mensagemTopo) {
        mensagemTopo.style.display = 'none';
        mensagemTopo.textContent = '';
    }
}

function criarCard(titulo, detalhes, botaoHtml = "") {
    const div = document.createElement("div");
    div.classList.add("card");
    const detalhesHtml = detalhes.map(d => `<p>${d}</p>`).join('');
    div.innerHTML = `<h4>${titulo}</h4>${detalhesHtml}${botaoHtml ? `<div class="card-actions">${botaoHtml}</div>` : ''}`;
    return div;
}

const todasSecoes = [filmesSec, clientesSec].filter(el => el);

document.getElementById('btnFilmes')?.addEventListener('click', () => {
    todasSecoes.forEach(sec => sec.classList.remove('ativa'));
    filmesSec?.classList.add('ativa');
    if (filmesLista) filmesLista.innerHTML = '<p class="info-msg">Modo busca externa ativado. Use o formulário acima.</p>';
});

document.getElementById('btnClientes')?.addEventListener('click', () => {
    todasSecoes.forEach(sec => sec.classList.remove('ativa'));
    clientesSec?.classList.remove('ativa');
    clientesSec?.classList.add('ativa');
    mostrarClientes();
});

function buscarFilme() {
    buscarFilmeExterno();
}

async function buscarFilmeExterno() {
    const tituloBusca = tituloFilmeInput ? tituloFilmeInput.value.trim() : ''; 
    const generoSelecionado = generoFilmeSelect ? generoFilmeSelect.value : '';
    const anoBusca = anoFilmeInput ? anoFilmeInput.value : '';

    if (!tituloBusca) {
        mostrarMensagemTopo("O campo de TÍTULO é obrigatório para a busca externa.", true);
        return;
    }
    
    if (filmesLista) filmesLista.innerHTML = '<p class="info-msg">Buscando filme em catálogo externo...</p>';

    try {
        const urlBusca = `${API_URL}/filmes/busca_externa?titulo=${encodeURIComponent(tituloBusca)}`;
        const response = await fetch(urlBusca);
        
        const data = await response.json().catch(() => ({ erro: 'Não foi possível ler a mensagem de retorno da API.' }));

        if (!response.ok) {
            let errorMessage = data.error || data.message || data.erro || `Erro ${response.status}: Falha ao buscar filme.`;
            throw new Error(errorMessage); 
        }

        if (filmesLista) filmesLista.innerHTML = ''; 

        const filmeExterno = data;

        const detalhes = [
            `**Gênero:** ${MAPA_GENEROS[filmeExterno.genero] || filmeExterno.genero || 'N/A'} | **Ano:** ${filmeExterno.ano || 'N/A'}`,
            '<hr>',
            `<i>Resultado da busca por: <strong>${tituloBusca}</strong>.</i>`
        ];
        
        const botoes = ``; 

        filmesLista.appendChild(criarCard(`Resultado da Busca: ${filmeExterno.titulo}`, detalhes, botoes));
        
        mostrarMensagemTopo(`Busca externa por "${tituloBusca}" concluída! Filme oficial: ${filmeExterno.titulo}.`, false);

    } catch (error) {
        console.error('Erro na busca externa de filmes:', error);
        if (filmesLista) filmesLista.innerHTML = `<p class="erro">Falha na busca externa: ${error.message}</p>`;
        mostrarMensagemTopo(`Falha na busca: ${error.message}`, true);
    }
}

async function mostrarFilmes() {
    if (!filmesLista) return;
    filmesLista.innerHTML = '<p class="info-msg">A lista de filmes está desativada. Use o formulário para a busca externa.</p>'; 
    return;
}

function alugarFilme(filmeId) {
    mostrarMensagemTopo(`A rotina de Aluguel (Filme ID ${filmeId}) será implementada em breve!`, false);
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); 
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true; 
}

function limparCamposCliente() {
    document.getElementById("nomeCliente").value = "";
    document.getElementById("emailCliente").value = "";
    document.getElementById("telefoneCliente").value = "";
    document.getElementById("cpfCliente").value = "";
    document.getElementById("dataNascimentoCliente").value = "";
    
    idClienteEmEdicao = null;
    if (btnCadastrarCliente) btnCadastrarCliente.style.display = 'inline-block';
    if (btnAlterarCliente) btnAlterarCliente.style.display = 'none';
}

function validaDadosCliente(nome, email, telefone, cpf, dataNascimento) {
    if (!nome || !email || !telefone || !cpf || !dataNascimento) {
        mostrarMensagemTopo("Preencha todos os campos do cliente.", true); 
        return null;
    }

    if (!validarCPF(cpf)) {
        mostrarMensagemTopo("CPF inválido. Verifique os números.", true);
        document.getElementById("cpfCliente").value = "";
        return null;
    }
    cpf = cpf.replace(/[^\d]+/g, ''); 

    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length < 10 || numeros.length > 11 || /^(\d)\1+$/.test(numeros)) {
        mostrarMensagemTopo("Telefone inválido. Use 10 ou 11 dígitos (DDD + Número).", true);
        document.getElementById("telefoneCliente").value = "";
        return null;
    }

    let ddd = numeros.substring(0, 2);
    let numero = numeros.substring(2);
    let telefoneFormatado;

    if (numero.length === 9) {
        telefoneFormatado = `(${ddd}) ${numero.substring(0, 5)}-${numero.substring(5)}`;
    } else if (numero.length === 8) {
        telefoneFormatado = `(${ddd}) ${numero.substring(0, 4)}-${numero.substring(4)}`;
    } else {
        telefoneFormatado = numeros;
    }
    
    return {
        nome: nome.trim(), 
        email: email.trim(), 
        telefone: telefoneFormatado, 
        cpf, 
        dataNascimento 
    };
}

async function adicionarCliente(nome, email, telefone, cpf, dataNascimento) {
    const novoCliente = {nome, email, telefone, cpf, data_nascimento: dataNascimento};
    
    try {
        const urlCadastro = `${CLIENTES_ENDPOINT}/`;

        const response = await fetch(urlCadastro, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(novoCliente),
        });

        const data = await response.json().catch(() => ({ erro: 'Não foi possível ler a mensagem de erro da API.' }));

        if (!response.ok) {
            let errorMessage = `Erro ao cadastrar cliente: ${response.status} - ${data.erro || 'Erro desconhecido'}`;
            if (response.status === 409) {
                errorMessage = `Erro 409. O CPF já está cadastrado. Detalhe: ${data.erro || 'N/A'}`;
            }
            throw new Error(errorMessage); 
        }

        mostrarMensagemTopo("Cliente cadastrado com sucesso!");
        limparCamposCliente();
        await mostrarClientes(); 
        
    } catch (error) {
        console.error("Erro no cadastro do cliente:", error);
        let userMessage = error.message;
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            userMessage = 'Falha de Conexão. Verifique se o servidor Flask está rodando.';
        }
        mostrarMensagemTopo(`Erro ao cadastrar cliente na API: ${userMessage}`, true);
    }
}

function cadastrarCliente() {
    let nome = document.getElementById("nomeCliente").value;
    let email = document.getElementById("emailCliente").value;
    let telefone = document.getElementById("telefoneCliente").value;
    let cpf = document.getElementById("cpfCliente").value;
    let dataNascimento = document.getElementById("dataNascimentoCliente").value;

    const dadosValidados = validaDadosCliente(nome, email, telefone, cpf, dataNascimento);

    if (!dadosValidados) return;
    
    const { nome: nomeFormatado, email: emailFormatado, telefone: telefoneFormatado, cpf: cpfLimpo, dataNascimento: dataNascimentoFormatada } = dadosValidados;
    
    adicionarCliente(nomeFormatado, emailFormatado, telefoneFormatado, cpfLimpo, dataNascimentoFormatada);
}

function prepararEdicaoCliente(clienteId, nome, email, telefone, cpf, dataNascimento) {
    idClienteEmEdicao = clienteId;
    
    document.getElementById("nomeCliente").value = nome;
    document.getElementById("emailCliente").value = email;
    document.getElementById("telefoneCliente").value = telefone;
    document.getElementById("cpfCliente").value = cpf;
    document.getElementById("dataNascimentoCliente").value = dataNascimento;
    
    if (btnCadastrarCliente) btnCadastrarCliente.style.display = 'none';
    if (btnAlterarCliente) btnAlterarCliente.style.display = 'inline-block';
    
    clientesSec?.scrollIntoView({ behavior: 'smooth' });
}

async function alterarCliente() {
    if (!idClienteEmEdicao) {
        mostrarMensagemTopo("Nenhum cliente selecionado para alteração.", true);
        return;
    }

    let nome = document.getElementById("nomeCliente").value;
    let email = document.getElementById("emailCliente").value;
    let telefone = document.getElementById("telefoneCliente").value;
    let cpf = document.getElementById("cpfCliente").value;
    let dataNascimento = document.getElementById("dataNascimentoCliente").value;

    const dadosValidados = validaDadosCliente(nome, email, telefone, cpf, dataNascimento);
    if (!dadosValidados) return;
    
    const { nome: nomeFormatado, email: emailFormatado, telefone: telefoneFormatado, cpf: cpfLimpo, dataNascimento: dataNascimentoFormatada } = dadosValidados;
    
    const clienteAtualizado = {
        nome: nomeFormatado, 
        email: emailFormatado, 
        telefone: telefoneFormatado, 
        cpf: cpfLimpo, 
        data_nascimento: dataNascimentoFormatada 
    };

    try {
        const response = await fetch(`${CLIENTES_ENDPOINT}/${idClienteEmEdicao}`, {
            method: 'PUT', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(clienteAtualizado),
        });

        const data = await response.json().catch(() => ({ erro: 'Não foi possível ler a mensagem de erro da API.' }));

        if (!response.ok) {
            let errorMessage = `Erro ao atualizar cliente: ${response.status} - ${data.erro || 'Erro desconhecido'}`;
            if (response.status === 409) {
                errorMessage = `Erro 409. O CPF já pertence a OUTRO cliente. Detalhe: ${data.erro || 'N/A'}`;
            }
            throw new Error(errorMessage);
        }

        mostrarMensagemTopo(`Cliente ID #${idClienteEmEdicao} atualizado com sucesso!`);
        limparCamposCliente();
        await mostrarClientes(); 
        
    } catch (error) {
        console.error("Erro na alteração do cliente:", error);
        let userMessage = error.message;
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            userMessage = 'Falha de Conexão. Verifique se o servidor Flask está rodando.';
        }
        mostrarMensagemTopo(`Erro ao atualizar cliente na API: ${userMessage}`, true);
    }
}

async function excluirCliente(clienteId, nome) {
    if (!confirm(`Tem certeza que deseja DELETAR o cliente ${nome}? Esta ação é irreversível.`)) {
        return;
    }

    try {
        const response = await fetch(`${CLIENTES_ENDPOINT}/${clienteId}`, {
            method: 'DELETE',
        });

        if (response.status === 204) {
            mostrarMensagemTopo(`Cliente "${nome}" deletado com sucesso!`, false);
            limparCamposCliente();
            await mostrarClientes();
            mostrarFilmes();
        } else {
            const data = await response.json().catch(() => ({ erro: 'Não foi possível ler a mensagem de erro da API.' }));
            mostrarMensagemTopo(`Falha ao deletar cliente: ${data.erro || 'Cliente não encontrado.'}`, true);
        }
    } catch (error) {
        console.error("Erro ao deletar cliente:", error);
        let userMessage = error.message;
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            userMessage = 'Falha de Conexão. Verifique se o servidor Flask está rodando.';
        }
        mostrarMensagemTopo(`Erro ao deletar cliente: ${userMessage}`, true);
    }
}

async function mostrarClientes() {
    if (!clientesLista) return;
    clientesLista.innerHTML = "";
    try {
        const response = await fetch(CLIENTES_ENDPOINT);
        if (!response.ok) throw new Error(`Erro ao buscar clientes: ${response.status}`);

        const clientes = await response.json();

        clientes.forEach(c => {
            let dataNascimentoFormatada = c.data_nascimento ? c.data_nascimento.split('-').reverse().join('/') : 'N/A';

            const detalhes = [
                `ID: ${c.id}`,
                `CPF: ${c.cpf}`, 
                `Nascimento: ${dataNascimentoFormatada}`,
                `Email: ${c.email}`,
                `Telefone: ${c.telefone}`
            ];
            
            const botaoEditar = `<button class="btn btn-secundario" onclick="prepararEdicaoCliente(${c.id}, '${c.nome}', '${c.email}', '${c.telefone}', '${c.cpf}', '${c.data_nascimento}')">Editar</button>`;
            const botaoDeletar = `<button class="btn btn-deletar" onclick="excluirCliente(${c.id}, '${c.nome}')">Deletar</button>`;
            
            clientesLista.appendChild(criarCard(c.nome, detalhes, botaoEditar + botaoDeletar));
        });
        
        if (clientes.length === 0) {
            clientesLista.innerHTML = `<p class="info-msg">Nenhum cliente cadastrado.</p>`; 
        }

    } catch (error) {
        console.error("Falha ao carregar clientes:", error);
        clientesLista.innerHTML = `<p class="erro">Não foi possível carregar os clientes. API não respondeu.</p>`; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.confirm === 'undefined' || typeof window.alert === 'undefined') {
        window.confirm = (message) => {
            console.log(`[Confirmação Simulada]: ${message}`);
            return true; 
        };
        window.alert = (message) => {
             console.log(`[Alerta]: ${message}`);
        };
    }
    
    clientesSec?.classList.remove('ativa');
    filmesSec?.classList.add('ativa');
    mostrarFilmes();
});