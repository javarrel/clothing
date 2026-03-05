// ===== DATA =====
const products = [
  {id:1,name:'VOID OVERSIZED TEE',cat:'tee',catLabel:'GRAPHIC TEE',price:890,original:1290,tag:'BESTSELLER',tagColor:'',img:'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80',desc:'A statement piece for the minimalist. Heavy 280gsm cotton with our signature VOID screenprint on the chest.',material:'280gsm 100% Cotton'},
  {id:2,name:'ENTROPY HOODIE',cat:'hoodie',catLabel:'HOODIE',price:1890,original:null,tag:'NEW',tagColor:'',img:'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80',desc:'Heavyweight French terry hoodie. Embroidered STOIC wordmark on the back. Kangaroo pocket. Unisex oversized fit.',material:'320gsm French Terry'},
  {id:3,name:'SILENCE LONG SLEEVE',cat:'long-sleeve',catLabel:'LONG SLEEVE',price:1190,original:null,tag:'',tagColor:'',img:'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80',desc:'Clean, structured long sleeve with subtle STOIC branding on the cuff. A wardrobe essential.',material:'240gsm Ringspun Cotton'},
  {id:4,name:'CARGO TECH PANTS',cat:'pants',catLabel:'PANTS',price:2490,original:2990,tag:'SALE',tagColor:'red',img:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80',desc:'Technical cargo pants with 6 pockets, adjustable hem, and tapered silhouette. Built for movement.',material:'Ripstop Nylon blend'},
  {id:5,name:'GHOST PRINT TEE',cat:'tee',catLabel:'GRAPHIC TEE',price:890,original:null,tag:'NEW',tagColor:'',img:'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400&q=80',desc:'Our most requested tee. Ghosted typography on premium heavyweight cotton. Limited run.',material:'280gsm 100% Cotton'},
  {id:6,name:'MONOLITH HOODIE',cat:'hoodie',catLabel:'HOODIE',price:2190,original:null,tag:'',tagColor:'',img:'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=400&q=80',desc:'Archive-inspired hoodie with tonal embroidery and zip-through split hem. Statement outerwear.',material:'360gsm Fleece'},
  {id:7,name:'AXIS LONG SLEEVE',cat:'long-sleeve',catLabel:'LONG SLEEVE',price:1290,original:null,tag:'',tagColor:'',img:'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400&q=80',desc:'Layering essential. Side seam details and dropped shoulder for an architectural silhouette.',material:'260gsm Cotton blend'},
  {id:8,name:'WIDE LEG TROUSERS',cat:'pants',catLabel:'PANTS',price:2190,original:null,tag:'BESTSELLER',tagColor:'',img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',desc:'Relaxed wide-leg trousers with pleat detail and clean finish. Elevated casual.',material:'Poly-rayon blend'},
];

let cart = [];
let wishlist = [];
let currentProduct = null;
let sliderPos = 0;
let promoApplied = false;

// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
  }, 80);
});
document.addEventListener('mouseover', e => {
  if(e.target.matches('a,button,.product-card,.nav-icon-btn,.cat-pill,.slider-btn,.social-link,.size-chip,.detail-size,.gallery-thumb,.color-swatch,.detail-color,.product-wishlist,.ig-item')) {
    cursor.classList.add('hover');
    cursorRing.classList.add('hover');
  }
});
document.addEventListener('mouseout', e => {
  if(e.target.matches('a,button,.product-card,.nav-icon-btn,.cat-pill,.slider-btn,.social-link,.size-chip,.detail-size,.gallery-thumb,.color-swatch,.detail-color,.product-wishlist,.ig-item')) {
    cursor.classList.remove('hover');
    cursorRing.classList.remove('hover');
  }
});

// ===== PAGE NAVIGATION =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  window.scrollTo(0, 0);
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === id);
  });
  if (id === 'shop') renderShop();
  if (id === 'cart') renderCart();
  if (id === 'wishlist') renderWishlist();
}

// ===== DARK MODE =====
function toggleDarkMode() {
  document.body.classList.toggle('light-mode');
}

// ===== MOBILE MENU =====
function toggleMenu() {
  const h = document.getElementById('hamburger');
  const m = document.getElementById('mobileMenu');
  h.classList.toggle('open');
  m.classList.toggle('open');
}

