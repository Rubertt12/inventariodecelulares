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
const OCR_CACHE='coletor-ocr-offline-v1';
const OCR_ASSETS=[
 {url:'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.0/dist/tesseract.min.js',key:'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.0/dist/tesseract.min.js'},
 {url:'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.0/dist/worker.min.js',key:'/ocr/vendor/worker.min.js'},
 ...['tesseract-core.wasm.js','tesseract-core-simd.wasm.js','tesseract-core-lstm.wasm.js','tesseract-core-simd-lstm.wasm.js',
 'tesseract-core.wasm','tesseract-core-simd.wasm','tesseract-core-lstm.wasm','tesseract-core-simd-lstm.wasm'].map(name=>({url:'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.0.0/'+name,key:'/ocr/core/'+name})),
 ...['por','eng'].map(lang=>({url:'https://tessdata.projectnaptha.com/4.0.0/'+lang+'.traineddata.gz',key:'/ocr/lang/'+lang+'.traineddata.gz'}))
];
let offlineOcrReady=false,ocrWorker=null;
async function hasOfflineOcr(){
 try{const cache=await caches.open(OCR_CACHE);return (await Promise.all(OCR_ASSETS.map(a=>cache.match(a.key.startsWith('http')?a.key:new URL(a.key,location.origin).href)))).every(Boolean)}catch(e){return false}
}
async function prepareOfflineOcr(){
 if(!('caches'in window)||!('serviceWorker'in navigator)){say('Este navegador não oferece os recursos necessários para preparar o OCR offline.');return}
 if(!navigator.serviceWorker.controller){say('Ativando o modo offline. Recarregue esta página uma vez e toque novamente em Preparar OCR offline.');return}
 const cache=await caches.open(OCR_CACHE);let done=0;
 $('prepareOffline').disabled=true;
 try{
  for(const asset of OCR_ASSETS){
   const key=asset.key.startsWith('http')?asset.key:new URL(asset.key,location.origin).href;
   if(await cache.match(key)){done++;progress.style.width=Math.round(done/OCR_ASSETS.length*100)+'%';continue}
   say('Baixando mecanismo OCR offline ('+(done+1)+'/'+OCR_ASSETS.length+'): '+asset.key.split('/').pop());
   const response=await fetch(asset.url,{mode:'cors',cache:'no-cache'});
   if(!response.ok)throw new Error('Não foi possível baixar '+asset.url+' (HTTP '+response.status+')');
   await cache.put(key,response.clone());done++;progress.style.width=Math.round(done/OCR_ASSETS.length*100)+'%';
  }
  offlineOcrReady=true;say('Pacote OCR offline preparado. Recarregue a página para garantir que todos os arquivos fiquem disponíveis sem internet.');
 }catch(e){say('Não foi possível preparar o OCR offline: '+e.message+'. Conecte-se à internet e tente novamente.')}
 finally{$('prepareOffline').disabled=false}
}
$('prepareOffline').onclick=prepareOfflineOcr;

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

