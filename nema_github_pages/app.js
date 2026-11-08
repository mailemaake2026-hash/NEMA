(() => {
  'use strict';
  const ASSET = 'assets/';
  const products = [
    {id:'merlot-drape',name:'The Merlot Drape',category:'Dresses',tag:'THE ART OF DRAPE',image:'merlot-drape.webp',description:'A rich wine-toned silhouette with soft volume and a gathered waist. A piece defined by movement and the way the fabric falls.'},
    {id:'scarlet-pleat',name:'The Scarlet Pleat',category:'Dresses',tag:'MOVEMENT STUDY',image:'scarlet-pleat.webp',description:'A vivid red, full-skirted silhouette with pleated movement. Made to bring energy and presence to an occasion.'},
    {id:'noir-flow',name:'The Noir Flow',category:'Dresses',tag:'AFTER DARK',image:'noir-flow.webp',description:'A dramatic black flowing silhouette with a high neckline and generous movement. Elegant, expressive and unmistakable.'},
    {id:'cloudline',name:'The Cloudline Puffer',category:'Outerwear',tag:'THE OUTER LAYER',image:'cloud-puffer.webp',description:'A light ivory quilted outer layer with an enveloping collar and a clean, softly structured profile.'},
    {id:'blue-hour',name:'The Blue Hour Set',category:'Sets',tag:'EVERYDAY FORM',image:'denim-set.webp',description:'A coordinated denim look with a defined waist and considered proportions. A modern take on an everyday statement.'},
    {id:'curve-handle',name:'The Curve Handle Bag',category:'Accessories',tag:'THE FINISHING TOUCH',image:'curve-bag.webp',description:'A compact statement bag with a sculptural handle. Shown here in a vivid colourway; ask the studio about available colours.'},
    {id:'weekender',name:'The Weekender',category:'Objects',tag:'ON THE MOVE',image:'weekender-detail.webp',description:'A practical travel-bag reference from the supplied visual direction. Final branding, specification and availability need to be confirmed.'},
    {id:'daylight',name:'The Daylight Umbrella',category:'Objects',tag:'EVERYDAY FORM',image:'umbrella-detail.webp',description:'A compact umbrella reference from the supplied visual direction. Final branding, specification and availability need to be confirmed.'}
  ];
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const safeStorage = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(`nema_preview_${key}`)) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(`nema_preview_${key}`, JSON.stringify(value)); } catch { /* Private browsing may block storage. */ } }
  };
  let bag = safeStorage.get('bag', []);
  let activeProduct = null;
  let activeSize = 'M';
  let quantity = 1;
  let activeFilter = 'All';
  let favorites = new Set(safeStorage.get('favorites', []));
  let toastTimer;

  const categorySizes = {
    Dresses: ['XS','S','M','L','XL','XXL'],
    Sets: ['XS','S','M','L','XL','XXL'],
    Outerwear: ['XS','S','M','L','XL','XXL'],
    Accessories: ['One size'],
    Objects: ['One size']
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  function renderProducts(filter=activeFilter, query='') {
    activeFilter = filter;
    const needle = query.trim().toLowerCase();
    const filtered = products.filter(p => {
      const inFilter = filter === 'All' || (filter === 'Saved' ? favorites.has(p.id) : p.category === filter);
      return inFilter && (!needle || `${p.name} ${p.category} ${p.tag} ${p.description}`.toLowerCase().includes(needle));
    });
    $('#productGrid').innerHTML = filtered.map(p => `
      <article class="product-card" data-product="${p.id}">
        <div class="product-media" role="button" tabindex="0" aria-label="View ${escapeHtml(p.name)}" data-open-product="${p.id}">
          <img src="${ASSET}${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">
          <span class="product-tag">${escapeHtml(p.tag)}</span>
          <button class="save-product ${favorites.has(p.id) ? 'is-saved' : ''}" type="button" data-save-product="${p.id}" aria-label="${favorites.has(p.id) ? 'Remove' : 'Save'} ${escapeHtml(p.name)}" aria-pressed="${favorites.has(p.id)}">♡</button>
          <button class="product-action" type="button" data-open-product="${p.id}" aria-label="View ${escapeHtml(p.name)}">↗</button>
        </div>
        <div class="product-info"><div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.category)} · NEMA EDIT</p></div><span class="product-availability">ENQUIRE</span></div>
      </article>`).join('') || `<p class="no-results">${filter === 'Saved' ? 'You have not saved any pieces yet. Tap the heart on a piece to keep it here.' : 'No pieces found. Try another search or category.'}</p>`;
    $('#shopCount').textContent = `${String(filtered.length).padStart(2,'0')} — ${String(products.length).padStart(2,'0')}`;
    $$('.filter-chip').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
    updateFavoritesUI();
  }
  function updateFavoritesUI() {
    const count = favorites.size;
    $('#savedCount').textContent = count;
    $('#savedFilter').classList.toggle('has-saved', count > 0);
  }
  function toggleFavorite(id) {
    if (favorites.has(id)) {
      favorites.delete(id);
      showToast('Removed from your saved pieces.');
    } else {
      favorites.add(id);
      showToast('Saved to your NEMA edit.');
    }
    safeStorage.set('favorites', [...favorites]);
    if (activeFilter === 'Saved') renderProducts('Saved');
    else {
      $$('#productGrid [data-save-product]').forEach(button => {
        const saved = favorites.has(button.dataset.saveProduct);
        button.classList.toggle('is-saved', saved);
        button.setAttribute('aria-pressed', String(saved));
        button.setAttribute('aria-label', `${saved ? 'Remove' : 'Save'} ${products.find(p => p.id === button.dataset.saveProduct)?.name || 'piece'}`);
      });
      updateFavoritesUI();
    }
    if (activeProduct && activeProduct.id === id) {
      const saved = favorites.has(id);
      $('#modalSave').classList.toggle('is-saved', saved);
      $('#modalSave').setAttribute('aria-pressed', String(saved));
      $('#modalSave').setAttribute('aria-label', saved ? 'Remove from saved pieces' : 'Save this piece');
    }
  }

  const moods = {
    merlot: { image:'merlot-drape.webp', alt:'A NEMA merlot draped dress with soft sculptural movement', index:'01 · THE ART OF DRAPE', caption:'A little drama. A lasting impression.' },
    noir:   { image:'noir-flow.webp', alt:'A flowing black NEMA silhouette against a neutral backdrop', index:'02 · THE QUIET STATEMENT', caption:'Quiet confidence, after dark.' },
    cloud:  { image:'cloud-puffer.webp', alt:'A softly structured ivory puffer coat', index:'03 · THE SOFT STRUCTURE', caption:'Lightness with a little definition.' },
    denim:  { image:'denim-set.webp', alt:'A deep blue coordinated denim NEMA look', index:'04 · THE EVERYDAY ICON', caption:'An everyday icon, seen differently.' }
  };
  function setMood(mood, persist=true) {
    const selected = moods[mood] ? mood : 'merlot';
    const details = moods[selected];
    document.body.dataset.mood = selected;
    $$('[data-mood-choice]').forEach(button => {
      const active = button.dataset.moodChoice === selected;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('#moodCaption').textContent = details.caption;
    $('#heroImageIndex').textContent = details.index;
    const hero = $('#heroImage');
    const nextSrc = ASSET + details.image;
    hero.classList.add('is-changing');
    const preload = new Image();
    preload.onload = () => {
      hero.src = nextSrc;
      hero.alt = details.alt;
      requestAnimationFrame(() => hero.classList.remove('is-changing'));
    };
    preload.onerror = () => hero.classList.remove('is-changing');
    preload.src = nextSrc;
    if (persist) safeStorage.set('mood', selected);
  }
  function openProduct(id) {
    const p = products.find(item => item.id === id);
    if (!p) return;
    activeProduct = p;
    activeSize = categorySizes[p.category][0];
    const isSaved = favorites.has(p.id);
    $('#modalSave').classList.toggle('is-saved', isSaved);
    $('#modalSave').setAttribute('aria-pressed', String(isSaved));
    $('#modalSave').setAttribute('aria-label', isSaved ? 'Remove from saved pieces' : 'Save this piece');
    quantity = 1;
    $('#modalImage').src = ASSET + p.image;
    $('#modalImage').alt = p.name;
    $('#modalTitle').textContent = p.name;
    $('#modalCategory').textContent = `${p.category.toUpperCase()} · ${p.tag}`;
    $('#modalDescription').textContent = p.description;
    $('#qtyValue').textContent = quantity;
    $('#sizeOption').style.display = 'block';
    $('#sizeHelp').textContent = p.category === 'Dresses' || p.category === 'Outerwear' ? 'ASK THE STUDIO FOR FIT GUIDANCE' : 'ONE SIZE / CONFIRM WITH STUDIO';
    $('#sizeOptions').innerHTML = categorySizes[p.category].map(size => `<button type="button" data-size="${size}" class="${size === activeSize ? 'active' : ''}">${size}</button>`).join('');
    $('#productModal').classList.add('open');
    $('#productModal').setAttribute('aria-hidden','false');
    openOverlay();
    document.body.classList.add('locked');
  }
  function closeProduct() {
    $('#productModal').classList.remove('open');
    $('#productModal').setAttribute('aria-hidden','true');
    releaseOverlayIfClear();
  }
  function openOverlay() { $('#overlay').classList.add('open'); }
  function releaseOverlayIfClear() {
    const panelOpen = $('#searchPanel').classList.contains('open') || $('#bagPanel').classList.contains('open');
    const modalOpen = $('#productModal').classList.contains('open');
    if (!panelOpen && !modalOpen) {
      $('#overlay').classList.remove('open');
      document.body.classList.remove('locked');
    }
  }
  function openPanel(name) {
    closeProduct();
    const panel = name === 'bag' ? $('#bagPanel') : $('#searchPanel');
    const other = name === 'bag' ? $('#searchPanel') : $('#bagPanel');
    other.classList.remove('open'); other.setAttribute('aria-hidden','true');
    panel.classList.add('open'); panel.setAttribute('aria-hidden','false');
    openOverlay(); document.body.classList.add('locked');
    if (name === 'search') { $('#searchInput').focus(); renderSearchResults($('#searchInput').value); }
    if (name === 'bag') renderBag();
  }
  function closePanel(name) {
    const panel = name === 'bag' ? $('#bagPanel') : $('#searchPanel');
    panel.classList.remove('open'); panel.setAttribute('aria-hidden','true');
    releaseOverlayIfClear();
  }
  function addToBag() {
    if (!activeProduct) return;
    const existing = bag.find(item => item.id === activeProduct.id && item.size === activeSize);
    if (existing) existing.quantity += quantity;
    else bag.push({id:activeProduct.id, size:activeSize, quantity});
    safeStorage.set('bag', bag);
    renderBagCount();
    closeProduct();
    showToast(`${activeProduct.name} added to your enquiry bag.`);
  }
  function updateBagItem(id, size, delta) {
    const item = bag.find(row => row.id === id && row.size === size);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity < 1) bag = bag.filter(row => !(row.id === id && row.size === size));
    safeStorage.set('bag', bag);
    renderBag(); renderBagCount();
  }
  function removeBagItem(id, size) {
    bag = bag.filter(row => !(row.id === id && row.size === size));
    safeStorage.set('bag', bag);
    renderBag(); renderBagCount();
    showToast('Piece removed from your bag.');
  }
  function renderBagCount() {
    const count = bag.reduce((sum, item) => sum + item.quantity, 0);
    $('#bagCount').textContent = count;
    $('#bagPanelCount').textContent = count;
  }
  function renderBag() {
    const items = $('#bagItems');
    $('#bagEmpty').style.display = bag.length ? 'none' : 'block';
    $('#bagFooter').style.display = bag.length ? 'block' : 'none';
    items.innerHTML = bag.map(item => {
      const p = products.find(product => product.id === item.id);
      if (!p) return '';
      return `<article class="bag-item"><img src="${ASSET}${p.image}" alt="${escapeHtml(p.name)}"><div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(item.size)} · PRICE ON REQUEST</p><div class="bag-item-actions"><button data-bag-change="-1" data-id="${p.id}" data-size="${escapeHtml(item.size)}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-bag-change="1" data-id="${p.id}" data-size="${escapeHtml(item.size)}" aria-label="Increase quantity">+</button><button class="bag-remove" data-bag-remove="${p.id}" data-size="${escapeHtml(item.size)}">Remove</button></div></div></article>`;
    }).join('');
    renderBagCount();
  }
  function makeEnquiryText() {
    const lines = bag.map(item => {
      const p = products.find(product => product.id === item.id);
      return p ? `• ${p.name} — Size: ${item.size} — Qty: ${item.quantity}` : '';
    }).filter(Boolean);
    return `Hello NEMA studio, I would like to enquire about these selected pieces:\n\n${lines.join('\n')}\n\nPlease confirm current availability, sizing and pricing. Thank you.`;
  }
  function sendBagEnquiry() {
    if (!bag.length) return;
    const url = `https://wa.me/27632054610?text=${encodeURIComponent(makeEnquiryText())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  function renderSearchResults(query) {
    const q = query.trim().toLowerCase();
    const found = products.filter(p => !q || `${p.name} ${p.category} ${p.tag}`.toLowerCase().includes(q)).slice(0,6);
    $('#searchResults').innerHTML = found.map(p => `<div class="search-result"><img src="${ASSET}${p.image}" alt=""><div><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.category)} · ENQUIRE</small></div><button type="button" data-open-product="${p.id}" aria-label="View ${escapeHtml(p.name)}">↗</button></div>`).join('') || '<p class="no-results">No pieces found. Try another search.</p>';
  }
  function closeMobileNav() {
    $('#mobileNav').classList.remove('open');
    $('#menuToggle').setAttribute('aria-expanded','false');
    $('#mobileShade').classList.remove('open');
  }
  function toggleMobileNav() {
    const opening = !$('#mobileNav').classList.contains('open');
    $('#mobileNav').classList.toggle('open', opening);
    $('#menuToggle').setAttribute('aria-expanded', String(opening));
    $('#mobileShade').classList.toggle('open', opening);
  }
  function bindEvents() {
    $('#searchOpen').addEventListener('click', () => openPanel('search'));
    $('#bagOpen').addEventListener('click', () => openPanel('bag'));
    $('#menuToggle').addEventListener('click', toggleMobileNav);
    $$('[data-mood-choice]').forEach(button => button.addEventListener('click', () => setMood(button.dataset.moodChoice)));
    $('#modalSave').addEventListener('click', () => { if (activeProduct) toggleFavorite(activeProduct.id); });
    $('#mobileShade').addEventListener('click', closeMobileNav);
    $$('#mobileNav a').forEach(link => link.addEventListener('click', closeMobileNav));
    $$('[data-close="search"]').forEach(btn => btn.addEventListener('click', () => closePanel('search')));
    $$('[data-close="bag"]').forEach(btn => btn.addEventListener('click', () => closePanel('bag')));
    $$('[data-close="product"]').forEach(btn => btn.addEventListener('click', closeProduct));
    $('#overlay').addEventListener('click', () => { closePanel('bag'); closePanel('search'); closeProduct(); });
    $('#productGrid').addEventListener('click', e => {
      const save = e.target.closest('[data-save-product]');
      if (save) { e.preventDefault(); e.stopPropagation(); toggleFavorite(save.dataset.saveProduct); return; }
      const trigger = e.target.closest('[data-open-product]');
      if (trigger) openProduct(trigger.dataset.openProduct);
    });
    $('#productGrid').addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-open-product]')) { e.preventDefault(); openProduct(e.target.dataset.openProduct); }
    });
    $('.collection-mosaic').addEventListener('click', e => {
      const link = e.target.closest('[data-filter-link]');
      if (!link) return;
      activeFilter = link.dataset.filterLink;
      renderProducts(activeFilter);
    });
    $$('.filter-chip').forEach(btn => btn.addEventListener('click', () => renderProducts(btn.dataset.filter)));
    $('#sizeOptions').addEventListener('click', e => {
      const btn = e.target.closest('[data-size]'); if (!btn) return;
      activeSize = btn.dataset.size;
      $$('[data-size]', $('#sizeOptions')).forEach(b => b.classList.toggle('active', b === btn));
    });
    $('#qtyMinus').addEventListener('click', () => { quantity = Math.max(1, quantity - 1); $('#qtyValue').textContent = quantity; });
    $('#qtyPlus').addEventListener('click', () => { quantity = Math.min(10, quantity + 1); $('#qtyValue').textContent = quantity; });
    $('#addToBag').addEventListener('click', addToBag);
    $('#bagItems').addEventListener('click', e => {
      const change = e.target.closest('[data-bag-change]');
      const remove = e.target.closest('[data-bag-remove]');
      if (change) updateBagItem(change.dataset.id, change.dataset.size, Number(change.dataset.bagChange));
      if (remove) removeBagItem(remove.dataset.bagRemove, remove.dataset.size);
    });
    $('#sendEnquiry').addEventListener('click', sendBagEnquiry);
    $('#emptyBagShop').addEventListener('click', () => closePanel('bag'));
    $('#searchInput').addEventListener('input', e => renderSearchResults(e.target.value));
    $('#searchResults').addEventListener('click', e => {
      const trigger = e.target.closest('[data-open-product]');
      if (trigger) openProduct(trigger.dataset.openProduct);
    });
    $('#newsletterForm').addEventListener('submit', e => {
      e.preventDefault();
      const email = $('#newsletterEmail').value.trim();
      if (!email) return;
      const list = safeStorage.get('newsletter_preview', []);
      if (!list.includes(email)) list.push(email);
      safeStorage.set('newsletter_preview', list);
      $('#newsletterEmail').value = '';
      $('#newsletterMessage').textContent = 'Saved in this browser preview. Connect a mailing-list service before launch to collect real subscriptions.';
      showToast('Thank you for your interest in NEMA.');
    });
    $('#contactLink').addEventListener('click', e => { e.preventDefault(); window.open('https://wa.me/27632054610?text=Hello%20NEMA%20studio%2C%20I%20need%20help.', '_blank', 'noopener,noreferrer'); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closePanel('bag'); closePanel('search'); closeProduct(); closeMobileNav(); }
    });
    window.addEventListener('scroll', () => {
      $('#siteHeader').classList.toggle('scrolled', window.scrollY > 85);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      $('#scrollProgress').style.width = `${progress}%`;
    }, {passive:true});
    const heroWrap = $('.hero-visual-wrap');
    if (heroWrap && window.matchMedia('(hover:hover) and (pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      $('.hero').addEventListener('pointermove', event => {
        const rect = $('.hero').getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        heroWrap.style.setProperty('--hero-x', `${x * 9}px`);
        heroWrap.style.setProperty('--hero-y', `${y * 7}px`);
      }, {passive:true});
      $('.hero').addEventListener('pointerleave', () => {
        heroWrap.style.setProperty('--hero-x', '0px');
        heroWrap.style.setProperty('--hero-y', '0px');
      });
    }
  }
  function observeReveal() {
    const targets = $$('.intro-main,.section-heading,.collection-tile,.product-card,.values-image,.values-copy,.campaign-content,.story-heading,.story-art,.accessory-feature,.accessory-small,.newsletter-copy,.newsletter-form');
    targets.forEach(el => el.classList.add('reveal'));
    if (!('IntersectionObserver' in window)) { targets.forEach(el => el.classList.add('in-view')); return; }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
      });
    }, {threshold:.12,rootMargin:'0px 0px -35px 0px'});
    targets.forEach(el => observer.observe(el));
  }
  function init() {
    $('#year').textContent = new Date().getFullYear();
    renderProducts('All');
    updateFavoritesUI();
    setMood(safeStorage.get('mood', 'merlot'), false);
    renderBagCount();
    bindEvents();
    observeReveal();
  }
  init();
})();
