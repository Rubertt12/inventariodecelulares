(() => {
  const $ = id => document.getElementById(id);
  const state = { categories: [], assets: [], loaded: false, loading: false };
  const labels = { available: 'Disponível', in_use: 'Em uso', maintenance: 'Em manutenção', reserved: 'Reservado', retired: 'Baixado', lost: 'Extraviado' };
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const feedback = (message, error = false) => { const el=$('uaFeedback'); if(el){el.textContent=message;el.classList.toggle('error',error);} };
  async function request(url, options={}) { const response=await fetch(url,{credentials:'same-origin',headers:{'Content-Type':'application/json',...(options.headers||{})},...options}); const data=await response.json().catch(()=>({})); if(!response.ok) throw new Error(data.message||'Falha na comunicação com o servidor.'); return data; }
  function renderCategories() {
    const options=state.categories.map(c=>'<option value="'+c.id+'">'+escapeHtml(c.name)+'</option>').join('');
    $('uaCategory').innerHTML='<option value="">Selecione</option>'+options;
    $('uaCategoryFilter').innerHTML='<option value="">Todas as categorias</option>'+options;
    renderDynamicFields();
  }
  function renderDynamicFields() {
    const category=state.categories.find(c=>String(c.id)===$('uaCategory').value); const host=$('uaDynamicFields');
    if(!category){host.innerHTML='';return;}
    host.innerHTML=category.fields.map(field=>{
      const label=escapeHtml(field.label)+(field.is_required?' *':''); const name=escapeHtml(field.field_key); let control='';
      if(field.data_type==='boolean') control='<label class="ua-checkbox-field"><input type="checkbox" name="custom_'+name+'"> Sim</label>';
      else if(field.data_type==='select'||field.data_type==='multiselect'){const opts=Array.isArray(field.options)?field.options:[];control='<select name="custom_'+name+'" '+(field.is_required?'required':'')+' '+(field.data_type==='multiselect'?'multiple class="ua-multiselect"':'')+'><option value="">Selecione</option>'+opts.map(v=>'<option value="'+escapeHtml(v)+'">'+escapeHtml(v)+'</option>').join('')+'</select>';}
      else {const type=({number:'number',date:'date',url:'url'})[field.data_type]||'text';control='<input type="'+type+'" name="custom_'+name+'" '+(field.is_required?'required':'')+'>'}
      return '<label class="ua-field">'+label+control+'</label>';
    }).join('');
  }
  function renderAssets() {
    const rows=state.assets; $('uaTotal').textContent=rows.length; $('uaAvailable').textContent=rows.filter(a=>a.status==='available').length; $('uaInUse').textContent=rows.filter(a=>a.status==='in_use').length; $('uaMaintenance').textContent=rows.filter(a=>a.status==='maintenance').length;
    $('uaAssetsBody').innerHTML=rows.length?rows.map(a=>'<tr><td><strong>'+escapeHtml(a.asset_tag||'—')+'</strong><span class="ua-asset-sub">'+escapeHtml(a.serial_number||'Sem número de série')+'</span></td><td><span class="ua-asset-name">'+escapeHtml([a.manufacturer,a.model].filter(Boolean).join(' ')||'Ativo sem modelo')+'</span></td><td>'+escapeHtml(a.category_name)+'</td><td>'+escapeHtml(a.location||'—')+'</td><td>'+escapeHtml(a.assigned_to_name||'—')+'</td><td><span class="ua-status">'+escapeHtml(labels[a.status]||a.status)+'</span></td></tr>').join(''):'<tr><td colspan="6" class="ua-empty">Nenhum ativo encontrado. Cadastre o primeiro equipamento ao lado.</td></tr>';
  }
  async function loadCategories() { state.categories=await request('/api/universal/categories'); renderCategories(); }
  async function loadAssets() { const params=new URLSearchParams(); if($('uaCategoryFilter').value)params.set('category',$('uaCategoryFilter').value); if($('uaSearch').value.trim())params.set('search',$('uaSearch').value.trim()); state.assets=await request('/api/universal/assets?'+params.toString()); renderAssets(); }
  window.loadUniversalAssets=async function(force=false){if(state.loading||(!force&&state.loaded))return;state.loading=true;feedback('Carregando inventário...');try{if(!state.categories.length)await loadCategories();await loadAssets();state.loaded=true;feedback(state.assets.length+' ativo(s) no inventário.');}catch(error){feedback(error.message,true);$('uaAssetsBody').innerHTML='<tr><td colspan="6" class="ua-empty">'+escapeHtml(error.message)+'</td></tr>';}finally{state.loading=false;}};
  document.addEventListener('DOMContentLoaded',()=>{
    $('uaCategory').addEventListener('change',renderDynamicFields);
    $('uaCategoryFilter').addEventListener('change',()=>{state.loaded=false;window.loadUniversalAssets(true);});
    $('uaSearch').addEventListener('input',()=>{clearTimeout(window.uaSearchDelay);window.uaSearchDelay=setTimeout(()=>{state.loaded=false;window.loadUniversalAssets(true);},250);});
    $('uaRefreshBtn').addEventListener('click',()=>{state.loaded=false;window.loadUniversalAssets(true);});
    $('uaAssetForm').addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget;const data=new FormData(form);const payload={};for(const key of ['category_id','asset_tag','serial_number','manufacturer','model','status','location','assigned_to_name','assigned_to_identifier','purchase_date','warranty_until','notes'])payload[key]=data.get(key)||null;payload.custom_values={};for(const category of state.categories){for(const field of category.fields){const key='custom_'+field.field_key;const value=data.get(key);if(value!==null&&value!=='')payload.custom_values[field.field_key]=field.data_type==='number'?Number(value):value;else if(field.data_type==='boolean'&&form.elements[key])payload.custom_values[field.field_key]=form.elements[key].checked;}}
      const button=$('uaSubmitBtn');button.disabled=true;button.textContent='Salvando...';try{await request('/api/universal/assets',{method:'POST',body:JSON.stringify(payload)});form.reset();renderDynamicFields();state.loaded=false;await window.loadUniversalAssets(true);feedback('Ativo cadastrado com sucesso.');}catch(error){feedback(error.message,true);}finally{button.disabled=false;button.textContent='Cadastrar ativo';}
    });
  });
})();
