// Dados iniciais (vazios)
let csvData = [];
let currentPage = 1;
const recordsPerPage = 20;
let filteredData = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados salvos no localStorage
    carregarDadosSalvos();
    
    // Inicializar filtros
    initializeFilters();
    
    // Atualizar estatísticas
    updateStats();
    
    // Renderizar tabela
    renderTable();
    
    // Configurar eventos
    setupEventListeners();
    
    // Configurar tema
    setupTheme();
    
    // Configurar formulário
    document.getElementById('production-form').addEventListener('submit', function(e) {
        e.preventDefault();
        adicionarRegistro();
    });
});

// Carregar dados salvos
function carregarDadosSalvos() {
    const dadosSalvos = localStorage.getItem('dadosProducao');
    if (dadosSalvos) {
        csvData = JSON.parse(dadosSalvos);
        filteredData = [...csvData];
    } else {
        // Dados de exemplo iniciais
        csvData = [
            {
                data: "2025-05-23T05:39:04",
                maquina: "CD1",
                tipoTecido: "1",
                tipoSaida: "0",
                numeroTarefa: "1",
                tempoSetup: "453",
                tempoProducao: "166",
                quantidadeTiras: "3",
                metrosProduzidos: "4787",
                tarefaCompleta: "TRUE",
                sobraRolo: "FALSE",
                observacoes: ""
            }
        ];
        filteredData = [...csvData];
        salvarDados();
    }
}

// Salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('dadosProducao', JSON.stringify(csvData));
}

// Adicionar novo registro
function adicionarRegistro() {
    const form = document.getElementById('production-form');
    
    const novoRegistro = {
        data: document.getElementById('input-data').value.replace('T', ' ') + ':00',
        maquina: document.getElementById('input-maquina').value || '',
        tipoTecido: document.getElementById('input-tipo-tecido').value,
        tipoSaida: document.getElementById('input-tipo-saida').value,
        numeroTarefa: document.getElementById('input-numero-tarefa').value,
        tempoSetup: document.getElementById('input-tempo-setup').value,
        tempoProducao: document.getElementById('input-tempo-producao').value,
        quantidadeTiras: document.getElementById('input-quantidade-tiras').value,
        metrosProduzidos: document.getElementById('input-metros').value,
        tarefaCompleta: document.getElementById('input-tarefa-completa').checked ? 'TRUE' : 'FALSE',
        sobraRolo: document.getElementById('input-sobra-rolo').checked ? 'TRUE' : 'FALSE',
        observacoes: document.getElementById('input-observacoes').value || ''
    };
    
    // Validar dados obrigatórios
    if (!novoRegistro.data || !novoRegistro.numeroTarefa) {
        alert('Por favor, preencha os campos obrigatórios: Data/Hora e Nº Tarefa');
        return;
    }
    
    csvData.unshift(novoRegistro); // Adicionar no início
    filteredData = [...csvData];
    
    // Salvar dados
    salvarDados();
    
    // Atualizar interface
    updateStats();
    renderTable();
    initializeFilters();
    limparFormulario();
    
    // Mostrar mensagem de sucesso
    alert('Registro adicionado com sucesso!');
}

// Limpar formulário
function limparFormulario() {
    document.getElementById('production-form').reset();
    // Definir data/hora atual como padrão
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('input-data').value = localDateTime;
}

// Remover registro
function removerRegistro(index) {
    if (confirm('Tem certeza que deseja remover este registro?')) {
        csvData.splice(index, 1);
        filteredData = [...csvData];
        salvarDados();
        updateStats();
        renderTable();
        initializeFilters();
    }
}

// Inicializar filtros
function initializeFilters() {
    // Máquinas únicas
    const machines = [...new Set(csvData.map(item => item.maquina))].filter(Boolean);
    const machineFilter = document.getElementById('filter-machine');
    machineFilter.innerHTML = '<option value="">Todas</option>';
    machines.forEach(machine => {
        const option = document.createElement('option');
        option.value = machine;
        option.textContent = machine;
        machineFilter.appendChild(option);
    });
    
    // Tipos de tecido únicos
    const fabrics = [...new Set(csvData.map(item => item.tipoTecido))].filter(Boolean);
    const fabricFilter = document.getElementById('filter-fabric');
    fabricFilter.innerHTML = '<option value="">Todos</option>';
    fabrics.forEach(fabric => {
        const option = document.createElement('option');
        option.value = fabric;
        option.textContent = fabric;
        fabricFilter.appendChild(option);
    });
    
    // Atualizar contador de registros
    document.getElementById('total-registros').textContent = `${csvData.length} registros`;
}

// Configurar eventos
function setupEventListeners() {
    // Filtros
    document.getElementById('filter-date').addEventListener('change', applyFilters);
    document.getElementById('filter-machine').addEventListener('change', applyFilters);
    document.getElementById('filter-fabric').addEventListener('change', applyFilters);
    document.getElementById('filter-task').addEventListener('change', applyFilters);
    document.getElementById('filter-roll').addEventListener('change', applyFilters);
    
    // Pesquisa
    document.getElementById('search-button').addEventListener('click', applyFilters);
    document.getElementById('search-input').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            applyFilters();
        }
    });
    
    // Tema
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}

