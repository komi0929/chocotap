/* ============================================ */
/*   chocotap — Main Application Logic          */
/*   Analog × Chill Edition                     */
/* ============================================ */

(function() {
  'use strict';

  const SK = {
    SHOPS: 'chocotap_shops',
    CHECKINS: 'chocotap_checkins',
    GALLERY: 'chocotap_gallery',
    REACTIONS: 'chocotap_reactions',
    MOSAICS: 'chocotap_mosaics',
    MY_RX: 'chocotap_my_reactions',
  };

  let shopData = [];
  let checkins = {};
  let galleryItems = [];
  let reactions = {};
  let myReactions = {};
  let mosaics = {};
  let currentFilter = 'all';

  // Pastel gradient combos for shop card visuals
  const GRADIENTS = [
    ['#f2c6a5','#fae0ce'], ['#e8b4b8','#f5d5d8'], ['#b4d5e1','#d4ebf2'],
    ['#c5b8d9','#ddd4ec'], ['#b8dcc8','#d4f0e0'], ['#f0e4a8','#f8f0cc'],
    ['#d4a9a0','#ecc8c0'], ['#a8c8d8','#c8e0ec'], ['#c8b0d0','#e0d0ec'],
    ['#d8c8a0','#f0e4c4'], ['#b0d0b8','#d0ecd8'], ['#e0b8c8','#f0d0dc'],
  ];

  // Chocolate SVG icon for card
  function chocoSVG(variant) {
    const fills = [
      ['#5c3d2e','#8b6244'], ['#6b4226','#a67c5b'], ['#4a3020','#7a5a3c'],
      ['#5e4535','#987060'], ['#3c2818','#6b4830'], ['#7a5a44','#b08868'],
    ];
    const [dark, light] = fills[variant % fills.length];
    return `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <rect x="4" y="10" width="32" height="20" rx="3" fill="${dark}"/>
      <rect x="4" y="10" width="32" height="10" rx="3" fill="${light}"/>
      <line x1="16" y1="10" x2="16" y2="30" stroke="${dark}" stroke-width="1" opacity="0.2"/>
      <line x1="26" y1="10" x2="26" y2="30" stroke="${dark}" stroke-width="1" opacity="0.2"/>
    </svg>`;
  }

  // Specialty descriptions
  const SPECS = {
    'SATURDAYS': 'Bean to Bar — 北海道の自家焙煎',
    'SOIL': '大地のカカオ — 札幌の人気ショップ',
    'Minimal': 'Bean to Bar — 最小限で最大の体験',
    'green bean': 'Bean to Bar — 産地直送カカオ専門',
    'Dandelion': 'SF発 — 世界が認めたクラフト',
    'CRAFT CHOCOLATE WORKS': '手づくりの一粒一粒',
    'USHIO': '尾道発 — 瀬戸内の風を感じる',
    'TIMELESS': '沖縄 — 南国カカオの楽園',
    'nel': '中目黒の隠れ家チョコ工房',
    'Cacaomono': '発酵カカオ唯一無二の専門店',
    'MOKA': '名古屋 — ファクトリー併設',
    'Kad Kokoa': 'カカオ × ベイク — 焼き菓子も絶品',
    'SUNNY': '太陽のように明るい空間',
    'Quon': '太宰府 — 歴史の街のモダンチョコ',
    'tabi cacao': '旅するカカオ — 地元愛あふれる',
    'FIST BUMP': 'コーヒー × チョコの焙煎',
    'Le Chocolat': 'フレンチスタイルの繊細さ',
    'Dari K': '京都 — インドネシア直輸入',
    'BINGO': '備後のチョコラトリー',
    'Ishibiki': '金沢 — 加賀の美意識',
    '33CACAO': '愛媛 — 柑橘王国のカカオ',
    'SHIMANTO': '清流とカカオの出会い',
    'felissimo': '神戸 — カカオの博物館',
    'Romance': '青森のロマンチックな一粒',
    'Crafty': '東北クラフトチョコの先駆者',
    'MURATA': '仙台 — デザートの宝石箱',
    'Wolves': '富山 — スモールバッチの極み',
    'CHOCOLATE JUNCTION': '熊本 — チョコの交差点',
    'Kiitos': '宮崎 — 北欧の風を南国に',
    'Bean to bar HIGASHIYA': '桜島を望むファクトリー',
    'OKINAWA CACAO': '島カカオの可能性',
    'Conche': '静岡 — 職人の技が光る',
    'Mimosa': '浜松 — 日だまりチョコ',
    'Recette': '岡山 — 上質なレシピ',
    'Fukuei': '郡山 — 珈琲とチョコの融合',
    'Kotje': '福島 — こだわりのショコラ',
    'Hisashi': '久 — 横浜の名匠チョコ',
    'VANITOY': '湘南のベーグル × チョコ',
    'CACAO broma': '陸前高田のブロマカカオ',
    'L\'AVENUE': '神戸 — パリスタイル',
    'TAKIBI': '焚火 — 大阪チョコパーク',
    'Euki': '奈良のヌサンタラカカオ',
    'イシガマ': '香川 — 石窯製菓の心',
    '6 Kaku': '福井の六角コーヒー',
  };

  function getSpec(name) {
    for (const [k, v] of Object.entries(SPECS)) { if (name.includes(k)) return v; }
    return 'Craft Chocolate';
  }

  function getGrad(i) { return GRADIENTS[i % GRADIENTS.length]; }

  // ========== Check SVG ===========
  const CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="14" height="14"><polyline points="4 12 10 18 20 6"/></svg>';

  // ========== INIT ==========
  function init() {
    loadState();
    setupSplash();
    setupTabs();
    setupMap();
    renderShopCards();
    setupShopFilters();
    setupCollection();
    setupGallery();
    setupAdmin();
    setupModal();
    updateStats();
  }

  function loadState() {
    try { shopData = JSON.parse(localStorage.getItem(SK.SHOPS)) || [...DEFAULT_SHOP_DATA]; } catch(e) { shopData = [...DEFAULT_SHOP_DATA]; }
    if (!localStorage.getItem(SK.SHOPS)) localStorage.setItem(SK.SHOPS, JSON.stringify(shopData));
    try { checkins = JSON.parse(localStorage.getItem(SK.CHECKINS)) || {}; } catch(e) { checkins = {}; }
    try { galleryItems = JSON.parse(localStorage.getItem(SK.GALLERY)) || []; } catch(e) { galleryItems = []; }
    try { reactions = JSON.parse(localStorage.getItem(SK.REACTIONS)) || {}; } catch(e) { reactions = {}; }
    try { mosaics = JSON.parse(localStorage.getItem(SK.MOSAICS)) || {}; } catch(e) { mosaics = {}; }
    try { myReactions = JSON.parse(localStorage.getItem(SK.MY_RX)) || {}; } catch(e) { myReactions = {}; }
  }

  function save(k, d) { localStorage.setItem(k, JSON.stringify(d)); }

  function setupSplash() {
    setTimeout(() => {
      const s = document.getElementById('splash');
      s.style.opacity = '0'; s.style.transition = 'opacity 0.6s';
      setTimeout(() => { s.classList.add('hidden'); document.getElementById('app').classList.remove('hidden'); }, 600);
    }, 2500);
  }

  function setupTabs() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
        if (btn.dataset.tab === 'gallery') renderGallery();
        if (btn.dataset.tab === 'collection') renderCollection();
        if (btn.dataset.tab === 'admin') updateAdminStats();
      });
    });
  }

  // ========== MAP ==========
  function setupMap() {
    document.getElementById('japan-map').appendChild(createJapanMapSVG());
    updateMapColors();
    renderShopPins();
    document.querySelectorAll('#japan-map svg path').forEach(p => {
      p.addEventListener('click', () => {
        const pref = p.getAttribute('data-pref');
        const shops = shopData.filter(s => s.prefecture === pref);
        if (shops.length) {
          const t = shops.find(s => !checkins[shopData.indexOf(s)]) || shops[0];
          openShopModal(shopData.indexOf(t));
        }
      });
    });
  }

  function updateMapColors() {
    const svg = document.querySelector('#japan-map svg'); if (!svg) return;
    const cts = {}, tots = {};
    shopData.forEach((s, i) => {
      tots[s.prefecture] = (tots[s.prefecture] || 0) + 1;
      if (checkins[i]) cts[s.prefecture] = (cts[s.prefecture] || 0) + 1;
    });
    svg.querySelectorAll('path').forEach(p => {
      const pref = p.getAttribute('data-pref');
      const t = tots[pref] || 0, c = cts[pref] || 0;
      p.classList.remove('pref-none','pref-white','pref-milk','pref-bitter');
      p.classList.add(t===0 ? 'pref-none' : c===0 ? 'pref-white' : c<t ? 'pref-milk' : 'pref-bitter');
    });
  }

  function renderShopPins() {
    const con = document.getElementById('shop-pins');
    const mapEl = document.querySelector('.map-container');
    con.innerHTML = '';
    const w = mapEl.offsetWidth, h = mapEl.offsetHeight;
    shopData.forEach((shop, i) => {
      if (!shop.lat || !shop.lng) return;
      const pos = latLngToSVG(shop.lat, shop.lng, w, h);
      const pin = document.createElement('div');
      pin.className = 'shop-pin' + (checkins[i] ? ' checked' : '');
      pin.style.left = pos.x + 'px'; pin.style.top = pos.y + 'px';
      pin.title = shop.name;
      pin.addEventListener('click', () => openShopModal(i));
      con.appendChild(pin);
    });
  }

  // ========== SHOP CARDS ==========
  function renderShopCards() {
    const con = document.getElementById('shop-cards'); con.innerHTML = '';
    const filtered = shopData.map((s, i) => ({ shop:s, idx:i })).filter(({ idx }) => {
      if (currentFilter === 'visited') return !!checkins[idx];
      if (currentFilter === 'not-visited') return !checkins[idx];
      return true;
    });
    if (!filtered.length) {
      con.innerHTML = '<div class="empty-state"><p>該当するショップがありません</p></div>';
      return;
    }
    filtered.forEach(({ shop, idx }) => {
      const vis = !!checkins[idx];
      const spec = getSpec(shop.name);
      const [g1, g2] = getGrad(idx);
      const place = PlacesService.getCachedPlace(shop.name);
      const photoUrl = place?.photos?.[0] ? PlacesService.getPhotoUrl(place.photos[0], 200) : '';
      const rating = place?.rating;
      const ratingCount = place?.ratingCount || 0;

      const card = document.createElement('div');
      card.className = 'shop-card';

      // Visual: photo or gradient fallback
      let visualHTML;
      if (photoUrl) {
        visualHTML = `<div class="shop-card-visual shop-card-photo"><img src="${photoUrl}" alt="" loading="lazy"></div>`;
      } else {
        visualHTML = `<div class="shop-card-visual" style="background:linear-gradient(135deg,${g1},${g2})">${chocoSVG(idx)}</div>`;
      }

      // Rating stars
      let ratingHTML = '';
      if (rating) {
        const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
        ratingHTML = `<span class="shop-card-rating">${stars} ${rating.toFixed(1)}<span class="rating-count">(${ratingCount})</span></span>`;
      }

      card.innerHTML = `
        ${visualHTML}
        <div class="shop-card-info">
          <div class="shop-card-name">${shop.name}</div>
          <div class="shop-card-meta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            ${shop.prefecture || '—'}
            ${ratingHTML}
          </div>
          <div class="shop-card-desc">${spec}</div>
        </div>
        <div class="shop-card-status ${vis ? 'status-visited' : 'status-not-visited'}">
          ${vis ? CHECK_SVG : ''}
        </div>
      `;
      card.addEventListener('click', () => openShopModal(idx));
      con.appendChild(card);
    });
  }

  function setupShopFilters() {
    document.querySelectorAll('.filter-pill').forEach(p => {
      p.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        currentFilter = p.dataset.filter;
        renderShopCards();
      });
    });
  }

  // ========== MODAL ==========
  let curIdx = -1;

  function setupModal() {
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    document.getElementById('photo-upload').addEventListener('change', handlePhoto);
    document.getElementById('confirm-checkin').addEventListener('click', confirmCheckin);
    document.getElementById('celebration-close').addEventListener('click', () => {
      document.getElementById('celebration').classList.add('hidden');
    });
  }

  function openShopModal(i) {
    curIdx = i;
    const s = shopData[i], vis = !!checkins[i];
    document.getElementById('modal-shop-name').textContent = s.name;

    // Places info
    const place = PlacesService.getCachedPlace(s.name);
    let prefLine = `${s.prefecture} · ${getSpec(s.name)}`;
    if (place?.rating) prefLine += ` · ★${place.rating.toFixed(1)}`;
    document.getElementById('modal-shop-pref').textContent = prefLine;

    const st = document.getElementById('modal-status');
    let statusHTML = '';

    // Show place photo in modal
    if (place?.photos?.[0]) {
      const bigPhoto = PlacesService.getPhotoUrl(place.photos[0], 600);
      statusHTML += `<img src="${bigPhoto}" alt="" class="modal-place-photo">`;
    }

    // Google Maps link
    if (place?.mapsUrl) {
      statusHTML += `<a href="${place.mapsUrl}" target="_blank" rel="noopener" class="modal-maps-link">Google Maps で開く →</a>`;
    }

    if (vis) {
      statusHTML += `<span class="status-checked">✓ Checked in — ${new Date(checkins[i].date).toLocaleDateString('ja-JP')}</span>`;
    } else {
      statusHTML += '<span class="status-unchecked">Not visited yet — upload a photo to check in.</span>';
    }
    st.innerHTML = statusHTML;

    document.getElementById('photo-preview').classList.add('hidden');
    document.getElementById('confirm-checkin').classList.add('hidden');
    document.getElementById('photo-upload').value = '';
    document.getElementById('shop-modal').classList.remove('hidden');
  }

  function closeModal() {
    document.getElementById('shop-modal').classList.add('hidden');
    curIdx = -1;
  }

  function handlePhoto(e) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        const mx = 400; let w = img.width, h = img.height;
        if (w > mx || h > mx) {
          if (w > h) { h = Math.round(h*mx/w); w = mx; } else { w = Math.round(w*mx/h); h = mx; }
        }
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        const u = c.toDataURL('image/jpeg', 0.7);
        document.getElementById('preview-img').src = u;
        document.getElementById('photo-preview').classList.remove('hidden');
        document.getElementById('confirm-checkin').classList.remove('hidden');
        document.getElementById('confirm-checkin').dataset.photo = u;
      };
      img.src = ev.target.result;
    };
    r.readAsDataURL(f);
  }

  function confirmCheckin() {
    if (curIdx < 0) return;
    const photo = document.getElementById('confirm-checkin').dataset.photo;
    const s = shopData[curIdx];
    checkins[curIdx] = { photo, date: Date.now() };
    save(SK.CHECKINS, checkins);
    galleryItems.unshift({ id:'g_'+Date.now(), shopName:s.name, shopIndex:curIdx, photo, date:Date.now(), prefecture:s.prefecture });
    save(SK.GALLERY, galleryItems);
    closeModal();
    updateMapColors(); renderShopPins(); renderShopCards(); updateStats();
    showCelebration(s);
  }

  function showCelebration(s) {
    const pid = PREF_ID_MAP[s.prefecture];
    const badge = BADGE_DATA.find(b => b.id === pid);
    const earned = badge && isBadgeUnlocked(badge.id);
    document.getElementById('celebration-badge').textContent = earned ? badge.icon : '🍫';
    document.getElementById('celebration-text').innerHTML = earned
      ? `${s.name}<br>🎉 <strong>${badge.name}</strong> badge earned!`
      : `${s.name}<br>にチェックインしました`;
    document.getElementById('celebration').classList.remove('hidden');
  }

  // ========== COLLECTION ==========
  function setupCollection() { renderCollection(); }
  function renderCollection() {
    const g = document.getElementById('badge-grid'); g.innerHTML = ''; let n = 0;
    BADGE_DATA.forEach(b => {
      const u = isBadgeUnlocked(b.id); if (u) n++;
      const el = document.createElement('div');
      el.className = 'badge-item ' + (u ? 'unlocked' : 'locked');
      el.innerHTML = `<div class="badge-icon">${b.icon}</div><div class="badge-name">${u ? b.name : '???'}</div>`;
      if (u) el.addEventListener('click', () => alert(`${b.name}\n${b.pref}\n\n${b.desc}`));
      g.appendChild(el);
    });
    document.getElementById('badge-count').textContent = n;
    document.getElementById('badge-total').textContent = BADGE_DATA.length;
  }
  function isBadgeUnlocked(id) {
    const b = BADGE_DATA.find(x => x.id === id); if (!b) return false;
    const s = shopData.filter(x => x.prefecture === b.pref);
    return s.length > 0 && s.every(x => !!checkins[shopData.indexOf(x)]);
  }

  // ========== GALLERY ==========
  function setupGallery() { renderGallery(); }
  function renderGallery() {
    const g = document.getElementById('gallery-grid');
    const e = document.getElementById('gallery-empty');
    g.innerHTML = '';
    if (!galleryItems.length) { g.classList.add('hidden'); e.classList.remove('hidden'); return; }
    e.classList.add('hidden'); g.classList.remove('hidden');
    galleryItems.forEach(item => {
      const m = !!mosaics[item.id];
      const tc = (reactions[item.id]?.tabetai)||0, ic = (reactions[item.id]?.ittayo)||0;
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.innerHTML = `
        <img src="${item.photo}" alt="${item.shopName}" class="gallery-img ${m?'mosaic':''}">
        <button class="mosaic-btn" data-id="${item.id}">🫠</button>
        <div class="gallery-info">
          <div class="gallery-shop-name">${item.shopName}</div>
          <div class="gallery-reactions">
            <button class="reaction-btn ${myReactions[item.id+'_tabetai']?'active':''}" data-id="${item.id}" data-type="tabetai">♡ <span class="count">${tc}</span></button>
            <button class="reaction-btn ${myReactions[item.id+'_ittayo']?'active':''}" data-id="${item.id}" data-type="ittayo">✧ <span class="count">${ic}</span></button>
          </div>
        </div>`;
      g.appendChild(card);
    });
    g.querySelectorAll('.reaction-btn').forEach(b => b.addEventListener('click', handleReaction));
    g.querySelectorAll('.mosaic-btn').forEach(b => b.addEventListener('click', handleMosaic));
  }
  function handleReaction(e) {
    const {id,type}=e.currentTarget.dataset, k=id+'_'+type;
    if(!reactions[id]) reactions[id]={};
    if(myReactions[k]){myReactions[k]=false;reactions[id][type]=Math.max(0,(reactions[id][type]||0)-1);}
    else{myReactions[k]=true;reactions[id][type]=(reactions[id][type]||0)+1;}
    save(SK.REACTIONS,reactions);save(SK.MY_RX,myReactions);renderGallery();
  }
  function handleMosaic(e){mosaics[e.currentTarget.dataset.id]=!mosaics[e.currentTarget.dataset.id];save(SK.MOSAICS,mosaics);renderGallery();}

  // ========== ADMIN ==========
  function setupAdmin() {
    // API Key management
    const apiInput = document.getElementById('api-key-input');
    const savedKey = PlacesService.getApiKey();
    if (savedKey) apiInput.value = savedKey;

    document.getElementById('save-api-key').addEventListener('click', () => {
      const key = apiInput.value.trim();
      PlacesService.setApiKey(key);
      showProgress(key ? '✓ API Key saved' : 'API Key cleared', true);
    });

    document.getElementById('fetch-photos-btn').addEventListener('click', async () => {
      if (!PlacesService.getApiKey()) {
        showProgress('API Keyを先に設定してください', false);
        return;
      }
      const btn = document.getElementById('fetch-photos-btn');
      btn.disabled = true;
      btn.textContent = 'Fetching...';

      await PlacesService.fetchAllShops(shopData, (done, total, name, cached) => {
        showProgress(`${done}/${total} — ${name}${cached ? ' (cached)' : ''}`, true);
      });

      btn.disabled = false;
      btn.textContent = 'Fetch Photos';
      showProgress(`✓ ${shopData.length} shops fetched!`, true);
      renderShopCards();
    });

    // Extract script
    document.getElementById('extract-script').textContent = EXTRACT_SCRIPT;
    document.getElementById('copy-script').addEventListener('click', () => {
      navigator.clipboard.writeText(EXTRACT_SCRIPT).then(() => {
        document.getElementById('copy-script').textContent='✓ Copied';
        setTimeout(()=>document.getElementById('copy-script').textContent='Copy',2000);
      });
    });

    // JSON import
    document.getElementById('import-btn').addEventListener('click', () => {
      const j=document.getElementById('import-json').value.trim();
      if(!j)return showRes('Enter JSON',false);
      try{
        const d=JSON.parse(j);if(!Array.isArray(d))return showRes('Must be array',false);
        let a=0;d.forEach(i=>{if(i.name&&!shopData.find(s=>s.name===i.name)){shopData.push({name:i.name,lat:i.lat||0,lng:i.lng||0,prefecture:i.prefecture||''});a++;}});
        save(SK.SHOPS,shopData);updateMapColors();renderShopPins();renderShopCards();updateStats();updateAdminStats();
        showRes(`✓ Added ${a} shops (${d.length-a} duplicates skipped)`,true);
        document.getElementById('import-json').value='';
      }catch(e){showRes('JSON error: '+e.message,false);}
    });

    // Reset
    document.getElementById('reset-btn').addEventListener('click',()=>{
      if(!confirm('Reset all data?'))return;if(!confirm('Are you sure?'))return;
      Object.values(SK).forEach(k=>localStorage.removeItem(k));
      PlacesService.clearCache();
      location.reload();
    });
    updateAdminStats();
  }

  function showProgress(msg, ok) {
    const el = document.getElementById('fetch-progress');
    el.textContent = msg;
    el.className = 'import-result ' + (ok ? 'success' : 'error');
    el.classList.remove('hidden');
  }
  function showRes(m,ok){const e=document.getElementById('import-result');e.textContent=m;e.className='import-result '+(ok?'success':'error');e.classList.remove('hidden');setTimeout(()=>e.classList.add('hidden'),4000);}
  function updateAdminStats(){
    document.getElementById('admin-shop-count').textContent=shopData.length;
    document.getElementById('admin-checkin-count').textContent=Object.keys(checkins).length;
    document.getElementById('admin-gallery-count').textContent=galleryItems.length;
  }

  function updateStats(){
    document.getElementById('checkin-count').textContent=Object.keys(checkins).length;
    document.getElementById('total-shops').textContent=shopData.length;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
