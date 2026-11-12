(() => {
  const modal=document.getElementById('authModal');
  const loginPanel=document.getElementById('loginPanel');
  const registerPanel=document.getElementById('registerPanel');
  const tabs=[...document.querySelectorAll('.auth-tab')];
  const nav=document.getElementById('mainNav');
  const menuButton=document.getElementById('mobileMenu');
  function setTab(tab){
    const isLogin=tab==='login';
    loginPanel.hidden=!isLogin; registerPanel.hidden=isLogin;
    tabs.forEach(button=>button.classList.toggle('active',button.dataset.tab===tab));
    document.getElementById('authTitle').textContent=isLogin?'Acesse sua plataforma':'Solicitar cadastro';
    document.getElementById('loginError').textContent='';
  }
  function openModal(tab='login'){setTab(tab);modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>document.getElementById(tab==='login'?'username':'regName').focus(),80)}
  function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
  document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>openModal(button.dataset.open)));
  tabs.forEach(button=>button.addEventListener('click',()=>setTab(button.dataset.tab)));
  document.getElementById('closeModal').addEventListener('click',closeModal);
  modal.addEventListener('click',event=>{if(event.target===modal)closeModal()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeModal()});
  menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open))});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));
  document.getElementById('loginForm').addEventListener('submit',async event=>{
    event.preventDefault();
    const button=event.currentTarget.querySelector('button[type="submit"]');
    const error=document.getElementById('loginError');
    error.textContent='';button.disabled=true;button.textContent='Verificando...';
    try{
      const response=await fetch('/api/demo-login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({username:document.getElementById('username').value.trim(),password:document.getElementById('password').value})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.message||'Não foi possível entrar.');
      window.location.assign('/app');
    }catch(err){error.textContent=err.message||'Falha ao conectar. Tente novamente.'}
    finally{button.disabled=false;button.innerHTML='Entrar na plataforma <span>→</span>'}
  });
  document.getElementById('registerForm').addEventListener('submit',event=>{
    event.preventDefault();
    document.getElementById('registerMessage').textContent='Cadastro demonstrativo: o envio de solicitações será ativado em uma próxima etapa.';
  });
  fetch('/api/demo-session',{credentials:'same-origin'}).then(r=>r.ok?r.json():null).then(data=>{if(data&&data.authenticated){document.querySelectorAll('[data-open="login"]').forEach(b=>{b.addEventListener('click',()=>window.location.assign('/app'),{once:true})})}}).catch(()=>{});
})();