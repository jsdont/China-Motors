// Каталог из Django API + галерея + кнопка "Рассчитать".
// Главный фикс: чтение <meta name="api-base">, чтобы не ходить на статический домен.

document.addEventListener('DOMContentLoaded', () => {
  const isFile = location.protocol === 'file:';
  const isLocalhost = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const metaBase = document.querySelector('meta[name="api-base"]')?.content?.trim();

  // приоритет: meta -> локалка -> origin (как запасной вариант)
  let API_BASE = metaBase || (isFile || isLocalhost ? 'http://127.0.0.1:8000' : location.origin);
  API_BASE = API_BASE.replace(/\/+$/,''); // без хвостового /

  console.debug('[catalog] API_BASE =', API_BASE);

  const grid   = document.getElementById('grid');
  const bodyEl = document.getElementById('body');
  const sortEl = document.getElementById('sort');
  const searchEl = document.getElementById('search');

  // Галерея
  const gModal = document.getElementById('gallery');
  const gTitle = document.getElementById('gTitle');
  const gMain  = document.getElementById('gMain');
  const gThumbs= document.getElementById('gThumbs');
  const gPrev  = document.getElementById('gPrev');
  const gNext  = document.getElementById('gNext');
  const gClose = document.getElementById('gClose');

  const nfRU = new Intl.NumberFormat('ru-RU');
  const fmtPrice = n => (n===0 || n) ? `${nfRU.format(Number(n))}$` : 'Цена по запросу';
  const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const escHTML = s => String(s ?? '').replace(/[&<>"']/g,m=>escapeMap[m]);
  const escAttr = escHTML;

  function canonBody(rawTitle, rawBody){
    const s = `${rawTitle} ${rawBody}`.toLowerCase();
    if (s.includes('рефриж') || s.includes('refriger')) return 'Рефрижератор';
    if (s.includes('фургон') || s.includes('isoterm') || s.includes('изотерм')) return 'Автофургон';
    if (s.includes('ямобур') || s.includes('бкм') || s.includes('бурильн') || s.includes('буровая') || s.includes('бурение')) return 'Ямобур машины для бурения';
    if (s.includes('молоковоз') || s.includes('milk')) return 'Молоковоз';
    if ((s.includes('топлив') && s.includes('заправ')) || s.includes('автозаправ') || s.includes('топливораздат')) return 'Топливозаправщик';

    if (s.includes('полуприцеп')) return 'Полуприцепы';

    gModal.classList.add('open');
    gModal.setAttribute('aria-hidden','false');
  }
  function drawGallery(){
    gMain.src=gImgs[gIdx];
    gMain.alt=`Фото ${gIdx+1} из ${gImgs.length}`;
    gThumbs.innerHTML=gImgs.map((src,i)=>`<img src="${escAttr(src)}" data-i="${i}" class="${i===gIdx?'active':''}">`).join('');
    gThumbs.querySelectorAll('img').forEach(img=>img.addEventListener('click',()=>{gIdx=Number(img.dataset.i);drawGallery();}));
  }
  function closeGallery(){
    gModal.classList.remove('open');
    gModal.setAttribute('aria-hidden','true');
    gMain.removeAttribute('src');
    gThumbs.innerHTML = '';
    gImgs = [];
    gIdx = 0;
  }
  gPrev?.addEventListener('click',()=>{ if(!gImgs.length) return; gIdx=(gIdx-1+gImgs.length)%gImgs.length; drawGallery(); });
  gNext?.addEventListener('click',()=>{ if(!gImgs.length) return; gIdx=(gIdx+1)%gImgs.length; drawGallery(); });
  gClose?.addEventListener('click',closeGallery);
  gModal?.addEventListener('click',e=>{ if(e.target===gModal) closeGallery(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeGallery(); });

  // Фильтр/сортировка
  let all=[], current=[];
  function applyFilters(){
    const b=(bodyEl?.value||'').trim();
    const q=(searchEl?.value||'').trim().toLowerCase();
    current = all.filter(x => {
      const bodyOk=!b || x.bodyType===b;
      const searchOk=!q || x.title.toLowerCase().includes(q) || x.bodyType.toLowerCase().includes(q);
      return bodyOk && searchOk;
    });
  }
  function applySort(){
    const s=sortEl?.value||'';
    if (s==='price_asc')  current.sort((a,b)=>(a.priceNum??Infinity)-(b.priceNum??Infinity));
    if (s==='price_desc') current.sort((a,b)=>(b.priceNum??-Infinity)-(a.priceNum??-Infinity));
  }
  function refilter(){ applyFilters(); applySort(); render(current); }
  bodyEl?.addEventListener('change', refilter);
  sortEl?.addEventListener('change', refilter);
  searchEl?.addEventListener('input', refilter);

  // Загрузка
  async function load(){
    try{
      grid.innerHTML = `<div class="loading">Загрузка...</div>`;
      const url = `${API_BASE}/api/vehicles/`;
      const r = await fetch(url, { headers:{'Accept':'application/json'} });
      if (!r.ok) throw new Error(`HTTP ${r.status} at ${url}`);
      const data = await r.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data.results) ? data.results : []);
      all = list.map(normalize);
      refilter();
    }catch(e){
      console.error('catalog load failed:', e);
      grid.innerHTML = `<div class="error">Не удалось загрузить каталог</div>`;
    }
  }

  load();
});