// ===== PRODUCT CARD HTML =====
function productCard(p, showRemoveWishlist = false) {
  const inWishlist = wishlist.includes(p.id);
  return `
  <div class="product-card" onclick="openProduct(${p.id})">
    <div class="product-img-wrap">
      ${p.tag ? `<div class="product-tag${p.tagColor==='red'?' red':''}">${p.tag}</div>` : ''}
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="product-quick-view">
        <button class="btn btn-primary btn-sm" style="flex:1" onclick="event.stopPropagation();addToCartById(${p.id})">ADD TO CART</button>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openProduct(${p.id})">VIEW</button>
      </div>
      <button class="product-wishlist ${inWishlist?'active':''}" onclick="event.stopPropagation();toggleWishlist(${p.id},this)" aria-label="Add to wishlist">${inWishlist?'♥':'♡'}</button>
    </div>
    <div class="product-cat">${p.catLabel}</div>
    <div class="product-info">
      <div class="product-name">${p.name}</div>
      <div class="product-price">${p.original?`<span class="original">₱${p.original.toLocaleString()}</span>`:''}₱${p.price.toLocaleString()}</div>
    </div>
    <div class="product-sizes">
      ${['XS','S','M','L','XL'].map(s=>`<div class="size-chip">${s}</div>`).join('')}
    </div>
  </div>`;
}

// ===== HOME FEATURED =====
function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  grid.innerHTML = products.slice(0, 4).map(p => productCard(p)).join('');
}

// ===== SLIDER =====
function renderSlider() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;
  track.innerHTML = products.map(p => `
  <div class="slider-item" onclick="openProduct(${p.id})">
    <div class="product-img-wrap">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      ${p.tag ? `<div class="product-tag${p.tagColor==='red'?' red':''}">${p.tag}</div>` : ''}
    </div>
    <div class="product-cat">${p.catLabel}</div>
    <div class="product-name">${p.name}</div>
    <div class="product-price">₱${p.price.toLocaleString()}</div>
  </div>`).join('');
}
function slideLeft() {
  const track = document.getElementById('sliderTrack');
  sliderPos = Math.min(sliderPos + 324, 0);
  track.style.transform = `translateX(${sliderPos}px)`;
}
function slideRight() {
  const track = document.getElementById('sliderTrack');
  const max = -(324 * (products.length - 3));
  sliderPos = Math.max(sliderPos - 324, max);
  track.style.transform = `translateX(${sliderPos}px)`;
}

// ===== INSTAGRAM FEED =====
const igImgs = [
  'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300&q=80',
  'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=300&q=80',
  'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=300&q=80',
  'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=300&q=80',
  'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&q=80',
];
function renderIG() {
  const grid = document.getElementById('igGrid');
  if (!grid) return;
  grid.innerHTML = igImgs.map(src => `
  <div class="ig-item">
    <img src="${src}" alt="Instagram post" loading="lazy">
    <div class="ig-overlay"><div class="ig-overlay-text">♥</div></div>
  </div>`).join('');
}

// ===== SHOP PAGE =====
let activeCategory = 'all';
let shopProducts = [...products];
function renderShop() {
  const grid = document.getElementById('shopGrid');
  const count = document.getElementById('shopCount');
  if (!grid) return;
  let toShow = activeCategory === 'all' ? shopProducts : shopProducts.filter(p => p.cat === activeCategory);
  grid.innerHTML = toShow.map(p => productCard(p)).join('');
  if (count) count.textContent = toShow.length + ' PRODUCTS';
}
function filterCat(cat, el) {
  activeCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderShop();
}
function filterProducts() { renderShop(); }
function sortProducts(val) {
  if (val === 'price-asc') shopProducts.sort((a,b) => a.price - b.price);
  else if (val === 'price-desc') shopProducts.sort((a,b) => b.price - a.price);
  else shopProducts = [...products];
  renderShop();
}
function toggleSwatch(el) { el.classList.toggle('active'); }
function updatePrice(val) {
  document.getElementById('priceVal').textContent = '₱' + parseInt(val).toLocaleString();
}
function clearFilters() {
  document.querySelectorAll('.shop-filters input[type=checkbox]').forEach(cb => cb.checked = true);
  filterCat('all', document.querySelector('.cat-pill'));
}

