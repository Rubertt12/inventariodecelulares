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
  const localPreview = window.location.protocol === 'file:';
  if(new URLSearchParams(window.location.search).get('login')==='required') openModal('login');
  document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>openModal(button.dataset.open)));
  tabs.forEach(button=>button.addEventListener('click',()=>setTab(button.dataset.tab)));
  document.getElementById('closeModal').addEventListener('click',closeModal);
  modal.addEventListener('click',event=>{if(event.target===modal)closeModal()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeModal()});
  menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open))});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));
  document.getElementById('loginForm').addEventListener('submit',async event=>{
    event.preventDefault();
    if(localPreview){document.getElementById('loginError').textContent='A apresentação está funcionando. Para testar o login, abra o projeto pelo servidor local (npm start) ou pela versão publicada.';return;}
    const button=event.currentTarget.querySelector('button[type="submit"]');
    const error=document.getElementById('loginError');
    error.textContent='';button.disabled=true;button.textContent='Verificando...';
    try{
      const response=await fetch('/api/demo-login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({username:document.getElementById('username').value.trim(),password:document.getElementById('password').value})});
      const contentType=response.headers.get('content-type')||'';
      let data={};
      if(contentType.includes('application/json')){
        data=await response.json();
      }else{
        const responseText=await response.text();
        throw new Error(response.status===404
          ? 'A API de login não foi encontrada. Inicie o servidor com “npm start” e abra http://localhost:3000.'
          : 'O servidor não retornou JSON válido. Confirme se o backend está rodando em http://localhost:3000.');
      }
      if(!response.ok)throw new Error(data.message||'Não foi possível entrar.');
      window.location.assign('/app');
    }catch(err){error.textContent=err.message||'Falha ao conectar. Tente novamente.'}
    finally{button.disabled=false;button.innerHTML='Entrar na plataforma <span>→</span>'}
  });
  document.getElementById('registerForm').addEventListener('submit',event=>{
    event.preventDefault();
    document.getElementById('registerMessage').textContent='Cadastro demonstrativo: o envio de solicitações será ativado em uma próxima etapa.';
  });
  if(!localPreview){fetch('/api/demo-session',{credentials:'same-origin'}).then(r=>r.ok?r.json():null).then(data=>{if(data&&data.authenticated){document.querySelectorAll('[data-open="login"]').forEach(b=>{b.addEventListener('click',()=>window.location.assign('/app'),{once:true})})}}).catch(()=>{});}
})();