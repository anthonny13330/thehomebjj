/* ============ THE HOME BJJ ============ */
/* Edita aqui os dados da academia */
const CONFIG = {
  whatsapp: '351000000000',            // número com indicativo, sem + nem espaços
  phoneLabel: '+351 000 000 000',
  email: 'ola@thehomebjj.pt',
  instagram: '@thehome.bjj',
  address: 'Largo da Lagoa 15F, 2795-116 Lisboa',
};

/* Horários de exemplo — substituir pelos reais */
const SCHEDULE = {
  'Seg': [['07:00','Jiu-Jitsu Adultos','Todos os níveis','Gi'],['18:30','Kids (6–12)','Turma infantil','Kids'],['20:00','Jiu-Jitsu Adultos','Fundamentos','Gi']],
  'Ter': [['12:30','No-Gi / Grappling','Treino ao almoço','No-Gi'],['19:00','Primeiros Passos','Para iniciantes','Iniciantes'],['20:15','No-Gi / Grappling','Treino intenso','No-Gi']],
  'Qua': [['07:00','Jiu-Jitsu Adultos','Todos os níveis','Gi'],['18:30','Kids (6–12)','Turma infantil','Kids'],['20:00','Jiu-Jitsu Adultos','Avançado','Gi']],
  'Qui': [['12:30','No-Gi / Grappling','Treino ao almoço','No-Gi'],['19:00','Primeiros Passos','Para iniciantes','Iniciantes'],['20:15','No-Gi / Grappling','Treino intenso','No-Gi']],
  'Sex': [['18:30','Kids (6–12)','Turma infantil','Kids'],['20:00','Open Mat','Treino livre','Livre']],
  'Sáb': [['10:00','Jiu-Jitsu Adultos','Todos os níveis','Gi'],['11:30','Open Mat','Treino livre','Livre']],
  'Dom': [],
};

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

/* ---------- Logótipo: H → casa ---------- */
const LOGO = `
  <circle class="lg-ring" cx="60" cy="60" r="57"/>
  <polyline class="lg-roof" points="20,58 60,22 100,58" pathLength="1"/>
  <line class="lg-tbar" x1="28" y1="34" x2="92" y2="34" pathLength="1"/>
  <line class="lg-stem" x1="60" y1="34" x2="60" y2="64" pathLength="1"/>
  <line class="lg-l" x1="38" y1="66" x2="38" y2="98" pathLength="1"/>
  <line class="lg-r" x1="82" y1="66" x2="82" y2="98" pathLength="1"/>
  <line class="lg-bar" x1="38" y1="82" x2="82" y2="82" pathLength="1"/>
  <rect class="lg-door" x="50" y="68" width="20" height="30" rx="2"/>
  <circle class="lg-knob" cx="65" cy="84" r="1.8"/>`;
$$('svg.logo').forEach(s => (s.innerHTML = LOGO));

/* Logótipos da navegação: alternam entre H e casa; ao passar o rato viram casa */
const navLogos = $$('.logo--nav:not(.is-house), .logo--static');
navLogos.forEach(l => {
  const host = l.closest('a, .brand') || l;
  host.addEventListener('mouseenter', () => l.classList.add('is-house'));
  host.addEventListener('mouseleave', () => l.classList.remove('is-house'));
});
if (!reduced) {
  let on = false;
  setInterval(() => { on = !on; $$('.logo--nav:not(.is-house)').forEach(l => l.classList.toggle('is-house', on)); }, 3800);
}

/* ---------- Intro ---------- */
const intro = $('#intro'), logo = $('.logo--intro');
let introDone = false;
function endIntro() {
  if (introDone) return; introDone = true;
  intro.classList.add('is-out');
  document.body.classList.remove('is-loading');
  setTimeout(() => { intro.remove(); heroIn(); }, 1100);
  try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
}
function heroIn() { $$('.hero .reveal').forEach((el, i) => { el.style.setProperty('--d', i * .12 + 's'); el.classList.add('in'); }); }
let seen = false; try { seen = sessionStorage.getItem('introSeen') === '1'; } catch (e) {}
if (reduced || seen) {
  logo.classList.add('is-house'); intro.classList.add('show-word');
  setTimeout(endIntro, reduced ? 0 : 900);
} else {
  logo.classList.add('is-blank');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    logo.classList.remove('is-blank'); logo.classList.add('is-drawn');
  }));
  setTimeout(() => logo.classList.add('is-house'), 1700);       // H → casa
  setTimeout(() => intro.classList.add('show-word'), 2700);
  setTimeout(() => intro.classList.add('show-light'), 3400);    // luz acende na porta
  setTimeout(endIntro, 4300);
}
$('#skip').addEventListener('click', endIntro);

