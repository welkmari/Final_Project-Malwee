// Exemplo básico de tema.js - adapte ao seu código real
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Carrega o tema salvo no localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
      body.classList.add(savedTheme);
      if (savedTheme === 'light-mode') {
          themeToggle.innerHTML = '<i class="ri-moon-line"></i>'; // Ícone de lua para tema claro
      } else {
          themeToggle.innerHTML = '<i class="ri-sun-line"></i>'; // Ícone de sol para tema escuro
      }
  } else {
      // Padrão para modo escuro se nada for salvo
      body.classList.add('dark-mode');
      themeToggle.innerHTML = '<i class="ri-sun-line"></i>';
  }

  themeToggle.addEventListener('click', () => {
      if (body.classList.contains('light-mode')) {
          body.classList.remove('light-mode');
          body.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark-mode');
          themeToggle.innerHTML = '<i class="ri-sun-line"></i>';
      } else {
          body.classList.remove('dark-mode');
          body.classList.add('light-mode');
          localStorage.setItem('theme', 'light-mode');
          themeToggle.innerHTML = '<i class="ri-moon-line"></i>';
      }
  });
});