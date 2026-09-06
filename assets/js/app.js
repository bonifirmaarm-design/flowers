/* =========================================================
   ЦВЕТЫ — interactivity · v3
   ========================================================= */
(function () {
  "use strict";
  let io;
  const rub = (n) => n.toLocaleString("ru-RU").replace(/,/g, " ") + " ₽";
  const img = (id) => id + ".webp";

  const PRODUCTS = [
    { id:"189ea8de-549d-4438-8bbf-92850c3e7f59", name:"Алый вечер",     desc:"Красные розы, крафтовая упаковка", type:"roses", price:4200, old:5600, sale:"−25%" },
    { id:"fff56c4b-6a24-4605-afdd-879026f982c9", name:"Пион-нуар",      desc:"Пионовидные розы, шёлковая лента",  type:"peony", price:5900, old:7400, sale:"−20%" },
    { id:"8245b109-987f-4614-ac27-236a77415723", name:"Тёплый янтарь",  desc:"Садовые розы в синей бумаге",       type:"roses", price:3800, old:null,  sale:null  },
    { id:"78aefb8a-8ce7-4fef-a822-bfb1e405e605", name:"Белый этюд",     desc:"Розы и эвкалипт, авторская сборка",  type:"mono",  price:6800, old:8600, sale:"−21%" },
    { id:"783147c0-031e-4749-acb3-88283441688b", name:"Пудра",          desc:"Ранункулюс и садовые розы",         type:"roses", price:4600, old:null,  sale:"NEW" },
    { id:"e75a1a9b-8039-43cc-ae41-ff6834f931eb", name:"Первый снег",    desc:"Белые пионы, розы, гипсофила",       type:"mono",  price:5200, old:6100, sale:"−15%" },
    { id:"84606be1-a618-4c05-ae73-e56cdce09edd", name:"Лавандовый час", desc:"Лизиантус и сиреневые розы",        type:"roses", price:4900, old:null,  sale:null  },
    { id:"3433a401-337c-4740-a58d-527e5f22ebda", name:"Акварель",       desc:"Пастельный микс с эвкалиптом",       type:"mono",  price:4400, old:5300, sale:"−17%" },
    { id:"fd6091e2-2105-4a82-be9c-a586dceac4b1", name:"Бархат",         desc:"Красные розы в шляпной коробке",     type:"box",   price:5400, old:6900, sale:"−22%" },
    { id:"e235fdad-2a22-4b86-bfa0-8d98cfa25051", name:"Сухой этюд",     desc:"Пампасная трава и сухоцветы",        type:"dried", price:3200, old:null,  sale:"NEW" },
  ];
  const RECOMMEND = [
    { id:"e235fdad-2a22-4b86-bfa0-8d98cfa25051", name:"Сухоцвет", desc:"Пампасная трава", price:3200 },
    { id:"fd6091e2-2105-4a82-be9c-a586dceac4b1", name:"Бархат",   desc:"Розы в коробке",  price:5400 },
    { id:"783147c0-031e-4749-acb3-88283441688b", name:"Пудра",    desc:"Садовые розы",    price:4600 },
    { id:"8245b109-987f-4614-ac27-236a77415723", name:"Янтарь",   desc:"Тёплые розы",     price:3800 },
  ];

  // flower icon (replaces the heart)
  const flowerSVG='<svg class="ic-flower" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2">'+
    '<ellipse cx="12" cy="7" rx="2" ry="3.2"/><ellipse cx="12" cy="7" rx="2" ry="3.2" transform="rotate(72 12 12)"/>'+
    '<ellipse cx="12" cy="7" rx="2" ry="3.2" transform="rotate(144 12 12)"/><ellipse cx="12" cy="7" rx="2" ry="3.2" transform="rotate(216 12 12)"/>'+
    '<ellipse cx="12" cy="7" rx="2" ry="3.2" transform="rotate(288 12 12)"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/></svg>';
  const cartSVG='<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 5h2l1.6 9.4a1.4 1.4 0 0 0 1.4 1.2h7a1.4 1.4 0 0 0 1.4-1.1L20 8H7"/><circle cx="10" cy="19.5" r="1.1"/><circle cx="17" cy="19.5" r="1.1"/></svg>';

  const CAT={roses:"Розы",peony:"Пионы",mono:"Монобукет",dried:"Сухоцветы",box:"В коробке"};
  const grid = document.getElementById("grid");
  function cardHTML(p){
    const sale = p.sale ? `<span class="card__badge ${p.sale==="NEW"?"":"card__badge--sale"}">${p.sale}</span>` : "";
    const old = p.old ? `<span class="card__old">${rub(p.old)}</span>` : "";
    return `<article class="card" data-type="${p.type}" data-price="${p.price}" data-id="${p.id}">
      <div class="card__media">${sale}<img src="${img(p.id)}" alt="${p.name}" loading="lazy"></div>
      <div class="card__body">
        <span class="card__cat">${CAT[p.type]||"Букет"}</span>
        <h3 class="card__name">${p.name}</h3>
        <p class="card__desc">${p.desc}</p>
        <div class="card__row">
          <span class="card__price"><span class="card__now">${rub(p.price)}</span>${old}</span>
          <div class="card__acts">
            <button class="card__icn" aria-label="В избранное" data-wish>${flowerSVG}</button>
            <button class="card__icn card__icn--cart" aria-label="В корзину" data-add>${cartSVG}</button>
          </div>
        </div>
      </div>
    </article>`;
  }
  const promoHTML = `<article class="card card--promo reveal">
    <div class="promo__copy">
      <p class="eyebrow">Акция недели</p>
      <h3>−20% на пионовидные розы</h3>
      <p>Нежные композиции из сезонных пионов. Успейте порадовать до конца недели.</p>
      <a href="#builder" class="btn btn--ghost">Перейти к подробностям
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    </div>
    <div class="promo__media"><img src="${img("fff56c4b-6a24-4605-afdd-879026f982c9")}" alt="Пионовидные розы"></div>
  </article>`;

  const giftHTML = `<article class="card card--gift reveal">
    <span class="gift__mark" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4 9h16v11H4zM3 6.5h18V9H3zM12 6.5V20"/><path d="M12 6.5C10 6.5 8.2 5.4 8.2 4S9.3 2 10.4 2.4 12 4.5 12 6.5zM12 6.5c2 0 3.8-1.1 3.8-2.5S14.7 2 13.6 2.4 12 4.5 12 6.5z"/></svg></span>
    <div class="gift__copy">
      <p class="gift__eyebrow">Идеальный подарок</p>
      <h3>Подарочный сертификат</h3>
      <p>Любая сумма · срок 12 месяцев · пришлём на email или в фирменном конверте.</p>
      <a href="#contacts" class="btn btn--rose">Оформить сертификат
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    </div>
  </article>`;

  function render(list){
    let html=""; list.forEach((p,i)=>{ html+=cardHTML(p); if(i===3) html+=promoHTML; if(i===5) html+=giftHTML; });
    grid.innerHTML=html; observeReveals();
  }
  render(PRODUCTS);

  document.getElementById("rrow").innerHTML = RECOMMEND.map(p=>`
    <article class="rcard">
      <div class="rcard__img"><img src="${img(p.id)}" alt="${p.name}" loading="lazy"></div>
      <div class="rcard__b"><h3 class="rcard__name">${p.name}</h3><p class="rcard__desc">${p.desc}</p><span class="rcard__price">${rub(p.price)}</span></div>
    </article>`).join("");

  /* ---- wishlist + cart state ---- */
  const byId={}; [...PRODUCTS,...RECOMMEND].forEach(p=>{byId[p.id]=p;});
  const wish=new Set(); const cart=[]; let drawerMode="wish";
  const wishCount=document.getElementById("wishCount");
  const cartCount=document.getElementById("cartCount");
  function updWish(){wishCount.textContent=wish.size;wishCount.classList.toggle("on",wish.size>0);
    grid.querySelectorAll(".card").forEach(c=>{const b=c.querySelector("[data-wish]");if(b)b.classList.toggle("on",wish.has(c.dataset.id));});}
  function updCart(){if(cartCount){cartCount.textContent=cart.length;cartCount.classList.toggle("on",cart.length>0);}}
  grid.addEventListener("click",(e)=>{
    const w=e.target.closest("[data-wish]");
    if(w){ const id=w.closest(".card").dataset.id;
      if(wish.has(id)) wish.delete(id); else { wish.add(id); toast("Добавлено в избранное"); }
      updWish(); if(drawerMode==="wish"&&!drawer.hidden) renderDrawer(); return; }
    const a=e.target.closest("[data-add]");
    if(a){ const id=a.closest(".card").dataset.id; cart.push(id); updCart();
      a.animate([{transform:"scale(1)"},{transform:"scale(.82)"},{transform:"scale(1)"}],{duration:260,easing:"cubic-bezier(.22,.61,.36,1)"});
      toast("Букет добавлен в корзину"); if(drawerMode==="cart"&&!drawer.hidden) renderDrawer(); }
  });

  /* ---- filters ---- */
  const fType=document.getElementById("fType"), sortSel=document.getElementById("sortSel"),
        priceRange=document.getElementById("priceRange"), priceVal=document.getElementById("priceVal");
  function apply(){
    const t=fType.value, max=+priceRange.value;
    const cards=[...grid.querySelectorAll(".card:not(.card--promo):not(.card--gift)")];
    cards.forEach(c=>c.classList.toggle("is-hidden",!((t==="all"||c.dataset.type===t)&&(+c.dataset.price<=max))));
    const s=sortSel.value;
    if(s!=="pop"){
      const vis=cards.filter(c=>!c.classList.contains("is-hidden"));
      vis.sort((a,b)=>s==="asc"?a.dataset.price-b.dataset.price:b.dataset.price-a.dataset.price);
      const promo=grid.querySelector(".card--promo"); vis.forEach(c=>grid.appendChild(c)); if(promo) grid.appendChild(promo);
    }
  }
  fType.addEventListener("change",apply);
  sortSel.addEventListener("change",apply);
  priceRange.addEventListener("input",()=>{ priceVal.textContent=rub(+priceRange.value);
    priceRange.style.setProperty("--fill",((priceRange.value-priceRange.min)/(priceRange.max-priceRange.min))*100+"%"); apply(); });
  priceRange.dispatchEvent(new Event("input"));
  document.getElementById("chips").addEventListener("click",(e)=>{const c=e.target.closest("[data-chip]"); if(c) c.remove();});

  /* ---- ФИЛЬТРЫ modal ---- */
  const fmodal=document.getElementById("filterModal");
  const openFilters=document.getElementById("openFilters");
  if(fmodal&&openFilters){
    openFilters.addEventListener("click",()=>{fmodal.hidden=false;document.body.style.overflow="hidden";});
    const close=()=>{fmodal.hidden=true;document.body.style.overflow="";};
    fmodal.querySelectorAll("[data-mclose]").forEach(el=>el.addEventListener("click",close));
    document.addEventListener("keydown",(e)=>{if(e.key==="Escape"&&!fmodal.hidden) close();});
    const mr=fmodal.querySelector("[data-mrange]"), mrv=fmodal.querySelector("[data-mrangeval]");
    if(mr&&mrv){const upd=()=>{mrv.textContent=rub(+mr.value);mr.style.setProperty("--fill",((mr.value-mr.min)/(mr.max-mr.min))*100+"%");};mr.addEventListener("input",upd);upd();}
    fmodal.querySelectorAll("[data-chip]").forEach(c=>c.addEventListener("click",()=>c.remove()));
  }

  /* ---- favorites / cart drawer ---- */
  const drawer=document.getElementById("drawer");
  const drawerBody=document.getElementById("drawerBody");
  const drawerTitle=document.getElementById("drawerTitle");
  const drawerFoot=document.getElementById("drawerFoot");
  function openDrawer(mode){drawerMode=mode;renderDrawer();drawer.hidden=false;document.body.style.overflow="hidden";}
  function closeDrawer(){drawer.hidden=true;document.body.style.overflow="";}
  function rowHTML(id,mode,idx){
    const p=byId[id]; if(!p) return "";
    return `<div class="drow"><div class="drow__img"><img src="${img(id)}" alt="${p.name}"></div>
      <div class="drow__b"><h4>${p.name}</h4><p>${p.desc||""}</p><span class="drow__price">${rub(p.price)}</span></div>
      <button class="drow__x" data-drem="${mode}" data-id="${id}" ${idx!=null?`data-idx="${idx}"`:""} aria-label="Убрать">&times;</button></div>`;
  }
  function renderDrawer(){
    if(!drawer) return;
    if(drawerMode==="wish"){
      drawerTitle.textContent="Избранное";
      const ids=[...wish];
      drawerBody.innerHTML = ids.length ? ids.map(id=>rowHTML(id,"wish")).join("")
        : `<p class="drawer__empty">Пока пусто. Нажмите на цветок на карточке, чтобы сохранить букет.</p>`;
      drawerFoot.innerHTML="";
    } else {
      drawerTitle.textContent="Корзина";
      drawerBody.innerHTML = cart.length ? cart.map((id,i)=>rowHTML(id,"cart",i)).join("")
        : `<p class="drawer__empty">Корзина пуста. Добавьте букет из каталога.</p>`;
      const total=cart.reduce((s,id)=>s+(byId[id]?byId[id].price:0),0);
      drawerFoot.innerHTML = cart.length ? `<div class="drawer__total"><span>Итого</span><span>${rub(total)}</span></div><button class="btn btn--rose drawer__checkout">Оформить заказ</button>` : "";
    }
  }
  if(drawer){
    document.querySelectorAll("[data-wishbtn]").forEach(b=>b.addEventListener("click",()=>openDrawer("wish")));
    document.querySelectorAll("[data-cartbtn]").forEach(b=>b.addEventListener("click",()=>openDrawer("cart")));
    drawer.querySelectorAll("[data-dclose]").forEach(el=>el.addEventListener("click",closeDrawer));
    document.addEventListener("keydown",(e)=>{if(e.key==="Escape"&&!drawer.hidden) closeDrawer();});
    drawerBody.addEventListener("click",(e)=>{
      const x=e.target.closest("[data-drem]"); if(!x) return;
      if(x.dataset.drem==="wish"){ wish.delete(x.dataset.id); updWish(); }
      else { cart.splice(+x.dataset.idx,1); updCart(); }
      renderDrawer();
    });
    drawer.addEventListener("click",(e)=>{ if(e.target.closest(".drawer__checkout")) toast("Спасибо! Это демо — заказ не оформляется."); });
  }

  /* ---- switcher pill ---- */
  const pill=document.getElementById("switchPill");
  const items=[...document.querySelectorAll(".switch__item")];
  function movePill(el){ if(!el||!pill) return; pill.style.width=el.offsetWidth+"px"; pill.style.transform=`translateX(${el.offsetLeft-3}px)`; }
  function setActive(el){ items.forEach(i=>i.classList.toggle("is-active",i===el)); movePill(el); }
  requestAnimationFrame(()=>movePill(document.querySelector(".switch__item.is-active")||items[0]));
  window.addEventListener("resize",()=>movePill(document.querySelector(".switch__item.is-active")));
  items.forEach(it=>it.addEventListener("click",()=>setActive(it)));

  /* ---- burger / mobile menu (mobile only) ---- */
  const burger=document.getElementById("burger"), msheet=document.getElementById("msheet");
  function closeMenu(){ burger.classList.remove("open"); burger.setAttribute("aria-expanded","false"); msheet.hidden=true; }
  burger&&burger.addEventListener("click",()=>{
    const open=burger.classList.toggle("open");
    burger.setAttribute("aria-expanded",String(open)); msheet.hidden=!open;
  });
  msheet&&msheet.querySelectorAll("[data-mlink]").forEach(a=>a.addEventListener("click",closeMenu));

  /* ---- plate stays visible; solid wine plate once scrolled ---- */
  const plate=document.getElementById("plate");
  window.addEventListener("scroll",()=>{ plate.classList.toggle("is-scrolled",window.scrollY>40); },{passive:true});

  /* ---- active switch item on scroll ---- */
  const secMap={catalog:items[0],builder:items[1],contacts:items[2]};
  const secObs=new IntersectionObserver((ents)=>{ents.forEach(en=>{if(en.isIntersecting&&secMap[en.target.id]) setActive(secMap[en.target.id]);});},{threshold:.4});
  Object.keys(secMap).forEach(id=>{const s=document.getElementById(id); if(s) secObs.observe(s);});

  /* ---- hero parallax ---- */
  const hero=document.querySelector(".hero");
  const bg=document.querySelector(".hero__bg"), fgs=[...document.querySelectorAll(".hero__fg")];
  if(hero&&matchMedia("(pointer:fine)").matches&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
    hero.addEventListener("pointermove",(e)=>{
      const r=hero.getBoundingClientRect(); const dx=(e.clientX-r.width/2)/r.width, dy=(e.clientY-r.height/2)/r.height;
      if(bg) bg.style.transform=`scale(1.06) translate(${dx*-14}px,${dy*-14}px)`;
      fgs.forEach(f=>f.style.transform=`scale(1.06) translate(${dx*16}px,${dy*16}px)`);
    });
  }

  /* ---- reveal ---- */
  function observeReveals(){
    if(!("IntersectionObserver" in window)) return;
    io=io||new IntersectionObserver((ents)=>{ents.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);}});},{threshold:.12});
    document.querySelectorAll(".reveal:not(.in)").forEach(el=>io.observe(el));
  }
  observeReveals();

  /* ---- toast ---- */
  let tT; const toastEl=document.getElementById("toast");
  function toast(msg){ toastEl.textContent=msg; toastEl.classList.add("show"); clearTimeout(tT); tT=setTimeout(()=>toastEl.classList.remove("show"),2000); }
})();
