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

                mensagemElement.textContent = `Bem-vindo, ${data.usuario.nome}! Acesso concedido.`
                mensagemElement.style.color = 'green';

                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 500);
            }else{
                throw new Error('LOgin falhoi. Token não recebido.');
            }
        })
    
        .catch(error => {
            let erroMsg = error.message;

            if(erroMsg.includes('E-mail ou senha inválidos.')){
                erroMsg = 'E-mail ou senha incorretos.';
            }else if(erroMsg.includes('Erro desconhecido')){
                erroMsg = 'Nã'
            }
        });
})