// Aplicar filtros
function applyFilters() {
    const dateFilter = document.getElementById('filter-date').value;
    const machineFilter = document.getElementById('filter-machine').value;
    const fabricFilter = document.getElementById('filter-fabric').value;
    const taskFilter = document.getElementById('filter-task').value;
    const rollFilter = document.getElementById('filter-roll').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    filteredData = csvData.filter(item => {
        // Filtro por data
        if (dateFilter && !item.data.startsWith(dateFilter)) {
            return false;
        }
        
        // Filtro por máquina
        if (machineFilter && item.maquina !== machineFilter) {
            return false;
        }
        
        // Filtro por tipo de tecido
        if (fabricFilter && item.tipoTecido !== fabricFilter) {
            return false;
        }
        
        // Filtro por tarefa completa
        if (taskFilter && item.tarefaCompleta !== taskFilter) {
            return false;
        }
        
        // Filtro por sobra de rolo
        if (rollFilter && item.sobraRolo !== rollFilter) {
            return false;
        }
        
        // Pesquisa geral
        if (searchTerm) {
            const searchableText = Object.values(item).join(' ').toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    currentPage = 1;
    updateStats();
    renderTable();
}

// Atualizar estatísticas
function updateStats() {
    document.getElementById('total-records').textContent = filteredData.length;
    
    const totalMeters = filteredData.reduce((sum, item) => sum + parseInt(item.metrosProduzidos || 0), 0);
    document.getElementById('total-meters').textContent = totalMeters.toLocaleString();
    
    const avgProductionTime = filteredData.length > 0 ? 
        filteredData.reduce((sum, item) => sum + parseInt(item.tempoProducao || 0), 0) / filteredData.length : 0;
    document.getElementById('avg-production-time').textContent = avgProductionTime.toFixed(1);
    
    const avgSetupTime = filteredData.length > 0 ? 
        filteredData.reduce((sum, item) => sum + parseInt(item.tempoSetup || 0), 0) / filteredData.length : 0;
    document.getElementById('avg-setup-time').textContent = avgSetupTime.toFixed(1);
}

// Renderizar tabela
function renderTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, filteredData.length);
    const pageData = filteredData.slice(startIndex, endIndex);
    
    if (pageData.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="13" style="text-align: center;">Nenhum registro encontrado</td>`;
        tableBody.appendChild(row);
    } else {
        pageData.forEach((item, index) => {
            const row = document.createElement('tr');
            const originalIndex = csvData.findIndex(originalItem => 
                originalItem.data === item.data && 
                originalItem.numeroTarefa === item.numeroTarefa
            );
            
            row.innerHTML = `
                <td>${item.data}</td>
                <td>${item.maquina || '-'}</td>
                <td>${item.tipoTecido}</td>
                <td>${item.tipoSaida}</td>
                <td>${item.numeroTarefa}</td>
                <td>${item.tempoSetup}</td>
                <td>${item.tempoProducao}</td>
                <td>${item.quantidadeTiras}</td>
                <td>${item.metrosProduzidos}</td>
                <td>${item.tarefaCompleta}</td>
                <td>${item.sobraRolo}</td>
                <td>${item.observacoes || '-'}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removerRegistro(${originalIndex})">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    renderPagination();
}

// Renderizar paginação
function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    
    if (totalPages <= 1) return;
    
    // Botão anterior
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<i class="ri-arrow-left-s-line"></i>';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    pagination.appendChild(prevButton);
    
    // Números de página
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active', i === currentPage);
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderTable();
        });
        pagination.appendChild(pageButton);
    }
    
    // Botão próximo
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '<i class="ri-arrow-right-s-line"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
    pagination.appendChild(nextButton);
}

// Exportar dados para CSV
function exportarDados() {
    if (csvData.length === 0) {
        alert('Não há dados para exportar.');
        return;
    }
    
    const headers = ['Data', 'Máquina', 'Tipo Tecido', 'Tipo Saída', 'Nº Tarefa', 'Tempo Setup', 'Tempo Produção', 'Qtd Tiras', 'Metros', 'Tarefa Completa', 'Sobra Rolo', 'Observações'];
    
    let csvContent = headers.join(',') + '\n';
    
    csvData.forEach(item => {
        const row = [
            item.data,
            item.maquina,
            item.tipoTecido,
            item.tipoSaida,
            item.numeroTarefa,
            item.tempoSetup,
            item.tempoProducao,
            item.quantidadeTiras,
            item.metrosProduzidos,
            item.tarefaCompleta,
            item.sobraRolo,
            `"${item.observacoes || ''}"`
        ];
        csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'dados_producao.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}