$('readBarcode').onclick=async()=>{
 const source=photoBlob||$('labelPhoto').files?.[0];
 if(!source){say('Primeiro fotografe ou selecione a etiqueta.');return}
 if(!window.ZXing){say('Biblioteca de leitura de código de barras não carregou. Recarregue a página com internet.');return}
 const button=$('readBarcode');button.disabled=true;progress.style.width='5%';
 let imageUrl='';
 try{
  say('Preparando leitor de código de barras…');
  const loadImage=src=>new Promise((resolve,reject)=>{
   const img=new Image();
   img.onload=()=>resolve(img);
   img.onerror=()=>reject(new Error('O navegador não conseguiu carregar a imagem para decodificação.'));
   img.src=src;
  });
  imageUrl=URL.createObjectURL(source);
  const image=await loadImage(imageUrl);
  if(!image.naturalWidth||!image.naturalHeight)throw new Error('A foto está vazia ou em formato não suportado.');
  const Reader=ZXing.BrowserMultiFormatReader;
  if(!Reader)throw new Error('A biblioteca ZXing carregou, mas o leitor de imagem não está disponível.');
  const hints=new Map();
  if(ZXing.DecodeHintType&&ZXing.BarcodeFormat){
   hints.set(ZXing.DecodeHintType.TRY_HARDER,true);
   hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS,[
    ZXing.BarcodeFormat.CODE_128,ZXing.BarcodeFormat.CODE_39,
    ZXing.BarcodeFormat.CODE_93,ZXing.BarcodeFormat.EAN_13,
    ZXing.BarcodeFormat.EAN_8,ZXing.BarcodeFormat.ITF,
    ZXing.BarcodeFormat.UPC_A,ZXing.BarcodeFormat.UPC_E,
    ZXing.BarcodeFormat.QR_CODE,ZXing.BarcodeFormat.DATA_MATRIX,
    ZXing.BarcodeFormat.PDF_417,ZXing.BarcodeFormat.AZTEC
   ]);
  }
  const reader=new Reader(hints);
  const attempts=[],decodeErrors=[];
  const decode=async(img,label)=>{
   try{
    const result=await reader.decodeFromImageElement(img);
    if(result){attempts.push({text:String(result.getText()||'').trim(),format:String(result.getBarcodeFormat?.()||''),label})}
   }catch(err){
    const message=err&&typeof err.message==='string'?err.message:'Código não encontrado nesta imagem.';
    decodeErrors.push(message);
   }
  };
  say('Analisando código na foto original…');
  await decode(image,'foto original');
  if(!attempts.length){
   say('Código não localizado na foto inteira. Tentando rotações…');
   for(const angle of [90,180,270]){
    const c=document.createElement('canvas'),swap=angle===90||angle===270;
    c.width=swap?image.naturalHeight:image.naturalWidth;
    c.height=swap?image.naturalWidth:image.naturalHeight;
    const ctx=c.getContext('2d');
    if(!ctx)throw new Error('Não foi possível preparar a imagem para leitura.');
    ctx.translate(c.width/2,c.height/2);ctx.rotate(angle*Math.PI/180);
    ctx.drawImage(image,-image.naturalWidth/2,-image.naturalHeight/2);
    const rotated=await loadImage(c.toDataURL('image/png'));
    await decode(rotated,'foto girada '+angle+'°');
    if(attempts.length)break;
   }
  }
  if(!attempts.length){
   progress.style.width='100%';
   say('Nenhum código de barras ou QR foi encontrado. Fotografe o código inteiro, de perto, focado e sem reflexo. Se a etiqueta só tiver números impressos, use o leitor OCR.');
   return;
  }
  const decoded=[...new Set(attempts.map(x=>x.text).filter(Boolean))];
  const filled=[];
  for(const value of decoded){
   const normalized=value.replace(/\\s+/g,'').trim(),numeric=normalized.replace(/\\D/g,'');
   if(numeric.length===15){
    if(!$('imei').value){$('imei').value=numeric;filled.push('IMEI 1')}
    else if(!$('imei2').value&&numeric!==$('imei').value.replace(/\\D/g,'')){$('imei2').value=numeric;filled.push('IMEI 2')}
   }else if(normalized.length>=5&&normalized.length<=40&&!$('sn').value){
    $('sn').value=normalized;filled.push('SN');
   }
  }
  await persistDraft();progress.style.width='100%';
  if(filled.length)say('Código de barras lido. Preenchido: '+[...new Set(filled)].join(', ')+'. Confira os dados antes de adicionar ao lote.');
  else say('Código decodificado ('+decoded.join(', ')+'), mas o conteúdo não corresponde a um IMEI de 15 dígitos ou não há campo SN vazio. Confira o valor reconhecido no console.');
  console.log('[Coletor Barcode] Códigos lidos:',attempts);
 }catch(error){
  console.error('[Coletor Barcode] Falha:',error);
  const message=error&&typeof error.message==='string'?error.message:'Erro inesperado ao processar a foto.';
  say('Falha no leitor de código de barras: '+message);
 }finally{
  if(imageUrl)URL.revokeObjectURL(imageUrl);
  button.disabled=false;
 }
};

