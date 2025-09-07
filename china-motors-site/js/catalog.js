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

  // Галерея
  const gModal = document.getElementById('gallery');
  const gTitle = document.getElementById('gTitle');
  const gMain  = document.getElementById('gMain');
  const gThumbs= document.getElementById('gThumbs');
  const gPrev  = document.getElementById('gPrev');
  const gNext  = document.getElementById('gNext');
  const gClose = document.getElementById('gClose');

  gThumbs.addEventListener('click', e => {
    const i = e.target.dataset.i;
    if (i !== undefined) {
      gIdx = Number(i);
      drawGallery();
    }
  });

  const nfRU = new Intl.NumberFormat('ru-RU');
  const fmtPrice = n => (n===0 || n) ? `${nfRU.format(Number(n))}$` : 'Цена по запросу';
  const escHTML = s => String(s ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const escAttr = s => escHTML(s).replace(/"/g,'&quot;');

  function canonBody(rawTitle, rawBody){
    const s = `${rawTitle} ${rawBody}`.toLowerCase();
    if (s.includes('рефриж') || s.includes('refriger')) return 'Рефрижератор';
    if (s.includes('фургон') || s.includes('isoterm') || s.includes('изотерм')) return 'Автофургон';
    if (s.includes('ямобур') || s.includes('бкм') || s.includes('бурильн') || s.includes('буровая') || s.includes('бурение')) return 'Ямобур машины для бурения';
    if (s.includes('молоковоз') || s.includes('milk')) return 'Молоковоз';
    if ((s.includes('топлив') && s.includes('заправ')) || s.includes('автозаправ') || s.includes('топливораздат')) return 'Топливозаправщик';

    if (s.includes('полуприцеп')) return 'Полуприцепы';
    if (!s.includes('полуприцеп') && s.includes('прицеп')) return 'Прицепы';
    if (s.includes('самосвал')) return 'Самосвал';
    if (s.includes('тягач') || s.includes('седельный')) return 'Тягач';
    if (s.includes('манипулятор')) return 'Манипулятор';
    if (s.includes('кран')) return 'Кран';
    if (s.includes('миксер') || s.includes('бетономеш')) return 'Миксер';
    if (s.includes('бензовоз') || s.includes('топливовоз')) return 'Бензовоз';
    if (s.includes('автовышк')) return 'Автовышка';
    if (s.includes('ассенизатор')) return 'Ассенизатор';
    if (s.includes('поливомо')) return 'Поливомоечная машина';
    if (s.includes('спец') || s.includes('экскаватор') || s.includes('погрузчик')) return 'Спец. техника';
    return rawBody || 'Спец. техника';
  }

  function pickBodyRaw(v){
    return (
      v.body_type ?? v.bodyType ?? v.body ?? v.body_name ?? v.bodytext ??
      v.configuration ?? v.config ?? v.spec ?? v.specs ?? v.drive ?? v.drive_type ??
      v.chassis ?? v.type_details ?? v.type_info ?? v.type_extra ?? ''
    );
  }

  function makeCalcName(v, fallbackTitle){
    const brand = (v.brand || '').trim();
    const model = (v.model || '').trim();
    if (brand || model) return `${brand} ${model}`.trim();
    const t = fallbackTitle.replace(/\s{2,}/g,' ').trim();
    const cleaned = t
      .replace(/самосвал/ig,'')
      .replace(/тягач/ig,'')
      .replace(/полуприцеп/ig,'')
      .replace(/прицеп/ig,'')
      .replace(/евро\s*\d/ig,'')
      .replace(/\b\d+\*\d+\b/ig,'')
      .replace(/\s{2,}/g,' ')
      .trim();
    return cleaned.split(' ').slice(0,4).join(' ') || t;
  }

  function normalize(v){
    const title   = [v.brand, v.model, v.name].filter(Boolean).join(' ').trim() || 'Без названия';
    const mainImg = v.image_url || (Array.isArray(v.images) && v.images[0]) || v.photo_url || '';
    const images  = Array.isArray(v.images) && v.images.length ? v.images : (mainImg ? [mainImg] : []);
    const priceNum= (v.price_usd ?? v.usd_price ?? v.priceUSD ?? null);

    const bodyRawText = String(pickBodyRaw(v) || '').trim();
    const rawForCanon = bodyRawText || (v.type ?? v.category ?? v.kind ?? '');
    const bodyCanon   = canonBody(title, String(rawForCanon || ''));

    const calcName    = makeCalcName(v, title);

    return {
      id: v.id ?? '',
      title,
      mainImg, images,
      priceNum: (priceNum || priceNum===0) ? Number(priceNum) : null,
      priceText: fmtPrice(priceNum),
      bodyTypeRaw: bodyRawText,
      bodyType: bodyCanon,
      calcName
    };
  }

  function cardHTML(x){
    const bodyRow = `
      <div class="meta-row">
        <i class="fa-solid fa-car-side"></i>
        <span>Body type:</span> <b>${escHTML(x.bodyTypeRaw || '—')}</b>
      </div>
    `;
    return `
      <div class="feature-card" data-id="${x.id}">
        <div class="card-image">
          ${x.mainImg
            ? `<img src="${escAttr(x.mainImg)}" alt="${escAttr(x.title)}" class="js-open-gallery">`
            : `<div style="height:240px;background:#f3f4f6;display:flex;align-items:center;justify-content:center">Фото позже</div>`}
        </div>
        <div class="card-content">
          <h3 style="margin:6px 0 8px">${escHTML(x.title)}</h3>
          ${bodyRow}
          <div class="price">${x.priceText}</div>
          <div class="card-actions">
            <button class="btn js-open-gallery"><i class="fa fa-images"></i> Фотографии</button>
            <a class="btn btn-ghost"
               href="calculator.html?name=${encodeURIComponent(x.calcName)}&title=${encodeURIComponent(x.title)}&price=${encodeURIComponent(x.priceNum ?? '')}&body=${encodeURIComponent(x.bodyType)}&body_raw=${encodeURIComponent(x.bodyTypeRaw || '')}">
              <i class="fa fa-calculator"></i> Рассчитать
            </a>
          </div>
        </div>
      </div>`;
  }

  function render(list){
    grid.innerHTML = list.map(cardHTML).join('');
  }

  // Галерея
  let gIdx=0,gImgs=[];
  function openGallery(item){
    gImgs = Array.isArray(item.images) && item.images.length ? item.images.map(String) : (item.mainImg?[item.mainImg]:[]);
    if (!gImgs.length) return;
    gIdx=0;
    gTitle.textContent=item.title;
    drawGallery();
    gModal.classList.add('open');
    gModal.setAttribute('aria-hidden','false');
  }
  function drawGallery(){
    gMain.src=gImgs[gIdx];
    gMain.alt=`Фото ${gIdx+1} из ${gImgs.length}`;
    gThumbs.innerHTML=gImgs.map((src,i)=>`<img src="${escAttr(src)}" data-i="${i}" class="${i===gIdx?'active':''}">`).join('');
  }
  function closeGallery(){ gModal.classList.remove('open'); gModal.setAttribute('aria-hidden','true'); gMain.removeAttribute('src'); }
  gPrev?.addEventListener('click',()=>{ if(!gImgs.length) return; gIdx=(gIdx-1+gImgs.length)%gImgs.length; drawGallery(); });
  gNext?.addEventListener('click',()=>{ if(!gImgs.length) return; gIdx=(gIdx+1)%gImgs.length; drawGallery(); });
  gClose?.addEventListener('click',closeGallery);
  gModal?.addEventListener('click',e=>{ if(e.target===gModal) closeGallery(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeGallery(); });

  // Фильтр/сортировка
  let all=[], current=[];

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.js-open-gallery');
    if (!btn) return;
    const card = btn.closest('.feature-card');
    const id = card?.getAttribute('data-id');
    const item = current.find(v => String(v.id)===String(id));
    if (item) openGallery(item);
  });

  function applyFilters(){
    const b=(bodyEl?.value||'').trim();
    current = all.filter(x => !b || x.bodyType===b);
  }
  function applySort(){
    const s=sortEl?.value||'';
    if (s==='price_asc')  current.sort((a,b)=>(a.priceNum??Infinity)-(b.priceNum??Infinity));
    if (s==='price_desc') current.sort((a,b)=>(b.priceNum??-Infinity)-(a.priceNum??-Infinity));
  }
  function refilter(){ applyFilters(); applySort(); render(current); }
  bodyEl?.addEventListener('change', refilter);
  sortEl?.addEventListener('change', refilter);

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
