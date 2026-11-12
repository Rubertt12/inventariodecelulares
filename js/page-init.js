if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => console.log('Service Worker registrado com sucesso:', registration.scope))
                .catch(err => console.error('Falha no registro do Service Worker:', err));
        });
    }

(() => {
 const panel=document.getElementById('stockCollectorPanel'),toggle=document.getElementById('btnToggleCollector'),close=document.getElementById('btnCloseCollector');
 if(!panel||!toggle||!close)return;
 const setOpen=open=>{panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Coletor aberto':'Abrir coletor';if(open)setTimeout(()=>panel.scrollIntoView({behavior:'smooth',block:'nearest'}),80)};
 toggle.addEventListener('click',()=>setOpen(panel.hidden));close.addEventListener('click',()=>setOpen(false));
})();