$('readOcr').onclick=async()=>{
 const source=photoBlob||$('labelPhoto').files?.[0];
 if(!source){say('Primeiro fotografe ou selecione a etiqueta.');return}
 if(!window.Tesseract){say('Biblioteca OCR não carregou. Verifique a internet e recarregue a página.');return}
 const button=$('readOcr');button.disabled=true;progress.style.width='2%';
 try{
  offlineOcrReady=offlineOcrReady||await hasOfflineOcr();
  say('Preparando leitura da etiqueta…');
  const logger=m=>{
   if(m.status==='recognizing text'){progress.style.width=Math.min(80,Math.round(m.progress*75+5))+'%';say('Reconhecendo texto da etiqueta… '+Math.round((m.progress||0)*100)+'%')}
   else if(m.status==='loading language model')say('Baixando modelo de leitura OCR…');
   else if(m.status==='loading tesseract core')say('Carregando núcleo do OCR…');
   else if(m.status==='initializing tesseract')say('Inicializando mecanismo OCR…');
   else if(m.status==='initializing api')say('Preparando reconhecimento de texto…');
  };
  if(!ocrWorker){
   say('Iniciando mecanismo OCR (idioma inglês para códigos e números)…');
   const options=offlineOcrReady?{
    workerPath:new URL('/ocr/vendor/worker.min.js',location.origin).href,
    corePath:new URL('/ocr/core/',location.origin).href,
    langPath:new URL('/ocr/lang/',location.origin).href,
    workerBlobURL:false,gzip:true,cacheMethod:'write',logger
   }:{
    workerPath:'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.0/dist/worker.min.js',
    corePath:'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.0.0',
    langPath:'https://tessdata.projectnaptha.com/4.0.0',
    workerBlobURL:false,gzip:true,logger
   };
   const init=Tesseract.createWorker('eng',1,options);
   const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error('O mecanismo OCR demorou mais de 60 segundos para iniciar. Verifique a conexão e tente novamente.')),60000));
   ocrWorker=await Promise.race([init,timeout]);
  }
  await ocrWorker.setParameters({preserve_interword_spaces:'1',tessedit_char_whitelist:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-/:.# '});
  const texts=[];
  say('Lendo a foto original…');
  await ocrWorker.setParameters({tessedit_pageseg_mode:'11'});
  const original=await ocrWorker.recognize(source);texts.push(original.data.text||'');
  let canvas=null;
  try{
   const bitmap=await createImageBitmap(source);
   const scale=Math.min(3,Math.max(1.5,2600/Math.max(bitmap.width,bitmap.height)));
   canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
   const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
   const image=ctx.getImageData(0,0,canvas.width,canvas.height),px=image.data;
   for(let i=0;i<px.length;i+=4){
    const gray=.299*px[i]+.587*px[i+1]+.114*px[i+2];
    const value=Math.max(0,Math.min(255,(gray-128)*1.65+128));
    px[i]=px[i+1]=px[i+2]=value;
   }
   ctx.putImageData(image,0,0);
   say('Melhorando contraste e relendo a etiqueta…');
   await ocrWorker.setParameters({tessedit_pageseg_mode:'6'});
   const enhanced=await ocrWorker.recognize(canvas);texts.push(enhanced.data.text||'');
   // Algumas etiquetas têm os identificadores em áreas separadas. Lê também faixas da imagem.
   const regions=[
    [0,0,canvas.width,Math.round(canvas.height*.58)],
    [0,Math.round(canvas.height*.30),canvas.width,Math.round(canvas.height*.70)]
   ];
   await ocrWorker.setParameters({tessedit_pageseg_mode:'11'});
   for(const [x,y,w,h] of regions){
    const crop=document.createElement('canvas');crop.width=w;crop.height=h;
    crop.getContext('2d').drawImage(canvas,x,y,w,h,0,0,w,h);
    const part=await ocrWorker.recognize(crop);texts.push(part.data.text||'');
   }
  }catch(imageError){console.warn('Pré-processamento OCR:',imageError)}
  const fullText=texts.join('\n');
  console.log('[Coletor OCR] Texto reconhecido:',fullText);
  const lines=fullText.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const normDigits=value=>String(value||'').toUpperCase()
   .replace(/[OQD]/g,'0').replace(/[IL|]/g,'1').replace(/Z/g,'2').replace(/S/g,'5').replace(/B/g,'8').replace(/[^0-9]/g,'');
  const luhn=value=>{
   if(value.length!==15)return false;let sum=0;
   for(let i=0;i<15;i++){let n=Number(value[i]);if(i%2===1){n*=2;if(n>9)n-=9}sum+=n}
   return sum%10===0;
  };
  const candidates=[];
  // Captura números contínuos e números quebrados por espaços/hífens em mais de uma linha.
  const joined=lines.join(' ');
  const rawMatches=joined.match(/[0-9OQDIL|ZSB](?:[\s.:_\-]*[0-9OQDIL|ZSB]){13,19}/gi)||[];
  for(const raw of rawMatches){
   const value=normDigits(raw);
   if(value.length>=14&&value.length<=17){
    const normalized=value.length>15?value.slice(-15):value;
    if(normalized.length===15)candidates.push({value:normalized,valid:luhn(normalized)});
   }
  }
  const unique=[...new Map(candidates.map(x=>[x.value,x])).values()];
  const labelled=(label)=>{
   const re=label==='imei'?/IMEI\s*[-:#]?\s*1\b|IMEI1\b/i:/IMEI\s*[-:#]?\s*2\b|IMEI2\b/i;
   for(let i=0;i<lines.length;i++){
    if(!re.test(lines[i]))continue;
    const near=[lines[i],lines[i+1]||'',lines[i+2]||''].join(' ');
    const match=near.match(/[0-9OQDIL|ZSB](?:[\s.:_\-]*[0-9OQDIL|ZSB]){13,19}/i);
    if(match){const value=normDigits(match[0]);if(value.length===15)return value;if(value.length>15)return value.slice(-15)}
   }
   return '';
  };
  const firstLabel=labelled('imei'),secondLabel=labelled('imei2');
  const choose=(preferred,used=[])=>preferred&&!used.includes(preferred)?preferred:(unique.filter(x=>!used.includes(x.value)).sort((a,b)=>Number(b.valid)-Number(a.valid))[0]?.value||'');
  const imei1=choose(firstLabel),imei2=choose(secondLabel,[imei1].filter(Boolean));
  if(imei1)$('imei').value=imei1;
  if(imei2)$('imei2').value=imei2;
  const serialLabel=/(?:S\s*\/?\s*N|SERIAL(?:\s*(?:NO\.?|NUMBER))?|SER\.?\s*NO\.?|SN)\b/i;
  let sn='';
  for(let i=0;i<lines.length;i++){
   if(!serialLabel.test(lines[i]))continue;
   let value=lines[i].replace(/.*?(?:S\s*\/?\s*N|SERIAL(?:\s*(?:NO\.?|NUMBER))?|SER\.?\s*NO\.?|SN)\s*[:#=\-]?/i,'').trim();
   if(!value)value=(lines[i+1]||'').trim();
   value=value.replace(/[^A-Z0-9-]/gi,'');
   if(value.length>=5&&value.length<=40&&!/^\d{15}$/.test(value)){sn=value;break}
  }
  // Usa texto de barras como reforço, sem sobrescrever identificadores já encontrados pelo OCR.
  let barcodeCount=0;
  try{
   if(window.ZXing){
    const bitmap=await createImageBitmap(source);
    const reader=new ZXing.MultiFormatReader();
    const hints=new Map();if(ZXing.DecodeHintType){hints.set(ZXing.DecodeHintType.TRY_HARDER,true)}
    reader.setHints(hints);
    const canvasBarcode=document.createElement('canvas');canvasBarcode.width=bitmap.width;canvasBarcode.height=bitmap.height;
    const bctx=canvasBarcode.getContext('2d');bctx.drawImage(bitmap,0,0);bitmap.close();
    const pixels=bctx.getImageData(0,0,canvasBarcode.width,canvasBarcode.height);
    const binary=new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(new ZXing.RGBLuminanceSource(pixels.data,canvasBarcode.width,canvasBarcode.height)));
    try{const result=reader.decode(binary);const val=String(result.getText()||'');const d=normDigits(val);if(d.length===15){if(!$('imei').value)$('imei').value=d;else if(!$('imei2').value&&d!==$('imei').value)$('imei2').value=d}else if(!sn&&val.length>=5&&val.length<=40)sn=val;barcodeCount++}catch(e){}
   }
  }catch(e){console.warn('Leitor de código de barras:',e)}
  if(sn)$('sn').value=sn;
  await persistDraft();progress.style.width='100%';
  const got1=digits($('imei').value).length===15,got2=digits($('imei2').value).length===15,gotSn=!!$('sn').value.trim();
  const found=[got1?'IMEI 1':'',got2?'IMEI 2':'',gotSn?'SN':''].filter(Boolean);
  const missing=[!got1?'IMEI 1':'',!got2?'IMEI 2':'',!gotSn?'SN':''].filter(Boolean);
  if(found.length)say('Leitura concluída. Identificado: '+found.join(', ')+'. '+(missing.length?'Ainda não foi possível localizar: '+missing.join(', ')+'.':'Confira os dados antes de adicionar ao lote.'));
  else say('O OCR não conseguiu reconhecer os identificadores. Aumente a iluminação, aproxime a etiqueta e fotografe de frente, sem reflexo. Você também pode preencher os campos manualmente.');
  if(!fullText.trim())say('A imagem foi aberta, mas o OCR não reconheceu nenhum texto. Tente uma foto mais nítida e focada.');
 }catch(error){
  console.error('[Coletor OCR] Falha:',error);
  say('Falha na leitura OCR: '+(error.message||error)+'. Recarregue a página e tente novamente.');
 }finally{button.disabled=false}
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
