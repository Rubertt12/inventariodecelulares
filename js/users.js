/* Diretório de usuários: a fonte de verdade é o histórico persistido em termos.txt. */
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  const norm = value => String(value ?? '').trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function getUsers(){
    const byMatricula = new Map();
    (Array.isArray(termosData) ? termosData : []).forEach(term => {
      const name=String(term.nome||term.nome_colaborador||'').trim();
      const matricula=String(term.matricula||'').trim();
      const cc=String(term.cc||term.centro_custo||'').trim();
      if(!name&&!matricula)return;
      const key=matricula?'mat:'+norm(matricula):'nome:'+norm(name);
      const existing=byMatricula.get(key)||{nome:name,matricula,cc,vinculos:0};
      existing.nome=name||existing.nome;existing.matricula=matricula||existing.matricula;existing.cc=cc||existing.cc;existing.vinculos+=1;
      byMatricula.set(key,existing);
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
  }
  document.addEventListener('input',event=>{if(event.target?.id==='usersSearch')renderUsersView();});
  document.addEventListener('change',event=>{if(event.target?.id==='usersCostCenterFilter')renderUsersView();});
  document.addEventListener('click',event=>{
    const button=event.target.closest('.users-use-button');if(!button)return;
    switchView('termos');
    const name=$('inputTermoNome'),matricula=$('inputTermoMatricula'),cc=$('inputTermoCC');
    if(name)name.value=button.dataset.userName||'';if(matricula)matricula.value=button.dataset.userMatricula||'';if(cc)cc.value=button.dataset.userCc||'';
    name?.focus();if(typeof showCustomAlert==='function')showCustomAlert('Dados do colaborador preenchidos no formulário de termo.','success');
  });
  window.renderUsersView=renderUsersView;
})();
