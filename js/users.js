/* Diretório de usuários: combina os vínculos históricos com cadastros manuais persistidos em usuarios.json. */
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  let manualUsers = [];
  let currentPage = 1;
  let pageSize = 20;
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
    manualUsers.forEach(user=>{const nome=String(user.nome||'').trim(),matricula=String(user.matricula||'').trim(),sourceMatricula=String(user.sourceMatricula||user.matricula||'').trim(),cc=String(user.cc||'').trim();if(!nome&&!matricula)return;byMatricula.set(sourceMatricula?'mat:'+norm(sourceMatricula):'nome:'+norm(nome),{nome,matricula,cc,vinculos:0,manual:true,sourceMatricula});});
    (Array.isArray(termosData)?termosData:[]).forEach(term=>{
      const nome=String(term.nome||term.nome_colaborador||'').trim(),matricula=String(term.matricula||'').trim(),cc=String(term.cc||term.centro_custo||'').trim();if(!nome&&!matricula)return;
      const key=matricula?'mat:'+norm(matricula):'nome:'+norm(nome),existing=byMatricula.get(key)||{nome,matricula,cc,vinculos:0,manual:false};
      if(!existing.manual){existing.nome=nome||existing.nome;existing.matricula=matricula||existing.matricula;existing.cc=cc||existing.cc;}existing.vinculos+=1;byMatricula.set(key,existing);
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
    const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize));
    if(currentPage>totalPages)currentPage=totalPages;
    const start=(currentPage-1)*pageSize;
    const pageUsers=filtered.slice(start,start+pageSize);
    $('usersTotal').textContent=String(users.length);$('usersResultsCount').textContent=filtered.length?(`Exibindo ${start+1}–${Math.min(start+pageSize,filtered.length)} de ${filtered.length} colaboradores`):'0 colaboradores';
    body.innerHTML=pageUsers.map(user=>'<tr><td><span class="users-name">'+esc(user.nome||'Nome não informado')+'</span></td><td><span class="users-matricula">'+esc(user.matricula||'—')+'</span></td><td><span class="users-cc">'+esc(user.cc||'Não informado')+'</span></td><td><span class="users-count">'+user.vinculos+' '+(user.vinculos===1?'vínculo':'vínculos')+'</span></td><td class="users-row-actions">'+'<button type="button" class="users-edit-button" data-edit-source="'+esc(user.sourceMatricula||user.matricula)+'" title="Editar colaborador" aria-label="Editar colaborador">✎</button>'+'<button type="button" class="users-use-button" data-user-matricula="'+esc(user.matricula)+'" data-user-name="'+esc(user.nome)+'" data-user-cc="'+esc(user.cc)+'">Usar no termo</button></td></tr>').join('');
    $('usersEmptyState').hidden=filtered.length>0;body.closest('.users-table-wrap').hidden=filtered.length===0;
    let pager=$('usersPagination');
    if(!pager){
      pager=document.createElement('div');pager.id='usersPagination';pager.className='users-pagination';
      const footer=document.querySelector('.users-table-footer');if(footer)footer.appendChild(pager);
    }
    pager.innerHTML=filtered.length>0?`<label class="users-page-size">Por página <select id="usersPageSize" aria-label="Registros por página"><option value="10" ${pageSize===10?'selected':''}>10</option><option value="20" ${pageSize===20?'selected':''}>20</option><option value="50" ${pageSize===50?'selected':''}>50</option><option value="100" ${pageSize===100?'selected':''}>100</option></select></label><div class="users-page-controls"><button type="button" data-users-page="prev" ${currentPage<=1?'disabled':''} aria-label="Página anterior">‹</button><span>Página <strong>${currentPage}</strong> de <strong>${totalPages}</strong></span><button type="button" data-users-page="next" ${currentPage>=totalPages?'disabled':''} aria-label="Próxima página">›</button></div>`:'';
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
      if(manual){manual.nome=nome;manual.cc=cc;}else manualUsers.push({nome,matricula,cc,sourceMatricula:matricula,createdAt:new Date().toISOString()});
    }else manualUsers.push({nome,matricula,cc,sourceMatricula:matricula,createdAt:new Date().toISOString()});
    try{await window.saveManualUsersFile();$('userAddForm').reset();renderUsersView();notify('Usuário cadastrado com sucesso!','success');}
    catch(error){console.error(error);notify(error.message||'Não foi possível salvar o usuário.','error');}
  }
  document.addEventListener('submit',event=>{if(event.target?.id==='userAddForm')addUser(event);});
  document.addEventListener('input',event=>{if(event.target?.id==='usersSearch'){currentPage=1;renderUsersView();}});
  document.addEventListener('change',event=>{
    if(event.target?.id==='usersCostCenterFilter'){currentPage=1;renderUsersView();}
    if(event.target?.id==='usersPageSize'){pageSize=Number(event.target.value)||20;currentPage=1;renderUsersView();}
  });
  document.addEventListener('click',event=>{
    const pageButton=event.target.closest('[data-users-page]');if(!pageButton||pageButton.disabled)return;
    currentPage+=pageButton.dataset.usersPage==='next'?1:-1;renderUsersView();
  });
  function openEditUser(user){
    if(!dirHandle){notify('Conecte a pasta de dados do inventário antes de editar usuários.','warning');return;}
    let modal=$('editUserModal');
    if(!modal){
      modal=document.createElement('div');modal.id='editUserModal';modal.className='users-edit-backdrop';
      modal.innerHTML='<section class="users-edit-dialog" role="dialog" aria-modal="true" aria-labelledby="editUserTitle"><header><div><small>CADASTRO DE COLABORADOR</small><h2 id="editUserTitle">Editar usuário</h2></div><button type="button" data-edit-close aria-label="Fechar">×</button></header><form id="editUserForm"><label>Nome completo *<input id="editUserName" name="nome" maxlength="140" required autocomplete="off"></label><label>Matrícula *<input id="editUserMatricula" name="matricula" maxlength="50" required autocomplete="off"></label><label>Centro de custo (CC)<input id="editUserCC" name="cc" maxlength="80" autocomplete="off"></label><footer><button type="button" class="users-edit-cancel" data-edit-close>Cancelar</button><button type="submit" class="users-edit-save">Salvar alterações</button></footer></form></section>';
      document.body.appendChild(modal);
      modal.addEventListener('click',event=>{if(event.target===modal||event.target.closest('[data-edit-close]'))modal.hidden=true;});
      modal.querySelector('#editUserForm').addEventListener('submit',async event=>{
        event.preventDefault();
        const original=modal.dataset.originalMatricula||'',nome=$('editUserName').value.trim(),matricula=$('editUserMatricula').value.trim(),cc=$('editUserCC').value.trim();
        if(!nome||!matricula){notify('Nome e matrícula são obrigatórios.','warning');return;}
        const source=modal.dataset.originalSource||original;
        const duplicate=manualUsers.some(item=>norm(item.sourceMatricula||item.matricula)!==norm(source)&&norm(item.matricula)===norm(matricula));
        const termDuplicate=(Array.isArray(termosData)?termosData:[]).some(item=>norm(item.matricula)===norm(matricula)&&norm(item.matricula)!==norm(source));
        if(duplicate||termDuplicate){notify('Já existe outro colaborador com essa matrícula.','warning');return;}
        let target=manualUsers.find(item=>norm(item.sourceMatricula||item.matricula)===norm(source));
        const created=!target;
        if(!target){target={sourceMatricula:source,createdAt:new Date().toISOString()};manualUsers.push(target);}
        const previous={...target};Object.assign(target,{nome,matricula,cc,sourceMatricula:source});
        try{await window.saveManualUsersFile();modal.hidden=true;currentPage=1;renderUsersView();notify('Cadastro do colaborador atualizado!','success');}
        catch(error){if(created)manualUsers=manualUsers.filter(item=>item!==target);else Object.assign(target,previous);console.error(error);notify(error.message||'Não foi possível salvar as alterações.','error');}
      });
    }
    modal.dataset.originalMatricula=user.matricula||'';modal.dataset.originalSource=user.sourceMatricula||user.matricula||'';$('editUserName').value=user.nome||'';$('editUserMatricula').value=user.matricula||'';$('editUserCC').value=user.cc||'';modal.hidden=false;$('editUserName').focus();
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('.users-edit-button');if(!button)return;
    const source=button.dataset.editSource||'';const user=getUsers().find(item=>norm(item.sourceMatricula||item.matricula)===norm(source));if(user)openEditUser(user);
  });
  document.addEventListener('click',event=>{
    const button=event.target.closest('.users-use-button');if(!button)return;
    switchView('termos');
    const name=$('inputTermoNome'),matricula=$('inputTermoMatricula'),cc=$('inputTermoCC');
    if(name)name.value=button.dataset.userName||'';if(matricula)matricula.value=button.dataset.userMatricula||'';if(cc)cc.value=button.dataset.userCc||'';
    name?.focus();notify('Dados do colaborador preenchidos no formulário de termo.','success');
  });
  window.renderUsersView=renderUsersView;
})();
