document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    const icon = btn.querySelector('i');
  
    // carrega tema salvo
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
      document.body.classList.add('light-theme');
      icon.className = "ri-moon-line";
    }
  
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      icon.className = isLight ? "ri-moon-line" : "ri-sun-line";
    });
  });
  
  