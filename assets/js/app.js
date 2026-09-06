/* =========================================================
   ЦВЕТЫ — interactivity
   ========================================================= */
(function () {
  "use strict";

  const IMG = "https://gen.krea.ai/images/";
  const rub = (n) => n.toLocaleString("ru-RU").replace(/,/g, " ") + " ₽";

  /* ---- product catalogue ---- */
  const PRODUCTS = [
    { id: "red-roses",   name: "Алый вечер",     desc: "Красные розы, крафтовая упаковка", type: "roses", img: "189ea8de-549d-4438-8bbf-92850c3e7f59", price: 4200, old: 5600, badge: "-25%" },
    { id: "peonies",     name: "Пион-нуар",      desc: "Пионовидные розы, шёлковая лента",  type: "peony", img: "fff56c4b-6a24-4605-afdd-879026f982c9", price: 5900, old: 7400, badge: "-20%" },
    { id: "yellow",      name: "Тёплый янтарь",  desc: "Садовые розы в синей бумаге",       type: "roses", img: "8245b109-987f-4614-ac27-236a77415723", price: 3800, old: null,  badge: null },
    { id: "white-chair", name: "Белый этюд",     desc: "Розы и эвкалипт, авторская сборка",  type: "mono",  img: "78aefb8a-8ce7-4fef-a822-bfb1e405e605", price: 6800, old: 8600, badge: "-21%" },
    { id: "blush",       name: "Пудра",          desc: "Ранункулюс и садовые розы",         type: "roses", img: "783147c0-031e-4749-acb3-88283441688b", price: 4600, old: null,  badge: "new" },
    { id: "white-bq",    name: "Первый снег",    desc: "Белые пионы, розы, гипсофила",       type: "mono",  img: "e75a1a9b-8039-43cc-ae41-ff6834f931eb", price: 5200, old: 6100, badge: "-15%" },
    { id: "lilac",       name: "Лавандовый час", desc: "Лизиантус и сиреневые розы",        type: "roses", img: "84606be1-a618-4c05-ae73-e56cdce09edd", price: 4900, old: null,  badge: null },
    { id: "pastel",      name: "Акварель",       desc: "Пастельный микс с эвкалиптом",       type: "mono",  img: "3433a401-337c-4740-a58d-527e5f22ebda", price: 4400, old: 5300, badge: "-17%" },
    { id: "dried",       name: "Сухой букет",    desc: "Пампасная трава и сухоцветы",        type: "dried", img: "e235fdad-2a22-4b86-bfa0-8d98cfa25051", price: 3200, old: null,  badge: null },
    { id: "red-box",     name: "Бархат",         desc: "Красные розы в шляпной коробке",     type: "box",   img: "fd6091e2-2105-4a82-be9c-a586dceac4b1", price: 5400, old: 6900, badge: "-22%" },
  ];

  const heartSVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20s-7-4.4-9.2-8.4C1.3 8.7 2.6 5.5 5.6 5c2-.3 3.6.8 4.4 2.2C10.8 5.8 12.4 4.7 14.4 5c3 .5 4.3 3.7 2.8 6.6C19 15.6 12 20 12 20z"/></svg>';
  const plusSVG  = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 5v14M5 12h14"/></svg>';

  const grid = document.getElementById("grid");
  const wish = new Set();

  function cardHTML(p) {
    const badge = p.badge ? `<span class="card__badge">${p.badge === "new" ? "NEW" : p.badge}</span>` : "";
    const old = p.old ? `<span class="card__old">${rub(p.old)}</span>` : "";
    return `<article class="card" data-type="${p.type}" data-price="${p.price}" data-id="${p.id}">
      ${badge}
      <button class="card__wish" aria-label="В избранное" data-wish>${heartSVG}</button>
      <div class="card__media"><img src="${IMG}${p.img}.png" alt="${p.name}" loading="lazy"></div>
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
      <p class="promo__eyebrow">Акция недели</p>
      <h3>−20% на пионовидные&nbsp;розы</h3>
      <p>Собираем нежные композиции из сезонных пионов. Успейте порадовать до конца недели.</p>
      <a href="#builder" class="btn btn--ghost">Перейти к подробностям
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </div>
    <img class="promo__img" src="${IMG}f640b4e1-c106-44fa-85e2-88e51005c940.png" alt="" aria-hidden="true">
  </article>`;

  function render(list) {
    // insert promo after the 6th card for rhythm
    let html = "";
    list.forEach((p, i) => {
      html += cardHTML(p);
      if (i === 5) html += promoHTML;
    });
    grid.innerHTML = html;
    observeReveals();
  }
  render(PRODUCTS);

  /* ---- wishlist + cart (event delegation) ---- */
  const wishCount = document.getElementById("wishCount");
  grid.addEventListener("click", (e) => {
    const w = e.target.closest("[data-wish]");
    if (w) {
      const card = w.closest(".card");
      const id = card.dataset.id;
      w.classList.toggle("on");
      if (wish.has(id)) { wish.delete(id); } else { wish.add(id); toast("Добавлено в избранное"); }
      wishCount.textContent = wish.size;
      wishCount.classList.toggle("on", wish.size > 0);
      return;
    }
    const a = e.target.closest("[data-add]");
    if (a) {
      a.animate([{ transform: "scale(1)" }, { transform: "scale(.82)" }, { transform: "scale(1)" }], { duration: 260, easing: "cubic-bezier(.22,.61,.36,1)" });
      toast("Букет добавлен в корзину");
    }
  });

  /* ---- filters: type + sort + price ---- */
  const fType = document.getElementById("fType");
  const sortSel = document.getElementById("sortSel");
  const priceRange = document.getElementById("priceRange");
  const priceVal = document.getElementById("priceVal");

  function apply() {
    const t = fType.value;
    const max = +priceRange.value;
    const cards = [...grid.querySelectorAll(".card:not(.card--promo)")];
    cards.forEach((c) => {
      const okType = t === "all" || c.dataset.type === t;
      const okPrice = +c.dataset.price <= max;
      c.classList.toggle("is-hidden", !(okType && okPrice));
    });
    // sort
    const visible = cards.filter((c) => !c.classList.contains("is-hidden"));
    const s = sortSel.value;
    if (s !== "pop") {
      visible.sort((a, b) => s === "asc" ? a.dataset.price - b.dataset.price : b.dataset.price - a.dataset.price);
      const promo = grid.querySelector(".card--promo");
      visible.forEach((c) => grid.appendChild(c));
      if (promo) grid.appendChild(promo);
    }
  }
  fType.addEventListener("change", apply);
  sortSel.addEventListener("change", apply);
  priceRange.addEventListener("input", () => {
    priceVal.textContent = rub(+priceRange.value);
    const pct = ((priceRange.value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
    priceRange.style.setProperty("--fill", pct + "%");
    apply();
  });
  // init fill
  priceRange.dispatchEvent(new Event("input"));

  /* ---- removable filter chips ---- */
  document.getElementById("chips").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-chip]");
    if (chip) chip.remove();
  });

  /* ---- nav: hide on scroll down, glass on scroll ---- */
  const nav = document.getElementById("nav");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    if (y > lastY && y > 400) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastY = y;
  }, { passive: true });

  /* ---- burger (mobile): reveal links as a simple sheet ---- */
  const burger = document.getElementById("burger");
  const links = document.querySelector(".nav__links");
  burger && burger.addEventListener("click", () => {
    const open = links.style.display === "flex";
    links.style.display = open ? "" : "flex";
    links.style.position = "absolute";
    links.style.top = "64px";
    links.style.left = "0";
    links.style.right = "0";
    links.style.flexDirection = "column";
    links.style.padding = "10px";
    links.style.background = "rgba(34,22,25,.9)";
    links.style.backdropFilter = "blur(20px)";
    links.style.borderRadius = "20px";
    links.style.border = "1px solid var(--hair)";
    burger.setAttribute("aria-expanded", String(!open));
  });

  /* ---- hero parallax (pointer) ---- */
  const stage = document.querySelector(".hero");
  const layers = document.querySelectorAll(".hero__flower, .hero__bg");
  if (stage && matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      const dx = (e.clientX - r.width / 2) / r.width;
      const dy = (e.clientY - r.height / 2) / r.height;
      layers.forEach((el) => {
        const d = parseFloat(el.dataset.depth || 0.03) * 60;
        el.style.transform = (el.classList.contains("hero__bg") ? "scale(1.08) " : (el.classList.contains("hero__flower--frontR") ? "scaleX(-1) " : "")) + `translate(${dx * d}px, ${dy * d}px)`;
      });
    });
  }

  /* ---- reveal on scroll ---- */
  let io;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) return;
    io = io || new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
  }
  observeReveals();

  /* ---- toast ---- */
  let toastT;
  const toastEl = document.getElementById("toast");
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("show"), 2000);
  }

  /* ---- active nav link on scroll ---- */
  const sections = ["catalog", "builder", "story", "contacts"].map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = [...document.querySelectorAll(".nav__link")];
  const secObserver = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (en.isIntersecting) {
        navLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach((s) => secObserver.observe(s));
})();
