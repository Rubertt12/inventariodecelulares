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
function stop(){
 if(stream){stream.getTracks().forEach(track=>track.stop());stream=null}
 video.pause();video.srcObject=null;video.style.display='none';$('takePhoto').disabled=true;
}
async function openCamera(){
 stop();
 if(!window.isSecureContext){say('A câmera precisa de HTTPS. Abra este endereço no Chrome.');return}
 if(!navigator.mediaDevices?.getUserMedia){say('Este navegador não liberou acesso à câmera. Abra a página no Chrome atualizado.');return}
 say('Solicitando acesso à câmera traseira…');
 try{
  let media;
  try{media=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{exact:'environment'},width:{ideal:1920},height:{ideal:1080}}})}
  catch(e){media=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:'environment'}})}
  stream=media;video.muted=true;video.playsInline=true;video.setAttribute('playsinline','');video.srcObject=stream;
  video.style.display='block';photoPreview.hidden=true;$('previewText').hidden=true;
  await video.play();
  $('takePhoto').disabled=false;say('Câmera ativa. Enquadre a etiqueta e toque em Fotografar.');
 }catch(e){
  stop();
  const msg={NotAllowedError:'Permissão negada. No Chrome, permita Câmera nas configurações do site.',NotFoundError:'Não encontrei uma câmera disponível.',NotReadableError:'A câmera está sendo usada por outro aplicativo. Feche-o e tente novamente.',OverconstrainedError:'Não foi possível selecionar a câmera traseira.'};
  say(msg[e.name]||('Não foi possível abrir a câmera: '+(e.message||e.name)));
 }
}
$('startCam').addEventListener('click',openCamera);
$('stopCam').addEventListener('click',()=>{stop();$('previewText').hidden=false;say('Câmera desligada.')});
$('takePhoto').addEventListener('click',()=>{
 if(!stream||!video.videoWidth){say('Aguarde a imagem da câmera aparecer.');return}
 const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;
 const ctx=canvas.getContext('2d');ctx.drawImage(video,0,0,canvas.width,canvas.height);
 canvas.toBlob(blob=>{if(blob){setPhoto(blob);say('Foto capturada. Agora faça a leitura da etiqueta ou confira os campos manualmente.')}else say('Não foi possível salvar a foto. Tente novamente.')},'image/jpeg',.92);
});
function setPhoto(blob){stop();photoBlob=blob;if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=URL.createObjectURL(blob);photoPreview.src=photoUrl;photoPreview.hidden=false;video.style.display='none';$('previewText').hidden=true;persistDraft()}
$('takePhoto').onclick=()=>{if(!stream)return;const c=document.createElement('canvas');c.width=video.videoWidth;c.height=video.videoHeight;c.getContext('2d').drawImage(video,0,0);c.toBlob(b=>{if(b){setPhoto(b);say('Foto capturada. Agora leia a etiqueta ou preencha os dados.')}},'image/jpeg',.9)};
$('labelPhoto').onchange=e=>{const f=e.target.files[0];if(!f)return;setPhoto(f);say('Foto carregada. Toque em Ler etiqueta (OCR).')};