// ===== PRODUCT DETAIL =====
function openProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  currentProduct = p;
  document.getElementById('pdCat').textContent = p.catLabel;
  document.getElementById('pdName2').textContent = p.name;
  document.getElementById('pdCatLabel').textContent = p.catLabel;
  document.getElementById('pdTitle').textContent = p.name;
  document.getElementById('pdPrice').textContent = '₱' + p.price.toLocaleString();
  document.getElementById('pdOriginal').textContent = p.original ? '₱' + p.original.toLocaleString() : '';
  document.getElementById('pdDesc').textContent = p.desc;
  document.getElementById('pdMaterial').textContent = p.material;
  document.getElementById('pdSKU').textContent = 'STC-0' + String(id).padStart(2,'0');
  document.getElementById('galleryMain').src = p.img;
  document.getElementById('qtyInput').value = 1;
  const thumbs = document.getElementById('galleryThumbs');
  thumbs.innerHTML = [p.img, ...products.filter(x=>x.cat===p.cat&&x.id!==id).slice(0,3).map(x=>x.img)].map((src,i) =>
    `<div class="gallery-thumb ${i===0?'active':''}" onclick="setMainImg('${src}',this)"><img src="${src}" alt="Product view ${i+1}" loading="lazy"></div>`
  ).join('');
  const related = document.getElementById('relatedGrid');
  related.innerHTML = products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0,4).map(x => productCard(x)).join('');
  showPage('product');
}
function setMainImg(src, el) {
  document.getElementById('galleryMain').src = src;
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
function selectSize(el) {
  if (el.classList.contains('unavailable')) return;
  document.querySelectorAll('.detail-size').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}
function selectDetailColor(el) {
  document.querySelectorAll('.detail-color').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}
function changeQty(delta) {
  const input = document.getElementById('qtyInput');
  const val = Math.max(1, Math.min(10, parseInt(input.value) + delta));
  input.value = val;
}

// ===== CART =====
function addToCart() {
  if (!currentProduct) return;
  const qty = parseInt(document.getElementById('qtyInput').value);
  const existing = cart.find(c => c.id === currentProduct.id);
  if (existing) existing.qty += qty;
  else cart.push({...currentProduct, qty});
  updateCartBadge();
  showToast('ADDED TO CART', `${currentProduct.name} x${qty} added.`);
}
function addToCartById(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(c => c.id === p.id);
  if (existing) existing.qty++;
  else cart.push({...p, qty:1});
  updateCartBadge();
  showToast('ADDED TO CART', `${p.name} added.`);
}
function updateCartBadge() {
  const total = cart.reduce((s,c) => s + c.qty, 0);
  document.getElementById('cartBadge').textContent = total;
}
function renderCart() {
  const items = document.getElementById('cartItems');
  const empty = document.getElementById('emptyCart');
  const form = document.getElementById('checkoutForm');
  const sumItems = document.getElementById('summaryItems');
  if (cart.length === 0) {
    items.innerHTML = '';
    empty.classList.remove('hidden');
    form.style.display = 'none';
    if (sumItems) sumItems.innerHTML = '';
    updateTotals();
    return;
  }
  empty.classList.add('hidden');
  form.style.display = 'block';
  items.innerHTML = cart.map(c => `
  <div class="cart-item">
    <div class="cart-item-img"><img src="${c.img}" alt="${c.name}" loading="lazy"></div>
    <div>
      <div class="cart-item-name">${c.name}</div>
      <div class="cart-item-details">${c.catLabel} / SIZE M / QTY: ${c.qty}</div>
      <button class="cart-item-remove" onclick="removeFromCart(${c.id})">REMOVE</button>
    </div>
    <div style="font-family:var(--font-mono);font-size:14px;color:var(--accent)">₱${(c.price*c.qty).toLocaleString()}</div>
  </div>`).join('');
  if (sumItems) sumItems.innerHTML = cart.map(c => `
  <div class="summary-row">
    <span style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px">${c.name} x${c.qty}</span>
    <span>₱${(c.price*c.qty).toLocaleString()}</span>
  </div>`).join('');
  updateTotals();
}
function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartBadge();
  renderCart();
}
function updateTotals() {
  const sub = cart.reduce((s,c) => s + c.price*c.qty, 0);
  const disc = promoApplied ? Math.round(sub * 0.15) : 0;
  const ship = sub > 3000 ? 0 : 150;
  document.getElementById('subtotal').textContent = '₱' + sub.toLocaleString();
  document.getElementById('shipping').textContent = ship === 0 ? 'FREE' : '₱' + ship;
  document.getElementById('discount').textContent = disc > 0 ? '−₱' + disc.toLocaleString() : '—';
  document.getElementById('total').textContent = '₱' + (sub - disc + ship).toLocaleString();
}
function applyPromo() {
  const code = document.getElementById('promoInput').value.toUpperCase();
  if (code === 'STOIC15' || code === 'WELCOME') {
    promoApplied = true;
    showToast('PROMO APPLIED!', '15% discount applied to your order.');
    updateTotals();
  } else {
    showToast('INVALID CODE', 'That promo code is not valid.', true);
  }
}
function placeOrder() {
  if (cart.length === 0) return;
  cart = [];
  promoApplied = false;
  updateCartBadge();
  showToast('ORDER PLACED!', 'Thank you! Your order is confirmed.');
  setTimeout(() => showPage('home'), 2000);
}

