/* Diretório de usuários: combina os vínculos históricos com cadastros manuais persistidos em usuarios.json. */
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  let manualUsers = [];
  const norm = value => String(value ?? '').trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const notify = (message,type='success') => { if(typeof showCustomAlert==='function')showCustomAlert(message,type); else window.alert(message); };
  window.loadManualUsersFile = async function(){
    manualUsers=[];if(!dirHandle)return;
    try{const handle=await dirHandle.getFileHandle('usuarios.json',{create:true}),file=await handle.getFile(),content=await file.text();if(content.trim()){const parsed=JSON.parse(content);manualUsers=Array.isArray(parsed)?parsed.filter(user=>user&&typeof user==='object'):[];}}
    catch(error){console.error('Não foi possível carregar usuarios.json:',error);notify('Não foi possível carregar os cadastros manuais de usuários.','error');}
    renderUsersView();
  };
  window.saveManualUsersFile = async function(){
    if(!dirHandle)throw new Error('Conecte a pasta de dados do inventário antes de cadastrar usuários.');
    const handle=await dirHandle.getFileHandle('usuarios.json',{create:true}),writable=await handle.createWritable();
    await writable.write(JSON.stringify(manualUsers,null,2));await writable.close();
  };
  function getUsers(){
    const byMatricula=new Map();
    manualUsers.forEach(user=>{const nome=String(user.nome||'').trim(),matricula=String(user.matricula||'').trim(),cc=String(user.cc||'').trim();if(!nome&&!matricula)return;byMatricula.set(matricula?'mat:'+norm(matricula):'nome:'+norm(nome),{nome,matricula,cc,vinculos:0,manual:true});});
    (Array.isArray(termosData)?termosData:[]).forEach(term=>{
      const nome=String(term.nome||term.nome_colaborador||'').trim(),matricula=String(term.matricula||'').trim(),cc=String(term.cc||term.centro_custo||'').trim();if(!nome&&!matricula)return;
      const key=matricula?'mat:'+norm(matricula):'nome:'+norm(nome),existing=byMatricula.get(key)||{nome,matricula,cc,vinculos:0,manual:false};
      existing.nome=nome||existing.nome;existing.matricula=matricula||existing.matricula;existing.cc=cc||existing.cc;existing.vinculos+=1;byMatricula.set(key,existing);
    });
    return [...byMatricula.values()].sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR',{sensitivity:'base'}));
  }
  function renderUsersView(){
    const body=$('usersTableBody');if(!body)return;
    const users=getUsers(),search=norm($('usersSearch')?.value||''),selectedCC=$('usersCostCenterFilter')?.value||'';
    const costCenters=[...new Set(users.map(user=>user.cc).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true,sensitivity:'base'}));
    const filter=$('usersCostCenterFilter');
    if(filter){const current=filter.value;filter.innerHTML='<option value="">Todos os centros de custo</option>'+costCenters.map(cc=>'<option value="'+esc(cc)+'">'+esc(cc)+'</option>').join('');filter.value=costCenters.includes(current)?current:'';}
    const filtered=users.filter(user=>(!search||norm([user.nome,user.matricula,user.cc].join(' ')).includes(search))&&(!selectedCC||user.cc===selectedCC));
    $('usersTotal').textContent=String(users.length);$('usersResultsCount').textContent=filtered.length+' de '+users.length+' colaboradores';
    body.innerHTML=filtered.map(user=>'<tr><td><span class="users-name">'+esc(user.nome||'Nome não informado')+'</span></td><td><span class="users-matricula">'+esc(user.matricula||'—')+'</span></td><td><span class="users-cc">'+esc(user.cc||'Não informado')+'</span></td><td><span class="users-count">'+user.vinculos+' '+(user.vinculos===1?'vínculo':'vínculos')+'</span></td><td><button type="button" class="users-use-button" data-user-matricula="'+esc(user.matricula)+'" data-user-name="'+esc(user.nome)+'" data-user-cc="'+esc(user.cc)+'">Usar no termo</button></td></tr>').join('');
    $('usersEmptyState').hidden=filtered.length>0;body.closest('.users-table-wrap').hidden=filtered.length===0;
    const hint=$('usersSaveHint');if(hint)hint.textContent=dirHandle?'Cadastros manuais salvos na pasta conectada do inventário (usuarios.json).':'Conecte a pasta de dados do inventário para salvar novos cadastros.';
  }
  async function addUser(event){
    event.preventDefault();
    const nome=$('newUserName')?.value.trim()||'',matricula=$('newUserMatricula')?.value.trim()||'',cc=$('newUserCC')?.value.trim()||'';
    if(!nome||!matricula){notify('Informe o nome e a matrícula do colaborador.','warning');return;}
    if(!dirHandle){notify('Conecte primeiro a pasta de dados do inventário para salvar o cadastro.','warning');return;}
    const existing=manualUsers.find(user=>norm(user.matricula)===norm(matricula))||(Array.isArray(termosData)?termosData:[]).find(term=>norm(term.matricula)===norm(matricula));
    if(existing){
      if(!window.confirm('Essa matrícula já existe. Deseja atualizar o nome e o centro de custo do cadastro?'))return;
      const manual=manualUsers.find(user=>norm(user.matricula)===norm(matricula));
      if(manual){manual.nome=nome;manual.cc=cc;}else manualUsers.push({nome,matricula,cc,createdAt:new Date().toISOString()});
    }else manualUsers.push({nome,matricula,cc,createdAt:new Date().toISOString()});
    try{await window.saveManualUsersFile();$('userAddForm').reset();renderUsersView();notify('Usuário cadastrado com sucesso!','success');}
    catch(error){console.error(error);notify(error.message||'Não foi possível salvar o usuário.','error');}
  }
  document.addEventListener('submit',event=>{if(event.target?.id==='userAddForm')addUser(event);});
  document.addEventListener('input',event=>{if(event.target?.id==='usersSearch')renderUsersView();});
  document.addEventListener('change',event=>{if(event.target?.id==='usersCostCenterFilter')renderUsersView();});
  document.addEventListener('click',event=>{
    const button=event.target.closest('.users-use-button');if(!button)return;
    switchView('termos');
    const name=$('inputTermoNome'),matricula=$('inputTermoMatricula'),cc=$('inputTermoCC');
    if(name)name.value=button.dataset.userName||'';if(matricula)matricula.value=button.dataset.userMatricula||'';if(cc)cc.value=button.dataset.userCc||'';
    name?.focus();notify('Dados do colaborador preenchidos no formulário de termo.','success');
  });
  window.renderUsersView=renderUsersView;
})();
