document.addEventListener('DOMContentLoaded', () => {
    const sampleData = [
        { nome: 'Aldenor Lemos Silva', responsavel: 'TARCISIO PEREIRA', docs: 'OAB: 12345', data: '2023-04-14', userEntrada: 'AMEDES ELEUTERIO', horaEntrada: '10:15:57', userSaida: 'AMEDES ELEUTERIO', horaSaida: '10:16:42', unidade: 'Matriz', ocorrencia: 'Entrada' },
        { nome: 'Beatriz Costa', responsavel: 'MARIA OLIVEIRA', docs: 'CPF: 111.222.333-44', data: '2023-04-15', userEntrada: 'JOANA SILVA', horaEntrada: '09:30:10', userSaida: 'JOANA SILVA', horaSaida: '11:00:00', unidade: 'Filial Sul', ocorrencia: 'Saída' },
        { nome: 'Carlos de Andrade', responsavel: 'JOÃO SANTOS', docs: 'RG: 55.666.777-8', data: '2023-04-15', userEntrada: 'CARLOS ALBERTO', horaEntrada: '14:00:15', userSaida: 'CARLOS ALBERTO', horaSaida: '15:30:20', unidade: 'Filial Norte', ocorrencia: 'Entrada' },
        { nome: 'Daniela Ferreira', responsavel: 'TARCISIO PEREIRA', docs: 'CNH: 987654321', data: '2023-04-16', userEntrada: 'AMEDES ELEUTERIO', horaEntrada: '08:45:00', userSaida: 'AMEDES ELEUTERIO', horaSaida: '17:00:30', unidade: 'Matriz', ocorrencia: 'Saída' },
        { nome: 'Eduardo Martins', responsavel: 'MARIA OLIVEIRA', docs: 'CPF: 222.333.444-55', data: '2023-04-17', userEntrada: 'JOANA SILVA', horaEntrada: '11:20:10', userSaida: 'JOANA SILVA', horaSaida: '12:00:00', unidade: 'Filial Sul', ocorrencia: 'Entrada' },
        { nome: 'Fernanda Gonçalves', responsavel: 'TARCISIO PEREIRA', docs: 'RG: 12.345.678-9', data: '2023-04-18', userEntrada: 'CARLOS ALBERTO', horaEntrada: '16:10:05', userSaida: 'CARLOS ALBERTO', horaSaida: '18:05:00', unidade: 'Filial Norte', ocorrencia: 'Saída' },
        { nome: 'Gustavo Lima', responsavel: 'JOÃO SANTOS', docs: 'OAB: 54321', data: '2023-04-19', userEntrada: 'AMEDES ELEUTERIO', horaEntrada: '07:55:00', userSaida: 'AMEDES ELEUTERIO', horaSaida: '16:30:00', unidade: 'Matriz', ocorrencia: 'Entrada' },
        { nome: 'Heloisa Ribeiro', responsavel: 'MARIA OLIVEIRA', docs: 'CPF: 333.444.555-66', data: '2023-04-20', userEntrada: 'JOANA SILVA', horaEntrada: '13:00:00', userSaida: 'JOANA SILVA', horaSaida: '14:30:45', unidade: 'Filial Sul', ocorrencia: 'Saída' },
        { nome: 'Igor Nascimento', responsavel: 'JOÃO SANTOS', docs: 'RG: 98.765.432-1', data: '2023-04-21', userEntrada: 'CARLOS ALBERTO', horaEntrada: '10:10:10', userSaida: 'CARLOS ALBERTO', horaSaida: '11:11:11', unidade: 'Filial Norte', ocorrencia: 'Entrada' },
        { nome: 'Juliana Campos', responsavel: 'TARCISIO PEREIRA', docs: 'CNH: 123123123', data: '2023-04-22', userEntrada: 'AMEDES ELEUTERIO', horaEntrada: '15:45:30', userSaida: 'AMEDES ELEUTERIO', horaSaida: '16:00:00', unidade: 'Matriz', ocorrencia: 'Saída' },
    ];

    let currentData = [...sampleData];
    let currentPage = 1;
    const itemsPerPage = 5;

    const columns = {
        nome: { label: 'Nome Completo', visible: true },
        responsavel: { label: 'Responsável Cadastro', visible: true },
        docs: { label: 'Documentos', visible: true },
        data: { label: 'Data', visible: true },
        userEntrada: { label: 'Usuário Entrada', visible: true },
        horaEntrada: { label: 'Horário Entrada', visible: true },
        userSaida: { label: 'Usuário Saída', visible: true },
        horaSaida: { label: 'Horário Saída', visible: true },
    };
    
    function populateSelects() {
        const unidades = [...new Set(sampleData.map(item => item.unidade))];
        const ocorrencias = [...new Set(sampleData.map(item => item.ocorrencia))];

        const unidadeSelect = document.getElementById('unidade');
        unidades.forEach(u => unidadeSelect.innerHTML += `<option>${u}</option>`);
        
        const ocorrenciaSelect = document.getElementById('tipo-ocorrencia');
        ocorrencias.forEach(o => ocorrenciaSelect.innerHTML += `<option>${o}</option>`);
    }

    function renderTable() {
        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';
        
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = currentData.slice(start, end);

        if (pageData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${Object.keys(columns).length}" style="text-align:center;">Nenhum registro encontrado.</td></tr>`;
        } else {
            pageData.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td data-col="nome">${item.nome}</td>
                    <td data-col="responsavel">${item.responsavel}</td>
                    <td data-col="docs">${item.docs}</td>
                    <td data-col="data">${item.data.split('-').reverse().join('/')}</td>
                    <td data-col="userEntrada">${item.userEntrada}</td>
                    <td data-col="horaEntrada">${item.data.split('-').reverse().join('/')} ${item.horaEntrada}</td>
                    <td data-col="userSaida">${item.userSaida}</td>
                    <td data-col="horaSaida">${item.data.split('-').reverse().join('/')} ${item.horaSaida}</td>
                `;
                tbody.appendChild(tr);
            });
        }
        
        updateVisibleColumns();
        updatePageInfo();
        renderPagination();
    }
    
    function updatePageInfo() {
        const pageInfoSpan = document.querySelector('.page-info span:last-child');
        const start = currentData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
        const end = Math.min(currentPage * itemsPerPage, currentData.length);
        pageInfoSpan.textContent = `Mostrando de ${start} até ${end} de ${currentData.length} registros`;
    }

    function renderPagination() {
        const paginationContainer = document.querySelector('.pagination');
        const totalPages = Math.ceil(currentData.length / itemsPerPage) || 1;
        paginationContainer.innerHTML = '';

        const createLink = (text, page, isDisabled = false, isActive = false) => {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = text;
            if (isDisabled) link.classList.add('disabled');
            if (isActive) link.classList.add('active');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (!isDisabled) {
                    currentPage = page;
                    renderTable();
                }
            });
            return link;
        };

        paginationContainer.appendChild(createLink('Anterior', currentPage - 1, currentPage === 1));
        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.appendChild(createLink(i, i, false, i === currentPage));
        }
        paginationContainer.appendChild(createLink('Próxima', currentPage + 1, currentPage === totalPages));
    }
    function applyMainFilter() {
        const filters = {
            visitante: document.getElementById('visitante').value.toLowerCase(),
            dataInicial: document.getElementById('data-inicial').value,
            dataFinal: document.getElementById('data-final').value,
            unidade: document.getElementById('unidade').value,
            ocorrencia: document.getElementById('tipo-ocorrencia').value,
        };
        
        currentData = sampleData.filter(item => {
            const itemDate = new Date(item.data);
            const startDate = filters.dataInicial ? new Date(filters.dataInicial) : null;
            const endDate = filters.dataFinal ? new Date(filters.dataFinal) : null;
            
            const nameMatch = item.nome.toLowerCase().includes(filters.visitante);
            const dateMatch = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
            const unidadeMatch = (filters.unidade === 'Todas' || item.unidade === filters.unidade);
            const ocorrenciaMatch = (filters.ocorrencia === 'Ambas' || item.ocorrencia === filters.ocorrencia);

            return nameMatch && dateMatch && unidadeMatch && ocorrenciaMatch;
        });

        currentPage = 1;
        renderTable();
    }
    
    function sortTable(columnIndex, th) {
        const isAscending = th.getAttribute('data-direction') === 'asc';
        const direction = isAscending ? -1 : 1;
        const prop = Object.keys(columns)[columnIndex];

        currentData.sort((a, b) => a[prop].localeCompare(b[prop], undefined, { numeric: true }) * direction);

        document.querySelectorAll('thead th').forEach(t => t.removeAttribute('data-direction'));
        th.setAttribute('data-direction', isAscending ? 'desc' : 'asc');
        renderTable();
    }

    function updateVisibleColumns() {
        for (const key in columns) {
            const visible = columns[key].visible;
            document.querySelectorAll(`[data-col="${key}"], thead th:nth-child(${Object.keys(columns).indexOf(key) + 1})`)
                .forEach(el => el.style.display = visible ? '' : 'none');
        }
    }

    function copyToClipboard() {
        const text = [
            Object.keys(columns).filter(k => columns[k].visible).map(k => columns[k].label).join('\t'),
            ...currentData.map(item => Object.keys(columns).filter(k => columns[k].visible).map(key => item[key]).join('\t'))
        ].join('\n');
        
        navigator.clipboard.writeText(text).then(() => alert('Dados copiados para a área de transferência!'));
    }

    function exportToCSV() {
        const headers = Object.keys(columns).filter(k => columns[k].visible).map(k => columns[k].label).join(',');
        const rows = currentData.map(item => Object.keys(columns).filter(k => columns[k].visible).map(key => `"${item[key]}"`).join(','));
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\r\n');
        
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "relatorio.csv");
        link.click();
    }
    
    function exportToPDF() {
        window.print();
    }

    function showColumnToggleMenu(button) {
        const oldMenu = document.querySelector('.column-toggle-menu');
        if (oldMenu) return oldMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'column-toggle-menu';
        menu.style.cssText = 'position:absolute; background-color: var(--card); border: 1px solid #444; padding: 10px; border-radius: 5px; z-index: 100;';
        
        for (const key in columns) {
            menu.innerHTML += `
                <div>
                    <input type="checkbox" id="col-${key}" data-key="${key}" ${columns[key].visible ? 'checked' : ''}>
                    <label for="col-${key}">${columns[key].label}</label>
                </div>`;
        }
        
        menu.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                columns[e.target.dataset.key].visible = e.target.checked;
                updateVisibleColumns();
            }
        });

        document.body.appendChild(menu);
        const btnRect = button.getBoundingClientRect();
        menu.style.top = `${btnRect.bottom + window.scrollY}px`;
        menu.style.left = `${btnRect.left + window.scrollX}px`;

        setTimeout(() => document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && e.target !== button) menu.remove();
        }, { once: true }), 0);
    }

    function groupData() {
        const columnLabels = Object.values(columns).map(c => c.label);
        const choice = prompt(`Por qual coluna você deseja agrupar (ordenar)?\nDigite o número:\n\n${columnLabels.map((l, i) => `${i + 1}: ${l}`).join('\n')}`);
        
        const index = parseInt(choice, 10) - 1;
        if (!isNaN(index) && index >= 0 && index < columnLabels.length) {
            const th = document.querySelectorAll('thead th')[index];
            if (th.getAttribute('data-direction') !== 'asc') th.setAttribute('data-direction', 'desc');
            sortTable(index, th);
            alert(`Dados agrupados por "${columnLabels[index]}"!`);
        } else if (choice) {
            alert('Seleção inválida.');
        }
    }

    function handleLogout(e) {
        e.preventDefault();
        if (confirm('Você tem certeza que deseja sair?')) {
            alert('Você foi desconectado.');
            
        }
    }

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        themeToggle.querySelector('i').className = isLight ? 'ri-moon-line' : 'ri-sun-line';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.querySelector('i').className = 'ri-moon-line';
    }
    
    let seconds = 0;
    setInterval(() => {
        seconds++;
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        const sessionSpan = document.querySelector('.footer span:last-child');
        if (sessionSpan) sessionSpan.textContent = `Tempo Sessão: ${h}:${m}:${s}`;
    }, 1000);

    document.querySelector('.btn-primary').addEventListener('click', applyMainFilter);
    document.querySelector('.btn-secondary').addEventListener('click', () => {
        document.querySelector('.filter-form').reset();
        currentData = [...sampleData];
        renderTable();
    });
    document.querySelector('.search-box input').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        currentData = sampleData.filter(item => JSON.stringify(item).toLowerCase().includes(searchTerm));
        currentPage = 1;
        renderTable();
    });
    document.querySelectorAll('thead th').forEach((header, index) => {
        header.addEventListener('click', () => sortTable(index, header));
    });

    const toolbarActionMap = {
        'copiar': copyToClipboard, 'excel': exportToCSV, 'csv': exportToCSV,
        'pdf': exportToPDF, 'exibindo colunas': showColumnToggleMenu, 'agrupar': groupData,
    };
    document.querySelectorAll('.btn-toolbar').forEach(button => {
        const action = button.textContent.trim().toLowerCase();
        if (toolbarActionMap[action]) {
            button.addEventListener('click', (e) => toolbarActionMap[action](e.target));
        }
    });

    document.querySelector('.logout-link').addEventListener('click', handleLogout);
    document.querySelector('#logout-theme a').addEventListener('click', handleLogout);

    populateSelects();
    renderTable();
});