/* ---------- Imagens em falta: fallback elegante ---------- */
$$('.media').forEach(m => {
  const img = $('img', m); if (!img) return;
  const mark = () => m.classList.add('is-empty');
  img.addEventListener('error', mark);
  if (img.complete && img.naturalWidth === 0) mark();
});

/* ---------- Nav, parallax, botão flutuante ---------- */
const nav = $('#nav'), fab = $('#fab'), heroBg = $('.hero__bg');
function onScroll() {
  const y = scrollY;
  nav.classList.toggle('is-solid', y > 40);
  fab.classList.toggle('is-on', y > innerHeight * .8 && !contactVisible);
  if (!reduced && y < innerHeight * 1.2) heroBg.style.transform = `translate3d(0,${y * .25}px,0)`;
}
let contactVisible = false;
new IntersectionObserver(([e]) => { contactVisible = e.isIntersecting; onScroll(); }).observe($('#contacto'));
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* Menu mobile */
const burger = $('#burger'), menu = $('#menu');
const setMenu = open => { menu.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : ''; };
burger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
$$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));

/* ---------- Reveal + contadores ---------- */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
  const n = $('[data-count]', e.target); if (n) count(n);
}), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
$$('.reveal').forEach((el, i) => {
  if (el.closest('.hero')) return;                // o hero entra após o intro
  const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal')).indexOf(el);
  el.style.setProperty('--d', Math.min(sib, 5) * .08 + 's'); io.observe(el);
});
function count(el) {
  const end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now(), dur = 1400;
  (function step(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

/* ---------- Horários ---------- */
const tabs = $('#tabs'), sched = $('#schedule');
const days = Object.keys(SCHEDULE);
const todayIdx = (new Date().getDay() + 6) % 7;     // Seg = 0
function showDay(d) {
  $$('.tab', tabs).forEach(t => t.setAttribute('aria-selected', t.dataset.d === d));
  const list = SCHEDULE[d];
  sched.innerHTML = list.length
    ? list.map(([h, n, s, tag], i) => `<div class="slot" style="animation-delay:${i * .07}s"><time>${h}</time><div><h3>${n}</h3><small>${s}</small></div><span class="tag">${tag}</span></div>`).join('')
    : `<div class="slot slot--empty">Descanso. Recupera e volta na segunda.</div>`;
}
tabs.innerHTML = days.map(d => `<button class="tab" role="tab" data-d="${d}" aria-selected="false">${d}</button>`).join('');
tabs.addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) showDay(b.dataset.d); });
showDay(days[todayIdx]);

/* ---------- Lightbox ---------- */
const lb = $('#lightbox'), lbImg = $('#lbImg');
$('#gallery').addEventListener('click', e => {
  const g = e.target.closest('.g'); if (!g || g.classList.contains('is-empty')) return;
  lbImg.src = g.dataset.full; lbImg.alt = $('img', g).alt; lb.hidden = false;
});
const closeLb = () => (lb.hidden = true);
lb.addEventListener('click', e => { if (e.target !== lbImg) closeLb(); });
addEventListener('keydown', e => { if (e.key === 'Escape') { closeLb(); setMenu(false); } });

/* ---------- Contactos + formulário (WhatsApp) ---------- */
$$('[data-cfg]').forEach(el => { const k = el.dataset.cfg; if (CONFIG[k]) el.textContent = CONFIG[k]; });
$('#year').textContent = new Date().getFullYear();
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, msg = $('#formMsg');
  const nome = f.nome.value.trim(), tel = f.tel.value.trim();
  [f.nome, f.tel].forEach(i => i.classList.toggle('err', !i.value.trim()));
  if (!nome || !tel) { msg.textContent = 'Preenche o nome e o telemóvel.'; return; }
  const text = `Olá! Quero marcar uma aula experimental na The Home BJJ.\nNome: ${nome}\nTelemóvel: ${tel}\nPrograma: ${f.programa.value}` + (f.msg.value.trim() ? `\nMensagem: ${f.msg.value.trim()}` : '');
  open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  msg.textContent = 'A abrir o WhatsApp…';
});
