fetch('http://localhost:3000/api/chart-data')
    .then(response => {
        // Verifica se a resposta foi bem-sucedida (status 200-299)
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        // Converte a resposta para JSON
        return response.json();
    })
    .then(json => {
        // Os dados dinâmicos estão em 'json.labels' e 'json.data'
        const ctx = document.getElementById('meuGrafico').getContext('2d');

        // Inicializa o Chart.js usando os dados do JSON
        const meuGrafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: json.labels,
                datasets: [{
                    label: 'Média de Metros Produzidos',
                    backgroundColor: '#A178F1',

                    data: json.data,
                    borderColor: '#A178F1',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Média de Metros Produzidos por Máquina'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Metros Produzidos (Média)'
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        // Trata qualquer erro (se o backend estiver offline ou falhar)
        console.error('Houve um erro ao buscar os dados do gráfico (meuGrafico):', error);
        const canvas = document.getElementById('meuGrafico');
        if (canvas) {
            canvas.style.display = 'none'; // Esconde o canvas vazio
            const errorDiv = document.createElement('div');
            errorDiv.textContent = 'Erro ao carregar o gráfico. Verifique o servidor Node.js e a conexão.';
            errorDiv.style.color = 'red';
            canvas.parentNode.insertBefore(errorDiv, canvas);
        }
    });

fetch('http://localhost:3000/api/chart-meta')
    .then(response => {
        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
        return response.json();
    })
    .then(json => {
        const ctx = document.getElementById('graficoAtingimentoMeta').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: json.labels,
                datasets: [{
                    label: 'Status da Tarefa',
                    data: json.data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)', // Cor para "Imcompleta "
                        'rgba(75, 192, 192, 0.6)'  // Cor para "Completa"
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Atingimento de Metas' }
                }
            }
        });
    })
    .catch(error => console.error('Houve um erro ao buscar os dados do gráfico (Atingimento de Meta):', error));

// chart.js

fetch('http://localhost:3000/api/chart-producao-tempo')
    .then(response => {
        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
        return response.json();
    })
    .then(json => {
        const ctx = document.getElementById('graficoProducaoTempo').getContext('2d');

        if (!ctx) {
            console.error('Elemento canvas com id "graficoProducaoTempo" não foi encontrado.');
            return;
        }

        new Chart(ctx, {
            // ✨ ALTERAÇÃO: Trocamos 'line' por 'bar'
            type: 'bar',
            data: {
                labels: json.labels,
                datasets: [{
                    label: 'Tempo de Produção por Hora (s)',
                    data: json.data,

                    backgroundColor: 'rgb(78, 226, 133, 0.6)',
                    borderColor: 'rgb(78, 226, 133)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: true, text: 'Tempo de Produção por Hora' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Tempo Total (segundos)' }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Houve um erro ao buscar ou renderizar o gráfico (Produção Tempo):', error));
fetch('http://localhost:3000/api/chart-producao-tecido')
    .then(response => {
        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
        return response.json();
    })
    .then(json => {
        const ctx = document.getElementById('graficoProducaoTecido').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: json.labels,
                datasets: [{
                    label: 'Total Produzido (m)',
                    data: json.data,
                    backgroundColor: '#2EC9FF',
                    borderColor: '#2EC9FF',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Produção Total por Tipo de Tecido' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Metros Produzidos' }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Houve um erro ao buscar os dados do gráfico (Produção Tecido):', error));


fetch('http://localhost:3000/api/chart-localidades')
    .then(response => {
        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
        return response.json();
    })
    .then(json => {
        const ctx = document.getElementById('graficoLocalidades').getContext('2d');
        new Chart(ctx, {
            type: 'pie', // Gráfico de pizza fica bom para essa visualização
            data: {
                labels: json.labels,
                datasets: [{
                    label: 'Produção Total (m)',
                    data: json.data,
                    backgroundColor: [
                        '#A178F1',
                        '#4EE2B5',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)'
                    ],
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Produção Total por Localidade (Máquina)'
                    }
                }
            }
        });
    })
    .catch(error => console.error('Houve um erro ao buscar os dados do gráfico (Localidades):', error));