$('readOcr').onclick=async()=>{
 const source=photoBlob||$('labelPhoto').files?.[0];
 if(!source){say('Primeiro fotografe ou selecione a etiqueta.');return}
 if(!window.Tesseract){say('Leitor de texto indisponível. Recarregue a página com internet.');return}
 const button=$('readOcr');button.disabled=true;progress.style.width='10%';
 let worker=null;
 try{
  say('Lendo a foto. Isso pode levar alguns segundos…');
  // Leitura de código de barras nativa do navegador, sem biblioteca adicional.
  if('BarcodeDetector' in window){
   try{
    const detector=new BarcodeDetector();
    const codes=await detector.detect(source);
    for(const code of codes){
     const value=String(code.rawValue||'').trim(),numeric=value.replace(/\D/g,'');
     if(numeric.length===15){
      if(!$('imei').value)$('imei').value=numeric;
      else if(!$('imei2').value&&numeric!==digits($('imei').value))$('imei2').value=numeric;
     }else if(value.length>=5&&value.length<=40&&!$('sn').value)$('sn').value=value;
    }
   }catch(e){console.warn('Leitura de código nativa indisponível:',e)}
  }
  progress.style.width='25%';
  worker=await Tesseract.createWorker('eng');
  const result=await worker.recognize(source);
  const text=result?.data?.text||'';
  console.log('[Coletor] Texto lido:',text);
  const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const normalizedDigits=value=>String(value||'').toUpperCase()
   .replace(/[OQD]/g,'0').replace(/[IL|]/g,'1').replace(/Z/g,'2').replace(/S/g,'5').replace(/B/g,'8')
   .replace(/[^0-9]/g,'');
  const candidates=[...new Set((text.match(/[0-9OQDIL|ZSB](?:[\s.-]*[0-9OQDIL|ZSB]){13,18}/gi)||[])
   .map(normalizedDigits).filter(x=>x.length===15))];
  const getLabelled=(re)=>{
   for(let i=0;i<lines.length;i++){
    if(!re.test(lines[i]))continue;
    const near=[lines[i],lines[i+1]||''].join(' ');
    const match=near.match(/[0-9OQDIL|ZSB](?:[\s.-]*[0-9OQDIL|ZSB]){13,18}/i);
    if(match){const n=normalizedDigits(match[0]);if(n.length===15)return n}
   }
   return '';
  };
  const first=getLabelled(/IMEI\s*[-:#]?\s*1\b|IMEI1\b/i);
  const second=getLabelled(/IMEI\s*[-:#]?\s*2\b|IMEI2\b/i);
  const chosen=[];
  if(first)chosen.push(first);
  if(second&&second!==first)chosen.push(second);
  for(const value of candidates)if(!chosen.includes(value))chosen.push(value);
  if(!$('imei').value&&chosen[0])$('imei').value=chosen[0];
  if(!$('imei2').value&&chosen.find(x=>x!==digits($('imei').value)))$('imei2').value=chosen.find(x=>x!==digits($('imei').value));
  if(!$('sn').value){
   for(let i=0;i<lines.length;i++){
    if(/(?:S\s*\/?\s*N|SERIAL(?:\s*(?:NO\.?|NUMBER))?|SER\.?\s*NO\.?|SN)\b/i.test(lines[i])){
     let value=lines[i].replace(/.*?(?:S\s*\/?\s*N|SERIAL(?:\s*(?:NO\.?|NUMBER))?|SER\.?\s*NO\.?|SN)\s*[:#=\-]?/i,'').trim();
     if(!value)value=lines[i+1]||'';
     value=value.replace(/[^A-Z0-9-]/gi,'');
     if(value.length>=5&&value.length<=40&&!/^\d{15}$/.test(value)){$('sn').value=value;break}
    }
   }
  }
  await persistDraft();progress.style.width='100%';
  const found=[];
  if(digits($('imei').value).length===15)found.push('IMEI 1');
  if(digits($('imei2').value).length===15)found.push('IMEI 2');
  if($('sn').value.trim())found.push('SN');
  if(found.length)say('Leitura concluída: '+found.join(', ')+'. Confira os campos, pois a leitura automática pode confundir caracteres.');
  else if(!text.trim())say('Não consegui ler texto ou código. Tire outra foto mais próxima, nítida e sem reflexo.');
  else say('A foto foi lida, mas não encontrei IMEI/SN com segurança. Preencha os campos manualmente ou tente outra foto.');
 }catch(error){
  console.error('[Coletor] Erro na leitura:',error);
  say('Não foi possível ler esta foto. Confira a conexão e tente novamente.');
 }finally{
  if(worker){try{await worker.terminate()}catch(e){}}
  button.disabled=false;
 }
};
function render(){const root=$('records');$('counter').textContent=items.length+' aparelho(s)';$('export').disabled=!items.length;$('importStock').disabled=!items.length;if(!items.length){root.className='empty';root.textContent='Nenhum aparelho adicionado ainda.';return}root.className='records';root.innerHTML='';items.forEach((it,i)=>{const row=document.createElement('div');row.className='record';const img=document.createElement('img');img.src=it.photoUrl;img.alt='Foto '+(i+1);const info=document.createElement('div');const strong=document.createElement('strong');strong.textContent=it.model||'Aparelho '+(i+1);const detail=document.createElement('small');detail.textContent='IMEI: '+(it.imei||'—')+' · SN: '+(it.sn||'—');info.append(strong,detail);const del=document.createElement('button');del.className='danger remove';del.textContent='Remover';del.onclick=()=>{URL.revokeObjectURL(it.photoUrl);items.splice(i,1);render();persistItems()};row.append(img,info,del);root.append(row)})}
function addCurrentDevice(fromOcr=false){
 const imei=digits($('imei').value).slice(0,15),imei2=digits($('imei2').value).slice(0,15),sn=$('sn').value.trim(),model=$('model').value.trim();
 if(imei.length!==15){say('IMEI 1 é obrigatório e deve ter 15 dígitos.');$('imei').focus();return}
 if(imei2.length!==15){say('IMEI 2 é obrigatório e deve ter 15 dígitos.');$('imei2').focus();return}
 if(!sn){say('Número de série (SN) é obrigatório.');$('sn').focus();return}
 if(!photoBlob){say('Fotografe o aparelho antes de adicionar.');return}
 if(items.some(x=>(imei&&(x.imei===imei||x.imei2===imei))||(imei2&&(x.imei===imei2||x.imei2===imei2))||(sn&&x.sn.toLowerCase()===sn.toLowerCase()))){say('Possível duplicidade: IMEI ou SN já está no lote.');return}
 items.push({imei,imei2,sn,model,photoBlob,photoUrl:URL.createObjectURL(photoBlob),createdAt:new Date().toISOString()});render();persistItems();
 say(fromOcr?'OCR validado: aparelho adicionado automaticamente ao lote.':'Aparelho adicionado ao lote.');
 $('imei').value='';$('imei2').value='';$('sn').value='';$('model').value='';$('labelPhoto').value='';photoBlob=null;
 if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=null;photoPreview.hidden=true;$('previewText').hidden=false;progress.style.width='0%';persistDraft();
}
$('add').onclick=()=>addCurrentDevice(false);
$('clear').onclick=()=>{$('imei').value='';$('imei2').value='';$('sn').value='';$('model').value='';$('labelPhoto').value='';photoBlob=null;if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=null;photoPreview.hidden=true;$('previewText').hidden=false;progress.style.width='0%';say('Campos limpos.');persistDraft()};
$('export').onclick=async()=>{if(!items.length)return;const incomplete=items.findIndex(it=>digits(it.imei).length!==15||digits(it.imei2).length!==15||!String(it.sn||'').trim());if(incomplete!==-1){say('O aparelho '+(incomplete+1)+' do lote está sem IMEI 1, IMEI 2 ou SN válido. Remova-o ou corrija os dados antes de gerar o ZIP.');return;}if(!window.JSZip){say('Biblioteca ZIP indisponível. Recarregue com internet.');return}
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
let loaded=0,skipped=0;for(const record of manifest.items){const photoFile=record.photo&&zip.file(record.photo);if(!photoFile){skipped++;continue;}const photoBlob=await photoFile.async('blob');const imei=digits(record.imei),imei2=digits(record.imei2),sn=(record.sn||'').trim();if(imei.length!==15||imei2.length!==15||!sn){skipped++;continue;}if(items.some(x=>(imei&&x.imei===imei)||(imei2&&x.imei2===imei2)||(sn&&x.sn.toLowerCase()===sn.toLowerCase()))){skipped++;continue;}
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
if('serviceWorker' in navigator && location.protocol==='https:'){navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('Service Worker indisponível',e));}
['model','locality','imei','imei2','sn'].forEach(id=>$(id).addEventListener('input',persistDraft));window.addEventListener('beforeunload',stop);restoreLocalData();render();
})();
