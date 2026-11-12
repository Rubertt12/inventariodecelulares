function applyThemeFromStorage() {
        try {
          const settingsJSON = localStorage.getItem('appSettings');
          if (settingsJSON) {
            const settings = JSON.parse(settingsJSON);
            if (settings && settings.theme === 'dark') {
              document.documentElement.classList.add('dark-mode');
            } else {
              document.documentElement.classList.remove('dark-mode');
            }
          }
        } catch (e) {
          console.error("Falha ao aplicar tema do localStorage:", e);
        }
      }

      // Aplica o tema no carregamento inicial para evitar flash de conteúdo
      applyThemeFromStorage();

      // Ouve por mudanças no localStorage feitas por outras abas (sincronização em tempo real)
      window.addEventListener('storage', (event) => {
        if (event.key === 'appSettings') {
          applyThemeFromStorage();
        }
      });
