const ctx = document.getElementById('meuGrafico').getContext('2d');

const meuGrafico = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
        datasets: [{
            label: 'Eficiência (%)',
            data: [80, 85, 90, 75, 95],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true, max: 100 }
        }
    }
});
