document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    // Mapeamento de termos de pesquisa para URLs
    const searchMap = {
        // Páginas principais
        'home': '/Frontend/index.html',
        'início': '/Frontend/index.html',
        'inicio': '/Frontend/index.html',
        'dashboard': '/Frontend/Dashboard/',
        'produção': '/Frontend/Producoes/producao.html',
        'producao': '/Frontend/Producoes/producao.html',
        'relatórios': '/Frontend/Relatorios/index.html',
        'relatorios': '/Frontend/Relatorios/index.html',
        'usuário': '/Frontend/Login/login.html',
        'usuario': '/Frontend/Login/login.html',
        'user': '/Frontend/Login/login.html',
        'configurações': 'configuracoes.html',
        'configuracoes': 'configuracoes.html',
        'settings': 'configuracoes.html',
        
        // Termos relacionados aos cards
        'resumo': '/Frontend/Dashboard/',
        'resumo produção': '/Frontend/Dashboard/',
        'resumo producao': '/Frontend/Dashboard/',
        'vendas': '/Frontend/Relatorios/index.html',
        'itens vendidos': '/Frontend/Relatorios/index.html',
        'vendas itens': '/Frontend/Relatorios/index.html',
        
        // Logout
        'sair': '/Frontend/Login/login.html',
        'logout': '/Frontend/Login/login.html',
        'deslogar': '/Frontend/Login/login.html'
    };
    
    // Função para realizar a pesquisa e redirecionar
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            alert('Por favor, digite um termo para pesquisar.');
            return;
        }
        
        // Verificar se o termo existe no mapeamento
        if (searchMap[searchTerm]) {
            // Redirecionar para a página correspondente
            window.location.href = searchMap[searchTerm];
        } else {
            alert(`Não encontramos resultados para "${searchTerm}".\n\nTermos disponíveis:\n- home, início\n- dashboard\n- produção\n- relatórios\n- usuário\n- configurações\n- resumo\n- vendas\n- sair`);
        }
    }
    
    // Adicionar evento de clique no botão de pesquisa
    searchButton.addEventListener('click', performSearch);
    
    // Adicionar evento de pressionar Enter no campo de pesquisa
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});