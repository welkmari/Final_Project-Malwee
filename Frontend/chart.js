// 1. Faz a requisição ao seu backend Node.js
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
        // 2. Os dados dinâmicos estão em 'json.labels' e 'json.data'

        const ctx = document.getElementById('meuGrafico').getContext('2d');
        
        // 3. Inicializa o Chart.js usando os dados do JSON
        const meuGrafico = new Chart(ctx, {
            type: 'bar', // tipo de gráfico: bar, line, pie, doughnut, radar...
            data: {
                // USA OS DADOS DINÂMICOS
                labels: json.labels, // <--- Aqui entram as Máquinas
                datasets: [{
                    // Define o label e cores
                    label: 'Média de Metros Produzidos', // <--- Ajustado para a nova métrica
                    backgroundColor: 'rgba(54, 162, 235, 0.6)', // Cor padrão para todas as barras (você pode usar um array para cores diferentes)
                    
                    // USA OS DADOS DINÂMICOS
                    data: json.data, // <--- Aqui entram as médias de metros
                    borderColor: 'rgba(54, 162, 235, 1)',
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
                        // Ajustado para o conteúdo real
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
        // 4. Trata qualquer erro (se o backend estiver offline ou falhar)
        console.error('Houve um erro ao buscar os dados do gráfico:', error);
        // Opcional: Mostra uma mensagem de erro na tela
        const canvas = document.getElementById('meuGrafico');
        if (canvas) {
            canvas.style.display = 'none'; // Esconde o canvas vazio
            const errorDiv = document.createElement('div');
            errorDiv.textContent = 'Erro ao carregar o gráfico. Verifique o servidor Node.js e a conexão.';
            errorDiv.style.color = 'red';
            canvas.parentNode.insertBefore(errorDiv, canvas);
        }
    });