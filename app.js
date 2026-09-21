
const P=window.REWEAR_PRODUCTS||{};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const fmt=n=>new Intl.NumberFormat('sv-SE').format(Number(n||0))+' kr';
const qs=new URLSearchParams(location.search);
const view=qs.get('view')||'home';
const cat=(qs.get('cat')||'').toLowerCase();
const id=qs.get('id');
const app=$('#app');
const getList=k=>JSON.parse(localStorage.getItem(k)||'[]');
const setList=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));syncCounts()};
const toggleWish=id=>{let a=getList('rewearWishlist');a=a.includes(id)?a.filter(x=>x!==id):[...a,id];setList('rewearWishlist',a);render()};
const addBag=id=>{let a=getList('rewearBag');if(!a.includes(id))a.push(id);setList('rewearBag',a);alert('Added to bag');};
const removeBag=id=>{setList('rewearBag',getList('rewearBag').filter(x=>x!==id));render()};
const syncCounts=()=>{$('#wishlistCount').textContent=getList('rewearWishlist').length;$('#cartCount').textContent=getList('rewearBag').length};
const productCard=(id,p)=>`
<article class="card">
  <a href="?view=product&id=${id}">
    <div class="card-image"><img src="${p.image}" alt="${p.name}"></div>
    <h3>${p.name}</h3><div class="meta">${p.brand} · ${p.condition}</div><div class="price">${fmt(p.price)}</div>
  </a>
  <button class="heart" data-wish="${id}" aria-label="Wishlist">${getList('rewearWishlist').includes(id)?'♥':'♡'}</button>
</article>`;
const cards=(entries)=>entries.map(([id,p])=>productCard(id,p)).join('');
const all=()=>Object.entries(P);