// ===== WISHLIST =====
function toggleWishlist(id, btn) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(x => x !== id);
    btn.textContent = '♡';
    btn.classList.remove('active');
    showToast('REMOVED', 'Removed from your wishlist.');
  } else {
    wishlist.push(id);
    btn.textContent = '♥';
    btn.classList.add('active');
    showToast('SAVED ♥', 'Added to your wishlist.');
  }
  updateWishlistCount();
}
function updateWishlistCount() {
  const count = document.getElementById('wishlistCount');
  count.textContent = wishlist.length;
  count.classList.toggle('show', wishlist.length > 0);
}
function renderWishlist() {
  const grid = document.getElementById('wishlistGrid');
  const empty = document.getElementById('emptyWishlist');
  if (wishlist.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  const items = wishlist.map(id => products.find(p => p.id === id)).filter(Boolean);
  grid.innerHTML = items.map(p => productCard(p)).join('');
}

// ===== NEWSLETTER POPUP =====
function closePopup() {
  document.getElementById('popup').classList.remove('show');
}
function subscribeNewsletter() {
  closePopup();
  showToast('SUBSCRIBED!', 'Welcome to the [STOIC] family. Check your email for 15% off.');
}

// ===== SIZE GUIDE =====
function openSizeGuide() {
  document.getElementById('sizeModal').classList.add('show');
}
function closeSizeGuide() {
  document.getElementById('sizeModal').classList.remove('show');
}

// ===== TOAST =====
let toastTimer;
function showToast(title, msg, isError = false) {
  const t = document.getElementById('toast');
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent = msg;
  t.style.borderLeftColor = isError ? 'var(--accent2)' : 'var(--accent)';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

// ===== BACK TO TOP =====
window.addEventListener('scroll', () => {
  const btn = document.getElementById('backToTop');
  btn.classList.toggle('show', window.scrollY > 400);
});

// ===== LIVE CHAT =====
function toggleChat() {
  document.getElementById('chatPanel').classList.toggle('open');
}
function sendChat() {
  showToast('MESSAGE SENT', 'Our team will reply within 24 hours. 💬');
  toggleChat();
}

// ===== CONTACT =====
function sendMessage() {
  showToast('MESSAGE SENT!', "We'll get back to you within 24 hours.");
}

// ===== CLOSE MODAL ON OVERLAY CLICK =====
document.getElementById('sizeModal').addEventListener('click', function(e) {
  if (e.target === this) closeSizeGuide();
});
document.getElementById('popup').addEventListener('click', function(e) {
  if (e.target === this) closePopup();
});

// ===== SCROLL-BASED NAV SHADOW =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.boxShadow = window.scrollY > 10 ? '0 4px 40px rgba(0,0,0,0.5)' : 'none';
});

// ===== LAZY LOAD IMAGES =====
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) { img.src = img.dataset.src; io.unobserve(img); }
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => io.observe(img));
}

// ===== INIT =====
renderFeatured();
renderSlider();
renderIG();

// Show popup after 4 seconds
setTimeout(() => {
  document.getElementById('popup').classList.add('show');
}, 4000);