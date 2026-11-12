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
    const category=state.categories.find(c=>String(c.id)===$('uaCategory').value);
    const host=$('uaDynamicFields');
    if(!category){host.innerHTML='';return;}
    host.innerHTML=category.fields.map(field=>{
      const label=escapeHtml(field.label)+(field.is_required?' *':'');
      const name=escapeHtml(field.field_key);
      let control='';
      if(field.data_type==='boolean') control='<label class="ua-checkbox-field"><input type="checkbox" name="custom_'+name+'"> Sim</label>';
      else if(field.data_type==='select'||field.data_type==='multiselect'){
        const opts=Array.isArray(field.options)?field.options:[];
        if(opts.length) control='<select name="custom_'+name+'" '+(field.is_required?'required':'')+' '+(field.data_type==='multiselect'?'multiple class="ua-multiselect"':'')+'><option value="">Selecione</option>'+opts.map(v=>'<option value="'+escapeHtml(v)+'">'+escapeHtml(v)+'</option>').join('')+'</select>';
        else control='<input type="text" name="custom_'+name+'" '+(field.is_required?'required':'')+' placeholder="Informe '+escapeHtml(field.label.toLowerCase())+'">';
      } else {
        const type=({number:'number',date:'date',url:'url'})[field.data_type]||'text';
        control='<input type="'+type+'" name="custom_'+name+'" '+(field.is_required?'required':'')+'>';
      }
      return '<label class="ua-field">'+label+control+'</label>';
    }).join('');
  }
  async function loadCategories() { state.categories=await request('/api/universal/categories'); renderCategories(); }
  async function loadAssets() { const params=new URLSearchParams(); if($('uaCategoryFilter').value)params.set('category',$('uaCategoryFilter').value); if($('uaSearch').value.trim())params.set('search',$('uaSearch').value.trim()); state.assets=await request('/api/universal/assets?'+params.toString()); renderAssets(); }
  window.loadUniversalAssets=async function(force=false){if(state.loading||(!force&&state.loaded))return;state.loading=true;feedback('Carregando inventário...');try{if(!state.categories.length)await loadCategories();await loadAssets();state.loaded=true;feedback(state.assets.length+' ativo(s) no inventário.');}catch(error){feedback(error.message,true);$('uaAssetsBody').innerHTML='<tr><td colspan="6" class="ua-empty">'+escapeHtml(error.message)+'</td></tr>';}finally{state.loading=false;}};

  async function renderCategorySettings() {
    const list=$('uaCategorySettingsList'); if(!list) return;
    try {
      const categories=await request('/api/universal/categories');
      list.innerHTML=categories.length?categories.map(c=>'<li><span><strong>'+escapeHtml(c.name)+'</strong><small>'+escapeHtml(c.description||'Categoria de ativos')+'</small></span><em>'+((c.is_system)?'Padrão':'Personalizada')+'</em></li>').join(''):'<li>Nenhuma categoria cadastrada.</li>';
    } catch(error) { list.innerHTML='<li>'+escapeHtml(error.message)+'</li>'; }
  }
  function initializeCategorySettings() {
    const name=$('uaNewCategoryName'), key=$('uaNewCategoryKey'), form=$('uaCategoryForm');
    if(!form) return;
    name.addEventListener('input',()=>{if(!key.dataset.edited)key.value=name.value.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');});
    key.addEventListener('input',()=>{key.dataset.edited='true';key.value=key.value.toLowerCase().replace(/[^a-z0-9_-]/g,'');});
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      const button=$('uaAddCategoryBtn'), feedbackBox=$('uaCategorySettingsFeedback');
      button.disabled=true;button.textContent='Salvando...';
      try {
        await request('/api/universal/categories',{method:'POST',body:JSON.stringify({name:name.value.trim(),category_key:key.value.trim(),description:$('uaNewCategoryDescription').value.trim()})});
        feedbackBox.textContent='Categoria cadastrada. Ela já está disponível no formulário de ativos.';
        form.reset();key.dataset.edited='';
        state.categories=[];state.loaded=false;
        await loadCategories();await renderCategorySettings();
      } catch(error) { feedbackBox.textContent=error.message; }
      finally {button.disabled=false;button.textContent='Adicionar categoria';}
    });
    document.querySelectorAll('.settings-tab-btn[data-tab="categories"]').forEach(button=>button.addEventListener('click',renderCategorySettings));
  }

  document.addEventListener('DOMContentLoaded',()=>{
    initializeCategorySettings();
    $('uaCategory').addEventListener('change',renderDynamicFields);
    $('uaCategoryFilter').addEventListener('change',()=>{state.loaded=false;window.loadUniversalAssets(true);});
    $('uaSearch').addEventListener('input',()=>{clearTimeout(window.uaSearchDelay);window.uaSearchDelay=setTimeout(()=>{state.loaded=false;window.loadUniversalAssets(true);},250);});
    $('uaRefreshBtn').addEventListener('click',()=>{state.loaded=false;window.loadUniversalAssets(true);});
    $('uaAssetForm').addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget;const data=new FormData(form);const payload={};for(const key of ['category_id','asset_tag','serial_number','manufacturer','model','status','location','assigned_to_name','assigned_to_identifier','purchase_date','warranty_until','notes'])payload[key]=data.get(key)||null;payload.custom_values={};const selectedCategory=state.categories.find(c=>String(c.id)===String(payload.category_id));for(const field of (selectedCategory?.fields||[])){const key='custom_'+field.field_key;const control=form.elements[key];if(field.data_type==='boolean'){payload.custom_values[field.field_key]=Boolean(control&&control.checked);continue;}if(field.data_type==='multiselect'&&control){payload.custom_values[field.field_key]=Array.from(control.selectedOptions).map(option=>option.value);continue;}const value=data.get(key);if(value!==null&&value!=='')payload.custom_values[field.field_key]=field.data_type==='number'?Number(value):value;}
      const button=$('uaSubmitBtn');button.disabled=true;button.textContent='Salvando...';try{await request('/api/universal/assets',{method:'POST',body:JSON.stringify(payload)});form.reset();renderDynamicFields();state.loaded=false;await window.loadUniversalAssets(true);feedback('Ativo cadastrado com sucesso.');}catch(error){feedback(error.message,true);}finally{button.disabled=false;button.textContent='Cadastrar ativo';}
    });
  });
})();
