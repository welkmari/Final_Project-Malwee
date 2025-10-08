document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os botões e o container dos gráficos
    const buttons = document.querySelectorAll('.tab-btn');
    const chartsContainer = document.getElementById('charts-container');
    const allCanvases = chartsContainer.querySelectorAll('canvas');

    // Objeto para guardar os gráficos já criados e evitar recarregá-los
    const chartInstances = {};

    /**
     * Função principal para mostrar um gráfico e esconder os outros.
     * @param {string} chartId - O ID do canvas do gráfico a ser mostrado (ex: 'graficoEficiencia').
     */
    function showChart(chartId) {
        // 1. Esconde todos os gráficos
        allCanvases.forEach(canvas => {
            canvas.style.display = 'none';
        });

        // 2. Remove o estilo de "ativo" de todos os botões
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });

        // 3. Mostra o gráfico correto
        const targetCanvas = document.getElementById(chartId);
        if (targetCanvas) {
            targetCanvas.style.display = 'block';
        }

        // 4. Adiciona o estilo de "ativo" ao botão clicado
        const activeButton = document.getElementById(chartId); // O ID do botão é o mesmo do canvas
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // 5. Se o gráfico já foi criado, não faz mais nada
        if (chartInstances[chartId]) {
            return;
        }

        // 6. Se for a primeira vez, busca os dados e cria o gráfico
        createChart(chartId);
    }

    /**
     * Busca os dados no servidor e cria o gráfico.
     * @param {string} chartId - O ID do gráfico a ser criado.
     */
    function createChart(chartId) {
        const chartConfig = chartConfigurations[chartId];
        if (!chartConfig) {
            console.error(`Configuração não encontrada para o gráfico: ${chartId}`);
            return;
        }

        fetch(chartConfig.apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                const ctx = document.getElementById(chartId).getContext('2d');
                // Cria e guarda a instância do gráfico
                chartInstances[chartId] = new Chart(ctx, {
                    type: chartConfig.type,
                    data: chartConfig.data(json),
                    options: chartConfig.options
                });
            })
            .catch(error => {
                console.error(`Erro ao buscar dados para o gráfico (${chartId}):`, error);
                // Mostra uma mensagem de erro no lugar do gráfico
                const canvas = document.getElementById(chartId);
                if (canvas) {
                    canvas.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.textContent = 'Erro ao carregar o gráfico. Verifique o servidor e a conexão.';
                    errorDiv.style.color = 'red';
                    canvas.parentNode.insertBefore(errorDiv, canvas);
                }
            });
    }

    // Adiciona o evento de clique para cada botão
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            showChart(button.id);
        });
    });

    // Exibe o primeiro gráfico como padrão ao carregar a página
    if (buttons.length > 0) {
        showChart(buttons[0].id);
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