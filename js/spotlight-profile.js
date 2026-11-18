(function(){
'use strict';
const $=id=>document.getElementById(id),backdrop=$('spotlightBackdrop'),input=$('spotlightInput'),results=$('spotlightResults'),filters=$('spotlightFilters');
let field='all',status='',selected=0,visible=[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function render(){
 const q=input.value.trim(), keys=field==='all'?['modelo','imei1','imei2','sn','localidade']:[field];
 visible=(Array.isArray(stockData)?stockData:[]).filter(item=>{
  const match=keys.some(k=>norm(item[k]).includes(norm(q)));
  const st=item.status||'Disponível';
  return match&&(!status||st===status);
 }).slice(0,30);
 $('spotlightResultCount').textContent=visible.length+' aparelhos';$('spotlightTitle').textContent=q?'Resultados da busca':'Sugestões do inventário';results.innerHTML='';
 if(!visible.length){results.innerHTML='<div class="spotlight-empty">Nenhum aparelho encontrado. Tente outro modelo, IMEI ou número de série.</div>';return;}
 visible.forEach((item,i)=>{
  const s=item.status||'Disponível',b=document.createElement('button');b.type='button';b.className='spotlight-result'+(i===selected?' selected':'');
  const ico=document.createElement('span');ico.className='spotlight-result-icon';ico.textContent='▣';
  const main=document.createElement('span');main.className='spotlight-result-main';
  const title=document.createElement('strong');title.textContent=item.modelo||'Aparelho sem modelo';
  const sub=document.createElement('small');sub.textContent=(item.localidade||'Sem localidade')+' · IMEI 1: '+(item.imei1||'—')+' · SN: '+(item.sn||'—');main.append(title,sub);
  const badge=document.createElement('span');badge.className='spotlight-result-status '+(s==='Entregue'?'is-delivered':'is-available');badge.textContent=s;b.append(ico,main,badge);
  b.addEventListener('click',()=>openResult(item));results.appendChild(b);
 });
}
function close(){backdrop.hidden=true;}
function openResult(item){close();switchView('estoque');const search=$('inputSearchStock');if(search){search.value=String(item.imei1||item.imei2||item.sn||item.modelo||'');search.dispatchEvent(new Event('input',{bubbles:true}));}const all=document.querySelector('#locationFilterGroup [data-filter="Todos"]');if(all&&typeof activateFilter==='function')activateFilter(all);}
window.openSpotlight=function(){backdrop.hidden=false;field='all';status='';selected=0;input.value='';filters.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.field==='all'));render();setTimeout(()=>input.focus(),30);};
$('spotlightClose').addEventListener('click',close);backdrop.addEventListener('click',e=>{if(e.target===backdrop)close();});input.addEventListener('input',()=>{selected=0;render();});
filters.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.field){field=b.dataset.field;filters.querySelectorAll('[data-field]').forEach(x=>x.classList.toggle('active',x===b));}if(b.dataset.status){status=status===b.dataset.status?'':b.dataset.status;filters.querySelectorAll('[data-status]').forEach(x=>x.classList.toggle('active',x.dataset.status===status));}selected=0;render();});
input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();selected=Math.min(selected+1,visible.length-1);render();}if(e.key==='ArrowUp'){e.preventDefault();selected=Math.max(0,selected-1);render();}if(e.key==='Enter'&&visible[selected])openResult(visible[selected]);});
$('spotlightGoStock').addEventListener('click',()=>{close();switchView('estoque');setTimeout(()=>$('inputSearchStock').focus(),100);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!backdrop.hidden)close();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();window.openSpotlight();}});
let profileName=localStorage.getItem('inventoryProfileName')||'Usuário';const pop=$('profilePopover'),nameInput=$('profileNameInput');
function updateProfile(){const initial=profileName.trim().charAt(0).toUpperCase()||'U';['sidebarProfileName','popoverProfileName'].forEach(id=>{if($(id))$(id).textContent=profileName;});['sidebarProfileAvatar','mobileProfileAvatar','popoverProfileAvatar'].forEach(id=>{if($(id))$(id).textContent=initial;});if(nameInput)nameInput.value=profileName;}
function toggle(anchor){const opening=pop.hidden;pop.hidden=!opening;if(opening){const r=anchor.getBoundingClientRect();pop.style.top=Math.min(r.bottom+8,innerHeight-220)+'px';pop.style.left=innerWidth<=900?'auto':Math.max(12,Math.min(r.left,innerWidth-305))+'px';pop.style.right=innerWidth<=900?'12px':'auto';nameInput.focus();}}
$('sidebarProfileTrigger').addEventListener('click',e=>toggle(e.currentTarget));$('mobileProfileTrigger').addEventListener('click',e=>toggle(e.currentTarget));
$('saveProfileName').addEventListener('click',()=>{if(!nameInput.value.trim())return;profileName=nameInput.value.trim();localStorage.setItem('inventoryProfileName',profileName);updateProfile();pop.hidden=true;});
document.addEventListener('click',e=>{if(!pop.hidden&&!e.target.closest('#profilePopover,#sidebarProfileTrigger,#mobileProfileTrigger'))pop.hidden=true;});updateProfile();
})();