(() => {
  if (window.__inventoryAccountLoaded) return;
  window.__inventoryAccountLoaded = true;
  const initials = value => String(value || 'U').trim().split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toUpperCase();
  fetch('/api/auth/session', { credentials: 'same-origin' })
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      if (!data?.authenticated || !data.user) return;
      const user = data.user;
      document.querySelectorAll('.account-avatar').forEach(node => { node.textContent = initials(user.name); });
      const head = document.querySelector('.account-menu-head');
      if (head) {
        const strong = head.querySelector('strong');
        const small = head.querySelector('small');
        if (strong) strong.textContent = user.name || 'Usuário';
        if (small) small.textContent = user.email || 'Conta pessoal';
      }
      const triggerName = document.querySelector('.account-trigger-name');
      if (triggerName) triggerName.textContent = String(user.name || 'Usuário').split(/\s+/)[0];
      const profileButton = document.getElementById('accountProfileBtn');
      if (profileButton) profileButton.textContent = 'Meu perfil · ' + (user.name || 'Usuário');
    })
    .catch(() => {});
})();