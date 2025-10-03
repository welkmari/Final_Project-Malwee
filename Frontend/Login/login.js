document.getElementById('loginForm').addEventListener('submit', function(e){
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagemElement = document.getElementById('mensagem-login');

    mensagemElement.textContent = '';

    fetch('http://localhost:3000/login', {
    
        method: 'POST',
    
        headers: {
    
            'Content-Type': 'application/json'
    
        },
    
        body: JSON.stringify({email, senha})
    
    })
    
        .then(response => {
            if(!response.ok){
                return response.json().then(errorData => {
                    throw new Error(errorData.erro || 'Erro desconhecido ao fazer login.');
                });
            }
            return response.json();
        })
    
        .then(data => {
            if(data.token){
                localStorage.setItem('authToken', data.token);

                
            }
        })
    
        .catch(error => console.log(error));
})