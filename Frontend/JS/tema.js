const themeToggle = document.getElementById('theme-toggle');

// Verifica se há um tema salvo no localStorage
const savedTheme = localStorage.getItem('theme');
const isLightTheme = savedTheme === 'light-theme';

// Aplica o tema salvo ou mantém o tema escuro como padrão
if (isLightTheme) {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    updateThemeIcon('light');
} else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    updateThemeIcon('dark');
}

themeToggle.addEventListener('click', () => {
    const isCurrentlyLight = document.body.classList.contains('light-theme');
    
    if (isCurrentlyLight) {
        // Muda para tema escuro
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
        updateThemeIcon('dark');
    } else {
        // Muda para tema claro
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light-theme');
        updateThemeIcon('light');
    }
});

// Função para atualizar o ícone do tema
function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'light') {
        icon.className = 'ri-moon-line'; // Sol para tema claro
    } else {
        icon.className = 'ri-sun-line'; // Lua para tema escuro
    }
} 