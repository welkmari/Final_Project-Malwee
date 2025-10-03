const ctx = document.getElementById('chart');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Espessura','Largura','Metragem','Saída'],
    datasets: [{
      label: 'Valores',
      data: [1.2, 50, 100, 200],
      backgroundColor: '#4F46E5'
    }]
  }
});

function changeReport(){
  const val = document.getElementById('reportSelect').value;
  alert("Mudando para relatório: " + val);
}