function bind(){
  $$('[data-wish]').forEach(b=>b.onclick=e=>{e.preventDefault();toggleWish(b.dataset.wish)});
  $$('[data-add]').forEach(b=>b.onclick=()=>addBag(b.dataset.add));
  $$('[data-remove]').forEach(b=>b.onclick=()=>removeBag(b.dataset.remove));
}
function renderHome(){
  const featured=['blazer','bag','jumper','sneakers'].filter(x=>P[x]).map(x=>[x,P[x]]);
  app.innerHTML=`
  <section class="hero">
    <div class="hero-copy"><div class="eyebrow">NEW SEASON · PRE-LOVED</div><h1 class="serif">Pieces worth<br>wearing again.</h1><p>Curated second-hand fashion with clear condition notes, trusted sellers and delivery across Sweden.</p><div class="hero-actions"><a class="primary" href="?view=shop">Shop new arrivals →</a><a class="secondary" href="?view=about">Why REWEAR</a></div></div>
    <div class="hero-image"><img src="${(P.trench||P.coat).image}" alt="REWEAR fashion edit"></div>
  </section>
  <section class="proof"><div>Recently added</div><div>Verified sellers</div><div>14-day returns</div><div>Sweden delivery</div></section>
  <div class="container">
    <section class="section"><div class="section-head"><h2 class="serif">Shop by category</h2><a href="?view=shop">View all →</a></div>
      <div class="categories"><a class="category" href="?view=shop&cat=women"><img src="${P.coat.image}"><span>Women →</span></a><a class="category" href="?view=shop&cat=men"><img src="${P.overshirt.image}"><span>Men →</span></a><a class="category" href="?view=shop&cat=accessories"><img src="${P.bag.image}"><span>Accessories →</span></a></div>
    </section>
    <section class="section"><div class="section-head"><h2 class="serif">Featured finds</h2><a href="?view=shop">View all →</a></div><div class="grid">${cards(featured)}</div></section>
    <section class="section story"><div class="story-image"><img src="${P.jumper.image}" alt=""></div><div class="story-copy"><div class="eyebrow">Circular wardrobe</div><h2 class="serif">Good clothes deserve another chapter.</h2><p>REWEAR is an online second-hand fashion platform designed to give quality clothing a longer life. Clear product information, simple navigation and carefully selected pieces make pre-loved shopping feel straightforward.</p><a class="primary" href="?view=shop">Explore the collection →</a></div></section>
  </div>`; bind();
}
function renderShop(){
  let list=all();
  if(cat) list=list.filter(([,p])=>p.category.toLowerCase()===cat);
  app.innerHTML=`<div class="container shop-shell">
    <div class="shop-head"><div><div class="eyebrow">Curated pre-loved fashion</div><h1 class="serif">${cat?cat[0].toUpperCase()+cat.slice(1):'Shop all'}</h1></div><div class="filters"><a class="pill ${!cat?'active':''}" href="?view=shop">All</a><a class="pill ${cat==='women'?'active':''}" href="?view=shop&cat=women">Women</a><a class="pill ${cat==='men'?'active':''}" href="?view=shop&cat=men">Men</a><a class="pill ${cat==='accessories'?'active':''}" href="?view=shop&cat=accessories">Accessories</a></div></div>
    <div class="toolbar"><span>${list.length} items</span><select id="sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div>
    <div id="shopGrid" class="grid">${cards(list)}</div>
  </div>`;
  $('#sort').onchange=e=>{let l=[...list];if(e.target.value==='low')l.sort((a,b)=>a[1].price-b[1].price);if(e.target.value==='high')l.sort((a,b)=>b[1].price-a[1].price);$('#shopGrid').innerHTML=cards(l);bind()};bind();
}
function renderProduct(){
  const p=P[id]||Object.values(P)[0]; const pid=P[id]?id:Object.keys(P)[0];
  app.innerHTML=`<div class="container product-shell">
    <div class="product-main"><img src="${p.image}" alt="${p.name}"></div>
    <section class="product-info"><div class="eyebrow">${p.brand}</div><h1 class="serif">${p.name}</h1><div class="product-price">${fmt(p.price)}</div>
      <div class="tagrow"><span class="tag">${p.condition}</span><span class="tag">Size ${p.size}</span><span class="tag">${p.colour}</span></div>
      <p>${p.description}</p>
      <div class="product-actions"><button class="primary" data-add="${pid}">Add to bag</button><button class="secondary" data-wish="${pid}">${getList('rewearWishlist').includes(pid)?'♥ Saved':'♡ Save'}</button></div>
      <div class="notice">${p.verification||'Condition checked by REWEAR'} · ${p.delivery||'1–3 business days'} · ${p.returns||'14-day returns'}</div>
      <div class="specs"><div><strong>Material</strong><span>${p.material}</span></div><div><strong>Measurements</strong><span>${p.measurements||'See listing details'}</span></div><div><strong>Condition</strong><span>${p.notes}</span></div><div><strong>Seller</strong><span>${p.seller_name||p.seller}</span></div><div><strong>SKU</strong><span>${p.sku||'REWEAR'}</span></div></div>
    </section>
  </div>
  <div class="container section"><div class="section-head"><h2 class="serif">You may also like</h2><a href="?view=shop">Shop all →</a></div><div class="grid">${cards(all().filter(([x])=>x!==pid).slice(0,4))}</div></div>`; bind();
}
function renderWishlist(){
 const ids=getList('rewearWishlist').filter(x=>P[x]); app.innerHTML=`<div class="container bag-shell"><h1 class="serif">Wishlist</h1>${ids.length?`<div class="grid">${cards(ids.map(x=>[x,P[x]]))}</div>`:'<div class="empty">Your wishlist is empty. <a href="?view=shop">Browse the shop →</a></div>'}</div>`;bind();
}
function renderBag(){
 const ids=getList('rewearBag').filter(x=>P[x]), total=ids.reduce((s,x)=>s+P[x].price,0);
 app.innerHTML=`<div class="container bag-shell"><h1 class="serif">Your bag</h1>${ids.length?ids.map(x=>`<div class="bag-row"><img src="${P[x].image}"><div><strong>${P[x].name}</strong><div class="meta">${P[x].brand} · ${P[x].size} · ${P[x].condition}</div><button class="icon-btn" data-remove="${x}">Remove</button></div><strong>${fmt(P[x].price)}</strong></div>`).join('')+`<div class="bag-total"><span>Total</span><strong>${fmt(total)}</strong></div><div style="margin-top:24px;text-align:right"><button class="primary" onclick="alert('Portfolio prototype — checkout is intentionally disabled.')">Secure checkout →</button></div>`:'<div class="empty">Your bag is empty. <a href="?view=shop">Shop pre-loved pieces →</a></div>'}</div>`;bind();
}
function renderAbout(){
 app.innerHTML=`<div class="container about"><div><div class="eyebrow">About REWEAR</div><h1 class="serif">A more circular wardrobe.</h1></div><div><p>REWEAR is a portfolio concept for a modern second-hand fashion marketplace. The project combines interface design, product storytelling and front-end development in one consistent experience.</p><p>The visual system uses a neutral Scandinavian palette, editorial typography and simple shopping flows to keep attention on the products while communicating trust and sustainability.</p><a class="primary" href="?view=shop">View the marketplace →</a></div></div>`;
}
function render(){syncCounts(); if(view==='shop')renderShop();else if(view==='product')renderProduct();else if(view==='wishlist')renderWishlist();else if(view==='bag')renderBag();else if(view==='about')renderAbout();else renderHome();}
$('#searchBtn').onclick=()=>{$('#searchPanel').hidden=false;$('#searchInput').focus()};
$('#closeSearch').onclick=()=>{$('#searchPanel').hidden=true};
$('#searchInput').oninput=e=>{const q=e.target.value.trim().toLowerCase();const list=q?all().filter(([,p])=>[p.name,p.brand,p.category,p.colour].join(' ').toLowerCase().includes(q)).slice(0,8):[];$('#searchResults').innerHTML=list.length?cards(list):q?'<div class="empty">No matching items.</div>':'';bind()};
render();
