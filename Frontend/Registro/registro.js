document.getElementById('registroForm').addEventListener('submit', function(e){
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagemElement = document.getElementById('mensagem-registro');

    mensagemElement.textContent - '';

    fetch('http://localhost:3000/registrar', {
    
        method: 'POST',
    
        headers: {
    
            'Content-Type': 'application/json'
    
        },
    
        body: JSON.stringify({nome, email, senha})
    
    })
    
        .then(response => {
            if(!response.ok){
                return response.json().then(errorData => {
                    throw new Error(errorData.erro || 'Erro desconhecido ao registrar.');
                });
            }
            return response.json();
        }).then(data => {
            mensagemElement.textContent = data.mensagem + 'Você será redirecionado para o Login.';
            mensagemElement.style.color = 'green';

            setTimeout(() => {
                window.location.href = '/Frontend/Login/login.html';
            }, 2000);
        })
    
        .catch(error => {
            let erroMsg = error.message;

            if(erroMsg.includes('Este e-mail já está em uso.')){
                erroMsg = 'Este e-mail já está em uso. Tente outro ou faça login.';
            }else if(erroMsg.includes('Erro desconhecido')){
                erroMsg = 'Não foi possível completar o registro. Verifique a conexão com o servidor.'
            }
            console.error('Erro de registro: ', error);
            mensagemElement.textContent = erroMsg;
            mensagemElement.style.color = 'red'
        });
});