/* =========================================================
   ЦВЕТЫ — interactivity · v2
   ========================================================= */
(function () {
  "use strict";
  let io; // IntersectionObserver for reveals (hoisted — used during initial render)
  const rub = (n) => n.toLocaleString("ru-RU").replace(/,/g, " ") + " ₽";
  const img = (id) => id + ".webp"; // images live at repo root

  const PRODUCTS = [
    { id:"189ea8de-549d-4438-8bbf-92850c3e7f59", name:"Алый вечер",     desc:"Красные розы, крафтовая упаковка", type:"roses", price:4200, old:5600, sale:"−25%" },
    { id:"fff56c4b-6a24-4605-afdd-879026f982c9", name:"Пион-нуар",      desc:"Пионовидные розы, шёлковая лента",  type:"peony", price:5900, old:7400, sale:"−20%" },
    { id:"8245b109-987f-4614-ac27-236a77415723", name:"Тёплый янтарь",  desc:"Садовые розы в синей бумаге",       type:"roses", price:3800, old:null,  sale:null  },
    { id:"78aefb8a-8ce7-4fef-a822-bfb1e405e605", name:"Белый этюд",     desc:"Розы и эвкалипт, авторская сборка",  type:"mono",  price:6800, old:8600, sale:"−21%" },
    { id:"783147c0-031e-4749-acb3-88283441688b", name:"Пудра",          desc:"Ранункулюс и садовые розы",         type:"roses", price:4600, old:null,  sale:"NEW" },
    { id:"e75a1a9b-8039-43cc-ae41-ff6834f931eb", name:"Первый снег",    desc:"Белые пионы, розы, гипсофила",       type:"mono",  price:5200, old:6100, sale:"−15%" },
    { id:"84606be1-a618-4c05-ae73-e56cdce09edd", name:"Лавандовый час", desc:"Лизиантус и сиреневые розы",        type:"roses", price:4900, old:null,  sale:null  },
    { id:"3433a401-337c-4740-a58d-527e5f22ebda", name:"Акварель",       desc:"Пастельный микс с эвкалиптом",       type:"mono",  price:4400, old:5300, sale:"−17%" },
  ];
  const RECOMMEND = [
    { id:"e235fdad-2a22-4b86-bfa0-8d98cfa25051", name:"Сухоцвет",  desc:"Пампасная трава", price:3200 },
    { id:"fd6091e2-2105-4a82-be9c-a586dceac4b1", name:"Бархат",    desc:"Розы в коробке",  price:5400 },
    { id:"783147c0-031e-4749-acb3-88283441688b", name:"Пудра",     desc:"Садовые розы",    price:4600 },
    { id:"8245b109-987f-4614-ac27-236a77415723", name:"Янтарь",    desc:"Тёплые розы",     price:3800 },
  ];

  const heartSVG='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 20s-7-4.4-9.2-8.4C1.3 8.7 2.6 5.5 5.6 5c2-.3 3.6.8 4.4 2.2C10.8 5.8 12.4 4.7 14.4 5c3 .5 4.3 3.7 2.8 6.6C19 15.6 12 20 12 20z"/></svg>';
  const plusSVG='<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>';

  /* ---- product grid ---- */
  const grid = document.getElementById("grid");
  function cardHTML(p){
    const sale = p.sale ? `<span class="card__badge ${p.sale==="NEW"?"":"card__badge--sale"}">${p.sale}</span>` : "";
    const old = p.old ? `<span class="card__old">${rub(p.old)}</span>` : "";
    return `<article class="card" data-type="${p.type}" data-price="${p.price}" data-id="${p.id}">
      <div class="card__media">
        ${sale}
        <button class="card__wish" aria-label="В избранное" data-wish>${heartSVG}</button>
        <img src="${img(p.id)}" alt="${p.name}" loading="lazy">
      </div>
      <div class="card__body">
        <h3 class="card__name">${p.name}</h3>
        <p class="card__desc">${p.desc}</p>
        <div class="card__row">
          <span class="card__price"><span class="card__now">${rub(p.price)}</span>${old}</span>
          <button class="card__add" aria-label="В корзину" data-add>${plusSVG}</button>
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

  function render(list){
    let html="";
    list.forEach((p,i)=>{ html+=cardHTML(p); if(i===3) html+=promoHTML; });
    grid.innerHTML=html;
    observeReveals();
  }
  render(PRODUCTS);

  /* ---- recommend row ---- */
  document.getElementById("rrow").innerHTML = RECOMMEND.map(p=>`
    <article class="rcard">
      <div class="rcard__img"><img src="${img(p.id)}" alt="${p.name}" loading="lazy"></div>
      <div class="rcard__b">
        <h3 class="rcard__name">${p.name}</h3>
        <p class="rcard__desc">${p.desc}</p>
        <span class="rcard__price">${rub(p.price)}</span>
      </div>
    </article>`).join("");

  /* ---- wishlist + cart ---- */
  const wish = new Set();
  const wishCount = document.getElementById("wishCount");
  grid.addEventListener("click",(e)=>{
    const w=e.target.closest("[data-wish]");
    if(w){
      const card=w.closest(".card"), id=card.dataset.id;
      w.classList.toggle("on");
      if(wish.has(id)) wish.delete(id); else { wish.add(id); toast("Добавлено в избранное"); }
      wishCount.textContent=wish.size; wishCount.classList.toggle("on",wish.size>0);
      return;
    }
    const a=e.target.closest("[data-add]");
    if(a){ a.animate([{transform:"scale(1)"},{transform:"scale(.82)"},{transform:"scale(1)"}],{duration:260,easing:"cubic-bezier(.22,.61,.36,1)"}); toast("Букет добавлен в корзину"); }
  });

  /* ---- filters ---- */
  const fType=document.getElementById("fType"), sortSel=document.getElementById("sortSel"),
        priceRange=document.getElementById("priceRange"), priceVal=document.getElementById("priceVal");
  function apply(){
    const t=fType.value, max=+priceRange.value;
    const cards=[...grid.querySelectorAll(".card:not(.card--promo)")];
    cards.forEach(c=>{
      const ok=(t==="all"||c.dataset.type===t) && (+c.dataset.price<=max);
      c.classList.toggle("is-hidden",!ok);
    });
    const s=sortSel.value;
    if(s!=="pop"){
      const vis=cards.filter(c=>!c.classList.contains("is-hidden"));
      vis.sort((a,b)=>s==="asc"?a.dataset.price-b.dataset.price:b.dataset.price-a.dataset.price);
      const promo=grid.querySelector(".card--promo");
      vis.forEach(c=>grid.appendChild(c)); if(promo) grid.appendChild(promo);
    }
  }
  fType.addEventListener("change",apply);
  sortSel.addEventListener("change",apply);
  priceRange.addEventListener("input",()=>{
    priceVal.textContent=rub(+priceRange.value);
    const pct=((priceRange.value-priceRange.min)/(priceRange.max-priceRange.min))*100;
    priceRange.style.setProperty("--fill",pct+"%"); apply();
  });
  priceRange.dispatchEvent(new Event("input"));

  document.getElementById("chips").addEventListener("click",(e)=>{
    const chip=e.target.closest("[data-chip]"); if(chip) chip.remove();
  });

  /* ---- glass switcher: sliding pill ---- */
  const switchWrap=document.querySelector(".switch");
  const pill=document.getElementById("switchPill");
  const items=[...document.querySelectorAll(".switch__item")];
  function movePill(el){
    if(!el||!pill) return;
    pill.style.width=el.offsetWidth+"px";
    pill.style.transform=`translateX(${el.offsetLeft-3}px)`;
  }
  function setActive(el){ items.forEach(i=>i.classList.toggle("is-active",i===el)); movePill(el); }
  const activeInit=document.querySelector(".switch__item.is-active")||items[0];
  requestAnimationFrame(()=>movePill(activeInit));
  window.addEventListener("resize",()=>movePill(document.querySelector(".switch__item.is-active")));
  items.forEach(it=>it.addEventListener("click",()=>setActive(it)));

  /* ---- plate hide on scroll ---- */
  const plate=document.getElementById("plate"); let lastY=0;
  window.addEventListener("scroll",()=>{
    const y=window.scrollY;
    plate.classList.toggle("is-scrolled",y>40);
    if(y>lastY&&y>440) plate.classList.add("is-hidden"); else plate.classList.remove("is-hidden");
    lastY=y;
  },{passive:true});

  /* ---- active switch item on scroll ---- */
  const secMap={catalog:items[0],builder:items[1],contacts:items[2]};
  const secObs=new IntersectionObserver((ents)=>{
    ents.forEach(en=>{ if(en.isIntersecting&&secMap[en.target.id]) setActive(secMap[en.target.id]); });
  },{threshold:.4});
  Object.keys(secMap).forEach(id=>{const s=document.getElementById(id); if(s) secObs.observe(s);});

  /* ---- hero parallax ---- */
  const hero=document.querySelector(".hero");
  const bg=document.querySelector(".hero__bg"), fg=document.querySelector(".hero__fg");
  if(hero&&matchMedia("(pointer:fine)").matches&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
    hero.addEventListener("pointermove",(e)=>{
      const r=hero.getBoundingClientRect();
      const dx=(e.clientX-r.width/2)/r.width, dy=(e.clientY-r.height/2)/r.height;
      if(bg) bg.style.transform=`scale(1.06) translate(${dx*-14}px,${dy*-14}px)`;
      if(fg) fg.style.transform=`scale(1.06) translate(${dx*18}px,${dy*18}px)`;
    });
  }

  /* ---- reveal on scroll ---- */
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
