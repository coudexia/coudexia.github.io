// Comportamiento compartido por las demos rediseñadas.
(() => {
  const html = document.documentElement;
  html.classList.add('js-on');
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Apariciones al hacer scroll, escalonadas entre hermanos
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach((el) => {
    if (!el.style.getPropertyValue('--i')) {
      const hermanos = [...el.parentElement.children].filter((c) => c.classList.contains('rv'));
      el.style.setProperty('--i', String(Math.min(hermanos.indexOf(el), 5)));
    }
    io.observe(el);
  });

  // Encabezado: estado al bajar
  const marcar = () => html.classList.toggle('bajo', scrollY > 12);
  addEventListener('scroll', marcar, { passive: true }); marcar();

  // Menú móvil
  const btn = document.querySelector('.nav-btn');
  if (btn) {
    const abrir = (si) => { html.classList.toggle('menu-abierto', si); btn.setAttribute('aria-expanded', String(si)); btn.setAttribute('aria-label', si ? 'Cerrar menú' : 'Abrir menú'); };
    btn.addEventListener('click', () => abrir(!html.classList.contains('menu-abierto')));
    document.querySelectorAll('.menu a').forEach((a) => a.addEventListener('click', () => abrir(false)));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') abrir(false); });
  }

  // Galería ampliable: <figure data-full="url"> dentro de .galeria y un <dialog class="lightbox">
  const lb = document.querySelector('.lightbox');
  if (lb) {
    const img = lb.querySelector('img'), cap = lb.querySelector('p');
    document.querySelectorAll('.galeria [data-full]').forEach((f) => {
      f.tabIndex = 0; f.setAttribute('role', 'button');
      const abrir = () => { img.src = f.dataset.full; img.alt = f.querySelector('img').alt; cap.textContent = f.querySelector('figcaption')?.textContent || ''; lb.showModal(); };
      f.addEventListener('click', abrir);
      f.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); } });
    });
    lb.addEventListener('click', () => lb.close());
  }

  // Formularios que arman el mensaje de WhatsApp: <form class="consulta" data-wa="https://wa.me/...">
  // Cada campo con name se agrega como "Etiqueta: valor" (data-label define la etiqueta).
  document.querySelectorAll('form.consulta').forEach((fm) => fm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!fm.reportValidity()) return;
    const d = new FormData(fm);
    const partes = [`Hola! Soy ${d.get('nombre')}.`];
    fm.querySelectorAll('[name]:not([name="nombre"])').forEach((el) => {
      const v = String(d.get(el.name) || '').trim();
      if (v && (el.type !== 'radio' || el.checked)) partes.push(`${el.dataset.label || el.name}: ${v}`);
    });
    const a = document.createElement('a');
    a.href = `${fm.dataset.wa}?text=${encodeURIComponent(partes.join('\n'))}`; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  }));

  // Números que cuentan al aparecer: <span data-cuenta="12">
  if (!calmo) document.querySelectorAll('[data-cuenta]').forEach((el) => {
    const fin = Number(el.dataset.cuenta);
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect();
      const t0 = performance.now();
      const paso = (t) => { const k = Math.min(1, (t - t0) / 1400); el.textContent = String(Math.round(fin * (1 - (1 - k) ** 3))); if (k < 1) requestAnimationFrame(paso); };
      requestAnimationFrame(paso);
    });
    obs.observe(el);
  });
})();

// Los contactos de las demos usan un número ficticio: en vez de abrir WhatsApp o el teléfono, se avisa.
(() => {
  let toast, timer;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="5491100000000"], a[href*=".demo/"]');
    if (!a) return;
    e.preventDefault();
    if (!toast) { toast = document.createElement('div'); toast.className = 'fx-toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
    const tipo = a.href.startsWith('tel:') ? 'iniciaría una llamada al negocio' : a.href.includes('instagram.com') ? 'abriría el Instagram del negocio' : 'abriría el WhatsApp del negocio con el mensaje listo';
    toast.innerHTML = `<b>Proyecto demo:</b> en un sitio real este botón ${tipo}.`;
    toast.classList.add('ver');
    clearTimeout(timer); timer = setTimeout(() => toast.classList.remove('ver'), 3400);
  });
})();
