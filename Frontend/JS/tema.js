const themeToggle = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('theme');
const isLightTheme = savedTheme === 'light-theme';

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
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
        updateThemeIcon('dark');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light-theme');
        updateThemeIcon('light');
    }
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'light') {
        icon.className = 'ri-sun-line';
    } else {
        icon.className = 'ri-moon-line';
    }
} 