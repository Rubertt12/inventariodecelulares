(function(){
'use strict';
const $=id=>document.getElementById(id),backdrop=$('spotlightBackdrop'),input=$('spotlightInput'),results=$('spotlightResults'),filters=$('spotlightFilters');
let status='',selected=0,visible=[],mode='devices',selectedDocument=null;
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function getDocuments(){return (Array.isArray(termosData)?termosData:[]).filter(doc=>doc&&(doc.ticket||doc.nome||doc.sn));}
function matchesDocument(doc,q){return !q||['ticket','nome','matricula','cc','local','marcaModelo','imei1','imei2','sn','nomeTecnico','modeloTermo'].some(k=>norm(doc[k]).includes(norm(q)));}
function renderDevices(){
 const q=input.value.trim();
 visible=(Array.isArray(stockData)?stockData:[]).filter(item=>['modelo','imei1','imei2','sn','localidade'].some(k=>norm(item[k]).includes(norm(q)))&&(!status||(item.status||'Disponível')===status)).slice(0,30);
 $('spotlightResultCount').textContent=visible.length+' aparelhos';$('spotlightTitle').textContent=q?'Resultados da busca':'Sugestões do inventário';results.innerHTML='';
 if(!visible.length){results.innerHTML='<div class="spotlight-empty">Nenhum aparelho encontrado.</div>';return;}
 visible.forEach((item,i)=>{
  const s=item.status||'Disponível',b=document.createElement('button');b.type='button';b.className='spotlight-result'+(i===selected?' selected':'');
  const ico=document.createElement('span');ico.className='spotlight-result-icon';ico.textContent='▣';
  const main=document.createElement('span');main.className='spotlight-result-main';
  const title=document.createElement('strong');title.textContent=item.modelo||'Aparelho sem modelo';
  const sub=document.createElement('small');sub.textContent=(item.localidade||'Sem localidade')+' · IMEI: '+(item.imei1||item.imei2||'—')+' · SN: '+(item.sn||'—');main.append(title,sub);
  const badge=document.createElement('span');badge.className='spotlight-result-status '+(s==='Entregue'?'is-delivered':'is-available');badge.textContent=s;b.append(ico,main,badge);b.addEventListener('click',()=>openResult(item));results.appendChild(b);
 });
}
function renderDocumentPreview(doc){
 const panel=$('spotlightDocumentPreview');panel.innerHTML='';if(!doc)return;
 const header=document.createElement('div');header.className='spotlight-doc-paper-header';header.textContent='TERMO DE RESPONSABILIDADE · REGISTRO';
 const title=document.createElement('h3');title.textContent='Comprovante de entrega de equipamento';
 const intro=document.createElement('p');intro.textContent='Ticket '+(doc.ticket||'—')+' · Modelo do termo '+(doc.modeloTermo||'—');
 const grid=document.createElement('div');grid.className='spotlight-doc-fields';
 [['Colaborador',doc.nome],['Matrícula',doc.matricula],['Centro de custo',doc.cc],['Local de entrega',doc.local],['Equipamento',doc.marcaModelo],['IMEI 1',doc.imei1],['IMEI 2',doc.imei2],['Número de série',doc.sn],['Chip',doc.chip],['Técnico responsável',doc.nomeTecnico]].forEach(([label,value])=>{const cell=document.createElement('div');cell.className='spotlight-doc-field';const l=document.createElement('small');l.textContent=label;const v=document.createElement('strong');v.textContent=value||'—';cell.append(l,v);grid.appendChild(cell);});
 const note=document.createElement('p');note.className='spotlight-doc-note';note.textContent='Pré-visualização dos dados salvos no histórico de termos. O PDF pode ser gerado ou reemitido abaixo.';
 const actions=document.createElement('div');actions.className='spotlight-doc-actions';const open=document.createElement('button');open.type='button';open.className='spotlight-doc-open';const isGenerated=Array.isArray(generatedPdfIds)&&generatedPdfIds.includes((doc.ticket||'')+':'+(doc.sn||''));open.textContent=isGenerated?'Abrir / reemitir PDF':'Gerar PDF deste termo';open.addEventListener('click',()=>{if(typeof window.openTermoGenerator==='function')window.openTermoGenerator(doc,isGenerated);});actions.appendChild(open);panel.append(header,title,intro,grid,note,actions);
}
function renderDocuments(){
 const q=input.value.trim(),docs=getDocuments().filter(doc=>matchesDocument(doc,q));
 $('spotlightDocumentCount').textContent=docs.length;const list=$('spotlightDocumentList');list.innerHTML='';
 if(!docs.length){list.innerHTML='<div class="spotlight-empty">Nenhum termo/documento registrado corresponde à busca.</div>';$('spotlightDocumentPreview').innerHTML='<div class="spotlight-document-empty">Nenhum documento selecionado.</div>';selectedDocument=null;return;}
 if(!selectedDocument||!docs.includes(selectedDocument))selectedDocument=docs[0];
 docs.forEach(doc=>{const b=document.createElement('button');b.type='button';b.className='spotlight-doc-row'+(doc===selectedDocument?' active':'');const title=document.createElement('strong');title.textContent=doc.nome||'Colaborador não informado';const meta=document.createElement('small');meta.textContent='Ticket '+(doc.ticket||'—')+' · '+(doc.marcaModelo||'Aparelho')+' · SN '+(doc.sn||'—');const mark=document.createElement('span');mark.className='spotlight-doc-mark';mark.textContent=(Array.isArray(generatedPdfIds)&&generatedPdfIds.includes((doc.ticket||'')+':'+(doc.sn||'')))?'PDF gerado':'Termo registrado';b.append(title,meta,mark);b.addEventListener('click',()=>{selectedDocument=doc;renderDocuments();});list.appendChild(b);});
 renderDocumentPreview(selectedDocument);
}
function openResult(item){backdrop.hidden=true;switchView('estoque');const search=$('inputSearchStock');if(search){search.value=String(item.imei1||item.imei2||item.sn||item.modelo||'');search.dispatchEvent(new Event('input',{bubbles:true}));}}
function render(){if(mode==='documents')renderDocuments();else renderDevices();}
function setMode(next){mode=next;$('spotlightModeTabs').querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));filters.hidden=mode!=='devices';results.hidden=mode!=='devices';$('spotlightDocuments').hidden=mode!=='documents';selectedDocument=null;render();}
window.openSpotlight=function(){backdrop.hidden=false;mode='devices';status='';selected=0;input.value='';$('spotlightModeTabs').querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.mode==='devices'));filters.querySelectorAll('button').forEach(b=>b.classList.toggle('active',!b.dataset.status));filters.hidden=false;results.hidden=false;$('spotlightDocuments').hidden=true;render();setTimeout(()=>input.focus(),30);};
$('spotlightModeTabs').addEventListener('click',e=>{const b=e.target.closest('button[data-mode]');if(b)setMode(b.dataset.mode);});
$('spotlightClose').addEventListener('click',()=>backdrop.hidden=true);backdrop.addEventListener('click',e=>{if(e.target===backdrop)backdrop.hidden=true;});
input.addEventListener('input',()=>{selected=0;render();});
filters.addEventListener('click',e=>{const b=e.target.closest('button[data-status]');if(!b)return;status=b.dataset.status;filters.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render();});
input.addEventListener('keydown',e=>{if(mode!=='devices')return;if(e.key==='ArrowDown'){e.preventDefault();selected=Math.min(selected+1,visible.length-1);render();}if(e.key==='ArrowUp'){e.preventDefault();selected=Math.max(0,selected-1);render();}if(e.key==='Enter'&&visible[selected])openResult(visible[selected]);});
$('spotlightGoStock').addEventListener('click',()=>{backdrop.hidden=true;switchView('estoque');setTimeout(()=>$('inputSearchStock').focus(),100);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!backdrop.hidden)backdrop.hidden=true;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();window.openSpotlight();}});
let profileName=localStorage.getItem('inventoryProfileName')||'Usuário';const pop=$('profilePopover'),nameInput=$('profileNameInput');
function updateProfile(){const initial=profileName.trim().charAt(0).toUpperCase()||'U';['sidebarProfileName','popoverProfileName'].forEach(id=>{if($(id))$(id).textContent=profileName;});['sidebarProfileAvatar','mobileProfileAvatar','popoverProfileAvatar'].forEach(id=>{if($(id))$(id).textContent=initial;});if(nameInput)nameInput.value=profileName;}
function toggle(anchor){const opening=pop.hidden;pop.hidden=!opening;if(opening){const r=anchor.getBoundingClientRect();pop.style.top=Math.min(r.bottom+8,innerHeight-220)+'px';pop.style.left=innerWidth<=900?'auto':Math.max(12,Math.min(r.left,innerWidth-305))+'px';pop.style.right=innerWidth<=900?'12px':'auto';nameInput.focus();}}
$('sidebarProfileTrigger').addEventListener('click',e=>toggle(e.currentTarget));$('mobileProfileTrigger').addEventListener('click',e=>toggle(e.currentTarget));
$('saveProfileName').addEventListener('click',()=>{if(!nameInput.value.trim())return;profileName=nameInput.value.trim();localStorage.setItem('inventoryProfileName',profileName);updateProfile();pop.hidden=true;});
document.addEventListener('click',e=>{if(!pop.hidden&&!e.target.closest('#profilePopover,#sidebarProfileTrigger,#mobileProfileTrigger'))pop.hidden=true;});updateProfile();
})();