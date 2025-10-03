const api_url = 'http://localhost:3000';

document.getElementById('registroForm').addEventListener('submit', function(e){
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagemElement = document.getElementById('mensagem-registro');

    mensagemElement.textContent - '';

    fetch('url', {
    
        method: 'POST',
    
        headers: {
    
            'Content-Type': 'application/json'
    
        },
    
        body: JSON.stringify()
    
    })
    
        .then(response => response.json())
    
        .then(data => console.log(data))
    
        .catch(error => console.log(error));
})