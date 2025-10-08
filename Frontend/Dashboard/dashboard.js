document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.tab-btn');
    const chartsContainer = document.getElementById('charts-container');
    const allCanvases = chartsContainer.querySelectorAll('canvas');
    const filtroMesInput = document.getElementById('filtro-mes');

    const chartInstances = {};

    // --- LÓGICA DO FILTRO ---
    
    // Define o valor inicial do filtro para o mês e ano atuais
    const setDefaultDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        // getMonth() é baseado em zero (0-11), então adicionamos 1
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        filtroMesInput.value = `${year}-${month}`;
    };

    // Função para recarregar todos os gráficos com o novo filtro
    const reloadCharts = () => {
        // Primeiro, destrói todas as instâncias de gráficos existentes
        for (const chartId in chartInstances) {
            if (chartInstances[chartId]) {
                chartInstances[chartId].destroy();
                delete chartInstances[chartId];
            }
        }

        // Pega o ID do gráfico que está ativo no momento
        const activeButton = document.querySelector('.tab-btn.active');
        const activeChartId = activeButton ? activeButton.dataset.chartId : buttons[0].dataset.chartId;

        // Mostra o gráfico ativo novamente, o que forçará uma nova busca de dados com o filtro
        if (activeChartId) {
            showChart(activeChartId);
        }
    };

    // Adiciona o "escutador" de eventos ao filtro
    filtroMesInput.addEventListener('change', reloadCharts);

    // --- LÓGICA DOS GRÁFICOS ---

    function showChart(chartId) {
        allCanvases.forEach(canvas => canvas.style.display = 'none');
        buttons.forEach(btn => btn.classList.remove('active'));

        const targetCanvas = document.getElementById(chartId);
        if (targetCanvas) targetCanvas.style.display = 'block';

        const activeButton = document.querySelector(`button[data-chart-id="${chartId}"]`);
        if (activeButton) activeButton.classList.add('active');

        if (chartInstances[chartId]) {
            return; // Se já existe, não faz nada
        }

        createChart(chartId);
    }

    function createChart(chartId) {
        const chartConfig = chartConfigurations[chartId];
        if (!chartConfig) return;

        // Pega o valor do filtro no momento da criação do gráfico
        const [ano, mes] = filtroMesInput.value.split('-');
        
        // Constrói a URL da API com os parâmetros de filtro
        const apiUrlWithFilter = `${chartConfig.apiUrl}?ano=${ano}&mes=${mes}`;

        fetch(apiUrlWithFilter)
            .then(response => {
                if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
                return response.json();
            })
            .then(json => {
                const ctx = document.getElementById(chartId).getContext('2d');
                chartInstances[chartId] = new Chart(ctx, {
                    type: chartConfig.type,
                    data: chartConfig.data(json),
                    options: chartConfig.options
                });
            })
            .catch(error => {
                console.error(`Erro ao buscar dados para o gráfico (${chartId}):`, error);
                const canvas = document.getElementById(chartId);
                if (canvas) {
                    const errorDiv = canvas.parentElement.querySelector('.error-message');
                    if (!errorDiv) {
                        const newErrorDiv = document.createElement('div');
                        newErrorDiv.className = 'error-message';
                        newErrorDiv.textContent = 'Não há dados para exibir no período selecionado.';
                        newErrorDiv.style.color = 'orange';
                        canvas.parentElement.insertBefore(newErrorDiv, canvas);
                    }
                }
            });
    }
    
    // --- INICIALIZAÇÃO ---

    setDefaultDate(); // Define a data padrão
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const chartId = button.dataset.chartId;
            showChart(chartId);
        });
    });

    if (buttons.length > 0) {
        showChart(buttons[0].dataset.chartId);
    }
});

// ===============================================================
//      CONFIGURAÇÕES DE TODOS OS GRÁFICOS
// ===============================================================

const chartConfigurations = {
    'graficoEficiencia': {
        apiUrl: 'http://localhost:3000/api/chart-data',
        type: 'bar',
        data: (json) => ({
            labels: json.labels,
            datasets: [{
                label: 'Média de Metros Produzidos',
                data: json.data,
                backgroundColor: '#A178F1',
                borderColor: '#A178F1'
            }]
        }),
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Média de Metros Produzidos por Máquina' }
            },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Metros (Média)' } } }
        }
    },
    'graficoAtingimentoMeta': {
        apiUrl: 'http://localhost:3000/api/chart-meta',
        type: 'doughnut',
        data: (json) => ({
            labels: json.labels,
            datasets: [{
                label: 'Status da Tarefa',
                data: json.data,
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['#FFFFFF']
            }]
        }),
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Atingimento de Metas' }
            }
        }
    },
    'graficoProducaoTempo': {
        apiUrl: 'http://localhost:3000/api/chart-producao-tempo',
        type: 'bar',
        data: (json) => ({
            labels: json.labels,
            datasets: [{
                label: 'Tempo de Produção (s)',
                data: json.data,
                backgroundColor: 'rgba(78, 226, 133, 0.6)',
                borderColor: 'rgb(78, 226, 133)'
            }]
        }),
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Tempo de Produção por Hora' }
            },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Tempo Total (s)' } } }
        }
    },
    'graficoProducaoTecido': {
        apiUrl: 'http://localhost:3000/api/chart-producao-tecido',
        type: 'bar',
        data: (json) => ({
            labels: json.labels,
            datasets: [{
                label: 'Total Produzido (m)',
                data: json.data,
                backgroundColor: '#2EC9FF',
                borderColor: '#2EC9FF'
            }]
        }),
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Produção Total por Tipo de Tecido' }
            },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Metros Produzidos' } } }
        }
    },
    'graficoLocalidades': {
        apiUrl: 'http://localhost:3000/api/chart-localidades',
        type: 'pie',
        data: (json) => ({
            labels: json.labels,
            datasets: [{
                label: 'Produção Total (m)',
                data: json.data,
                backgroundColor: ['#A178F1', '#4EE2B5', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                borderColor: '#FFFFFF'
            }]
        }),
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Produção Total por Localidade (Máquina)' }
            }
        }
    },
    'graficoSobrasDeRolo': {
        apiUrl: 'http://localhost:3000/api/chart-sobras',
        type: 'pie',
        data: (json) => ({
            labels: json.labels,
            datasets: [{
                label: 'Ocorrências',
                data: json.data,
                backgroundColor: ['rgba(255, 159, 64, 0.6)', 'rgba(54, 162, 235, 0.6)'],
                borderColor: '#FFFFFF'
            }]
        }),
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Proporção de Sobras de Rolo' }
            }
        }
    },
    'graficoTempoSetup': {
        apiUrl: 'http://localhost:3000/api/chart-setup',
        type: 'bar',
        data: (json) => ({
            labels: json.labels,
            datasets: [{
                label: 'Tempo Médio de Setup (s)',
                data: json.data,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)'
            }]
        }),
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Tempo Médio de Setup por Máquina' }
            },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Tempo (s)' } } }
        }
    },
    'graficoQuantidadeTiras': {
        apiUrl: 'http://localhost:3000/api/chart-tiras',
        type: 'bar',
        data: (json) => ({
            labels: json.labels,
            datasets: [{
                label: 'Número de Tarefas',
                data: json.data,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)'
            }]
        }),
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Distribuição da Quantidade de Tiras por Tarefa' }
            },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Contagem de Tarefas' } } }
        }
    }
};