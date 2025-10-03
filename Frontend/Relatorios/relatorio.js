// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        themeIcon.classList.replace('ri-sun-line', 'ri-moon-line');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');

        if (body.classList.contains('light-theme')) {
            themeIcon.classList.replace('ri-sun-line', 'ri-moon-line');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.replace('ri-moon-line', 'ri-sun-line');
            localStorage.setItem('theme', 'dark');
        }
    });

    const filterForm = document.querySelector('.filter-form');
    const searchButton = document.querySelector('.btn-primary');
    const clearButton = document.querySelector('.btn-secondary');

    clearButton.addEventListener('click', () => {
        filterForm.reset();
        alert('Filtros limpos!');
    });

    searchButton.addEventListener('click', () => {
        const filters = {
            visitante: document.getElementById('visitante').value,
            dataInicial: document.getElementById('data-inicial').value,
            dataFinal: document.getElementById('data-final').value,
            unidade: document.getElementById('unidade').value,
            tipoOcorrencia: document.getElementById('tipo-ocorrencia').value,
            modoExibicao: document.getElementById('modo-exibicao').value
        };
        
        console.log('Dados de busca:', filters);
        alert(`Buscando por: ${filters.visitante}\n(Veja o objeto completo no console do navegador)`);
    });
    
    const tableSearchInput = document.querySelector('.search-box input');
    const tableRows = document.querySelectorAll('tbody tr');

    tableSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        tableRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(searchTerm)) {
                row.style.display = ''; 
            } else {
                row.style.display = 'none'; 
            }
        });
    });

    const tableHeaders = document.querySelectorAll('thead th');

    tableHeaders.forEach((header, index) => {
        header.addEventListener('click', () => {
            const tbody = header.closest('table').querySelector('tbody');
            const rowsArray = Array.from(tbody.querySelectorAll('tr'));
            const isAscending = header.getAttribute('data-direction') === 'asc';

            rowsArray.sort((a, b) => {
                const aText = a.querySelectorAll('td')[index].textContent.trim();
                const bText = b.querySelectorAll('td')[index].textContent.trim();

                return aText.localeCompare(bText, undefined, { numeric: true }) * (isAscending ? -1 : 1);
            });

            tableHeaders.forEach(th => th.removeAttribute('data-direction'));

            header.setAttribute('data-direction', isAscending ? 'desc' : 'asc');

            tbody.innerHTML = '';
            rowsArray.forEach(row => tbody.appendChild(row));
        });
    });
    const actionButtons = document.querySelectorAll('.btn-toolbar, .pagination a');

    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            const actionName = e.target.textContent.trim();
            alert(`Funcionalidade "${actionName}" a ser implementada!`);
        });
    });
    const sessionTimeSpan = document.getElementById('session-time');
    let seconds = 0;

    setInterval(() => {
        seconds++;
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        
        if (sessionTimeSpan) {
            sessionTimeSpan.textContent = `Tempo Sessão: ${h}:${m}:${s}`;
        }
    }, 1000);

});