(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const toast=(msg)=>{let t=$('.toast'); if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)} t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)};
  window.toggleDrawer=(id)=>{const el=document.getElementById(id); if(el) el.classList.toggle('open')};
  window.copyText=(text)=>{navigator.clipboard?.writeText(text).then(()=>toast('Copied to clipboard.')).catch(()=>toast('Copy is not available in this browser.'))};

  // Secret submission — intentionally local-only prototype storage.
  const secretForm=$('#secretForm');
  if(secretForm){
    secretForm.addEventListener('submit',e=>{
      e.preventDefault();
      const value=$('#secretText').value.trim();
      if(!value){toast('Write something first.');return}
      const id='SECRET #'+String((parseInt(localStorage.getItem('lumiSecretCount')||'0',10)+1)).padStart(3,'0');
      localStorage.setItem('lumiSecretCount',String(parseInt(localStorage.getItem('lumiSecretCount')||'0',10)+1));
      const out=$('#secretResult');
      out.querySelector('.secret-id').textContent=id;
      out.querySelector('.secret-copy').textContent='“'+value+'”';
      out.classList.add('show');
      $('#secretText').value='';
      toast('The secret has been recorded in this browser.');
    });
  }
  const copySecret=$('#copySecret');
  if(copySecret){copySecret.addEventListener('click',()=>{const id=$('#secretResult .secret-id').textContent;const txt=$('#secretResult .secret-copy').textContent;copyText(id+'\n'+txt)})}

  // Theory interaction
  $$('.choice').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.choice').forEach(x=>x.classList.remove('selected'));
    btn.classList.add('selected');
    const result=$('#theoryResult');
    if(result){
      result.innerHTML='<strong>THEORY RECORDED.</strong><br><br>Rachel has added your interpretation to the case. The archive does not confirm whether you are right.';
      result.classList.add('show');
    }
    localStorage.setItem('lumiTheory',btn.dataset.theory||'unknown');
    toast('Your theory was added to the investigation.');
  }));

  // Community archive — local prototype records + export.
  const communityForm=$('#communityForm');
  const renderCommunity=()=>{
    const list=$('#communityList'); if(!list)return;
    const records=JSON.parse(localStorage.getItem('lumiCommunity')||'[]');
    list.innerHTML=records.length?records.map((r,i)=>`<div class="community-item"><div class="id">COMMUNITY RECORD #${String(i+1).padStart(3,'0')}</div><strong>${escapeHtml(r.title)}</strong><p>${escapeHtml(r.text)}</p><div class="mono muted">${escapeHtml(r.location||'LOCATION WITHHELD')}</div></div>`).join(''):'<div class="panel"><strong>NO COMMUNITY RECORDS YET.</strong><p>Be the first investigator to leave a trace.</p></div>';
  };
  const escapeHtml=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  if(communityForm){
    renderCommunity();
    communityForm.addEventListener('submit',e=>{
      e.preventDefault();
      const title=$('#communityTitle').value.trim(),text=$('#communityText').value.trim(),location=$('#communityLocation').value.trim();
      if(!title||!text){toast('Add a title and an observation.');return}
      const records=JSON.parse(localStorage.getItem('lumiCommunity')||'[]');records.unshift({title,text,location});localStorage.setItem('lumiCommunity',JSON.stringify(records.slice(0,12)));
      e.target.reset();renderCommunity();toast('Community record added to this browser.');
    });
  }
  const clearCommunity=$('#clearCommunity');if(clearCommunity)clearCommunity.addEventListener('click',()=>{localStorage.removeItem('lumiCommunity');renderCommunity();toast('Local community records cleared.')});

  // Active nav item based on current page.
  const page=document.body.dataset.page; if(page){const link=$(`.nav a[data-page="${page}"]`);if(link)link.classList.add('active')}
})();
