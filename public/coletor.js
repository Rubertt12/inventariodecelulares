if(new URLSearchParams(location.search).get('embed')==='1')document.body.classList.add('embed-mode');

(()=>{
const $=id=>document.getElementById(id);let stream=null,photoBlob=null,photoUrl=null,items=[];
const DB_NAME='coletor-celulares-local',DB_VERSION=1;
function openLocalDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('kv'))req.result.createObjectStore('kv')};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function localGet(key){const db=await openLocalDB();return new Promise((resolve,reject)=>{const r=db.transaction('kv').objectStore('kv').get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function localSet(key,value){const db=await openLocalDB();return new Promise((resolve,reject)=>{const tx=db.transaction('kv','readwrite');tx.objectStore('kv').put(value,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
async function persistDraft(){try{await localSet('draft',{model:$('model').value,locality:$('locality').value,imei:$('imei').value,imei2:$('imei2').value,sn:$('sn').value,photoBlob})}catch(e){console.warn('Falha ao salvar rascunho local',e)}}
async function persistItems(){try{await localSet('items',items.map(({photoUrl,...it})=>it))}catch(e){say('Aviso: não foi possível salvar o lote neste navegador.')}}
async function restoreLocalData(){try{const saved=await localGet('items');if(Array.isArray(saved))items=saved.map(it=>({...it,photoUrl:URL.createObjectURL(it.photoBlob)}));const draft=await localGet('draft');if(draft){$('model').value=draft.model||'';$('locality').value=draft.locality||'Canoas';$('imei').value=draft.imei||'';$('imei2').value=draft.imei2||'';$('sn').value=draft.sn||'';if(draft.photoBlob){photoBlob=draft.photoBlob;setPhoto(photoBlob);say('Rascunho recuperado: foto e campos restaurados.')}}render()}catch(e){console.warn('Falha ao recuperar dados locais',e)}}
const video=$('video'),photoPreview=$('photoPreview'),status=$('status'),progress=$('progress');
function say(t){status.textContent=t}function digits(v){return (v||'').replace(/\D/g,'')}
function clean(v){return (v||'').trim().replace(/[^a-zA-Z0-9_-]+/g,'_').slice(0,45)||'SEM_ID'}
function stop(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}video.srcObject=null;$('takePhoto').disabled=true}
$('startCam').onclick=async()=>{try{stop();stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}},audio:false});video.srcObject=stream;video.style.display='block';$('previewText').hidden=true;photoPreview.hidden=true;$('takePhoto').disabled=false;say('Câmera ativa. Enquadre a etiqueta ou o aparelho.')}catch(e){say('Não foi possível abrir a câmera. Verifique a permissão ou use Selecionar foto.')}};
$('stopCam').onclick=()=>{stop();video.style.display='none';say('Câmera fechada.')};
function setPhoto(blob){photoBlob=blob;if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=URL.createObjectURL(blob);photoPreview.src=photoUrl;photoPreview.hidden=false;video.style.display='none';$('previewText').hidden=true;persistDraft()}
$('takePhoto').onclick=()=>{if(!stream)return;const c=document.createElement('canvas');c.width=video.videoWidth;c.height=video.videoHeight;c.getContext('2d').drawImage(video,0,0);c.toBlob(b=>{if(b){setPhoto(b);say('Foto capturada. Agora leia a etiqueta ou preencha os dados.')}},'image/jpeg',.9)};
$('labelPhoto').onchange=e=>{const f=e.target.files[0];if(!f)return;setPhoto(f);say('Foto da etiqueta carregada. Clique em Ler texto da etiqueta (OCR).')};
$('readOcr').onclick=async()=>{const f=$('labelPhoto').files[0];const source=f||photoBlob;if(!source){say('Primeiro fotografe ou selecione a etiqueta.');return}if(!window.Tesseract){say('Biblioteca OCR indisponível. Preencha IMEI e SN manualmente.');return}try{say('Lendo etiqueta com OCR…');progress.style.width='5%';const result=await Tesseract.recognize(source,'eng',{logger:m=>{if(m.status==='recognizing text')progress.style.width=Math.round(m.progress*90+5)+'%'}});const text=result.data.text||'';
const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
const normalizeOcrDigits=s=>String(s||'').toUpperCase().replace(/[OQD]/g,'0').replace(/[IL|]/g,'1').replace(/S/g,'5').replace(/B/g,'8').replace(/[^0-9]/g,'');
const candidates=[];
for(let i=0;i<lines.length;i++){
 const line=lines[i], label1=/IMEI\s*[-:#]?\s*1\b|IMEI\s*1\b|IMEI1\b/i.test(line),label2=/IMEI\s*[-:#]?\s*2\b|IMEI\s*2\b|IMEI2\b/i.test(line);
 const nearby=[line,lines[i+1]||'',lines[i+2]||''].join(' ');
 const found=[...nearby.matchAll(/[0-9OQDIL|SB][\s.:_-]*[0-9OQDIL|SB](?:[\s.:_-]*[0-9OQDIL|SB]){13,16}/gi)].map(m=>normalizeOcrDigits(m[0])).filter(v=>v.length>=14&&v.length<=17);
 for(const value of found)candidates.push({value:value.slice(-15),slot:label1?'imei':label2?'imei2':''});
}
const all=[...text.matchAll(/[0-9OQDIL|SB](?:[\s.:_-]*[0-9OQDIL|SB]){14,16}/gi)].map(m=>normalizeOcrDigits(m[0])).filter(v=>v.length>=14&&v.length<=17).map(v=>v.slice(-15));
const labeled1=candidates.find(x=>x.slot==='imei'),labeled2=candidates.find(x=>x.slot==='imei2');
const unique=[...new Set([...candidates.map(x=>x.value),...all])];
if(labeled1)$('imei').value=labeled1.value;
else if(all[0])$('imei').value=all[0];
if(labeled2)$('imei2').value=labeled2.value;
else {const second=unique.find(v=>v!==$('imei').value);if(second)$('imei2').value=second;}
const serialLine=lines.find(x=>/(S\/?N|SERIAL|SER\.? NO|SN\s*[:#])/i.test(x));if(serialLine){const candidate=serialLine.replace(/.*?(?:S\/?N|SERIAL(?:\s+NO)?|SN)\s*[:#-]?\s*/i,'').replace(/[^a-zA-Z0-9-]/g,'');if(candidate.length>=5)$('sn').value=candidate.slice(0,40)}progress.style.width='100%';await persistDraft();const foundImei=digits($('imei').value),foundImei2=digits($('imei2').value),foundSn=$('sn').value.trim();const hasCandidate=foundImei.length===15||foundImei2.length===15||foundSn.length>=5;say(hasCandidate?'OCR concluído. Revise a foto e os campos; corrija o que estiver errado e clique em “Adicionar ao lote” para confirmar.':'OCR concluído, mas não encontrei IMEI/SN suficiente. Confira a foto, preencha ou corrija os campos e clique em “Adicionar ao lote” quando estiver pronto.')}catch(e){say('Falha no OCR. Tente outra foto mais nítida ou preencha manualmente.')}};
function render(){const root=$('records');$('counter').textContent=items.length+' aparelho(s)';$('export').disabled=!items.length;$('importStock').disabled=!items.length;if(!items.length){root.className='empty';root.textContent='Nenhum aparelho adicionado ainda.';return}root.className='records';root.innerHTML='';items.forEach((it,i)=>{const row=document.createElement('div');row.className='record';const img=document.createElement('img');img.src=it.photoUrl;img.alt='Foto '+(i+1);const info=document.createElement('div');const strong=document.createElement('strong');strong.textContent=it.model||'Aparelho '+(i+1);const detail=document.createElement('small');detail.textContent='IMEI: '+(it.imei||'—')+' · SN: '+(it.sn||'—');info.append(strong,detail);const del=document.createElement('button');del.className='danger remove';del.textContent='Remover';del.onclick=()=>{URL.revokeObjectURL(it.photoUrl);items.splice(i,1);render();persistItems()};row.append(img,info,del);root.append(row)})}
function addCurrentDevice(fromOcr=false){
 const imei=digits($('imei').value).slice(0,15),imei2=digits($('imei2').value).slice(0,15),sn=$('sn').value.trim(),model=$('model').value.trim();
 if(!imei&&!sn){say('Informe pelo menos o IMEI ou o SN.');return}
 if(imei&&imei.length!==15){say('IMEI 1 deve ter 15 dígitos.');return}
 if(imei2&&imei2.length!==15){say('IMEI 2 deve ter 15 dígitos.');return}
 if(!photoBlob){say('Fotografe o aparelho antes de adicionar.');return}
 if(items.some(x=>(imei&&(x.imei===imei||x.imei2===imei))||(imei2&&(x.imei===imei2||x.imei2===imei2))||(sn&&x.sn.toLowerCase()===sn.toLowerCase()))){say('Possível duplicidade: IMEI ou SN já está no lote.');return}
 items.push({imei,imei2,sn,model,photoBlob,photoUrl:URL.createObjectURL(photoBlob),createdAt:new Date().toISOString()});render();persistItems();
 say(fromOcr?'OCR validado: aparelho adicionado automaticamente ao lote.':'Aparelho adicionado ao lote.');
 $('imei').value='';$('imei2').value='';$('sn').value='';$('model').value='';$('labelPhoto').value='';photoBlob=null;
 if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=null;photoPreview.hidden=true;$('previewText').hidden=false;progress.style.width='0%';persistDraft();
}
$('add').onclick=()=>addCurrentDevice(false);
$('clear').onclick=()=>{$('imei').value='';$('imei2').value='';$('sn').value='';$('model').value='';$('labelPhoto').value='';photoBlob=null;if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=null;photoPreview.hidden=true;$('previewText').hidden=false;progress.style.width='0%';say('Campos limpos.');persistDraft()};
$('export').onclick=async()=>{if(!items.length)return;if(!window.JSZip){say('Biblioteca ZIP indisponível. Recarregue com internet.');return}
const zip=new JSZip(),photos=zip.folder('fotos'),devices=zip.folder('aparelhos'),rows=[['Modelo','IMEI 1','IMEI 2','SN','Foto','Data de captura']],manifest={format:'inventario-celulares-v1',createdAt:new Date().toISOString(),items:[]};
for(let i=0;i<items.length;i++){const it=items[i],base=String(i+1).padStart(3,'0')+'_'+clean(it.imei||it.sn),photoName=base+'.jpg',photoPath='fotos/'+photoName;
photos.file(photoName,it.photoBlob);const record={model:it.model,imei:it.imei,imei2:it.imei2,sn:it.sn,locality:$('locality').value.trim()||'Canoas',createdAt:it.createdAt,photo:photoPath};
manifest.items.push(record);const deviceFolder=devices.folder(base);deviceFolder.file('registro.json',JSON.stringify(record,null,2));deviceFolder.file('foto.jpg',it.photoBlob);
rows.push([it.model,it.imei,it.imei2,it.sn,photoPath,it.createdAt]);}
zip.file('manifest.json',JSON.stringify(manifest,null,2));
const csv='\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');
zip.file('inventario.csv',csv);
zip.file('LEIA-ME.txt','Pacote de coleta de celulares. Cada pasta em /aparelhos contém registro.json e foto.jpg. Para importar pelo celular: abra o Inventário de Celulares, escolha “Importar lote ZIP” no menu lateral e selecione este arquivo. O inventário valida IMEI/SN, ignora duplicados e salva os dados e fotos no armazenamento local do navegador. No computador com a pasta do inventário vinculada, a importação grava em banco.json e fotofiles.');
say('Preparando ZIP com um pacote individual por aparelho…');
const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE'},m=>progress.style.width=Math.round(m.percent)+'%');
const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='Inventario_Celulares_'+new Date().toISOString().slice(0,10)+'.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);say('ZIP gerado: CSV, fotos e pastas individuais com registro + foto.');};

$('importZip').onchange=async e=>{const file=e.target.files&&e.target.files[0];if(!file)return;if(!window.JSZip){say('Biblioteca ZIP indisponível.');return;}
try{say('Lendo pacote ZIP…');const zip=await JSZip.loadAsync(file),manifestFile=zip.file('manifest.json');if(!manifestFile)throw new Error('Este ZIP não possui manifest.json. Gere novamente o pacote pelo coletor atualizado.');
const manifest=JSON.parse(await manifestFile.async('string'));if(manifest.format!=='inventario-celulares-v1'||!Array.isArray(manifest.items))throw new Error('Formato de pacote não reconhecido.');
let loaded=0,skipped=0;for(const record of manifest.items){const photoFile=record.photo&&zip.file(record.photo);if(!photoFile){skipped++;continue;}const photoBlob=await photoFile.async('blob');const imei=digits(record.imei),imei2=digits(record.imei2),sn=(record.sn||'').trim();if(items.some(x=>(imei&&x.imei===imei)||(imei2&&x.imei2===imei2)||(sn&&x.sn.toLowerCase()===sn.toLowerCase()))){skipped++;continue;}
items.push({imei:imei.slice(0,15),imei2:imei2.slice(0,15),sn,model:record.model||'',photoBlob,photoUrl:URL.createObjectURL(photoBlob),createdAt:record.createdAt||new Date().toISOString()});loaded++;}
render();persistItems();if(manifest.items[0]&&manifest.items[0].locality)$('locality').value=manifest.items[0].locality;
say('ZIP carregado: '+loaded+' aparelho(s) pronto(s) para importar no estoque; '+skipped+' item(ns) ignorado(s). Agora clique em Importar no estoque.');}catch(err){console.error(err);say('Não foi possível importar o ZIP: '+err.message);}finally{e.target.value='';}};
$('importStock').onclick=async()=>{if(!items.length)return;
if(!window.showDirectoryPicker){say('No celular: volte ao Inventário de Celulares e toque em “Importar lote ZIP” no menu. Selecione o arquivo ZIP que você acabou de baixar.');return;}
let dir;try{dir=await window.showDirectoryPicker({id:'inventario-celulares-data',mode:'readwrite'});}catch(e){if(e.name==='AbortError')say('Seleção da pasta cancelada.');else say('Não foi possível acessar a pasta. Verifique a permissão.');return;}
try{
const bankHandle=await dir.getFileHandle('banco.json',{create:true});let stock=[];
try{const raw=await (await bankHandle.getFile()).text();if(raw.trim()){const parsed=JSON.parse(raw);if(!Array.isArray(parsed))throw new Error('banco.json inválido: esperado uma lista de aparelhos.');stock=parsed;}}catch(e){if(e.name!=='NotFoundError')throw e;}
const norm=v=>(v||'').toString().trim().toLowerCase(),digitsOnly=v=>(v||'').toString().replace(/\D/g,'');
const duplicate=it=>stock.some(x=>(it.imei&&digitsOnly(x.imei1)===it.imei)||(it.imei2&&digitsOnly(x.imei1)===it.imei2)||(it.imei&&digitsOnly(x.imei2)===it.imei)||(it.imei2&&digitsOnly(x.imei2)===it.imei)||(it.sn&&norm(x.sn)===norm(it.sn)));
const photoDir=await dir.getDirectoryHandle('fotofiles',{create:true});let added=0,skipped=0;
for(const it of items){if(duplicate(it)){skipped++;continue;}
const photoName='coleta_'+Date.now()+'_'+Math.random().toString(36).slice(2,8)+'.jpg';
const photoHandle=await photoDir.getFileHandle(photoName,{create:true}),writer=await photoHandle.createWritable();await writer.write(it.photoBlob);await writer.close();
stock.unshift({id:Date.now()+Math.random(),imei1:it.imei||'',imei2:it.imei2||'',sn:it.sn||'',modelo:it.model||'Não informado',localidade:$('locality').value.trim()||'Canoas',dataEntrada:it.createdAt||new Date().toISOString(),photoName,status:'Disponível',entrega:{nome:'',cc:'',matricula:'',localidade:'',ticket:''},history:[]});added++;}
if(!added){say('Nenhum aparelho novo importado. '+skipped+' duplicado(s) ignorado(s).');return;}
const writer=await bankHandle.createWritable();await writer.write(JSON.stringify(stock,null,2));await writer.close();
say('Importação concluída: '+added+' aparelho(s) incluído(s) no estoque; '+skipped+' duplicado(s) ignorado(s). Use a mesma pasta de dados vinculada ao Inventário.');
}catch(e){console.error(e);say('Falha na importação: '+(e.message||'erro inesperado')+'. Confira a pasta e o banco.json.');}};
['model','locality','imei','imei2','sn'].forEach(id=>$(id).addEventListener('input',persistDraft));window.addEventListener('beforeunload',stop);restoreLocalData();render();
})();
