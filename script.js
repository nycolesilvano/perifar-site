const PRODUCTS = [
  { n: 'Jaqueta Bomber Perifar', c: 'agasalhos', d: 'Nylon com forro e bordado no peito.', p: 389.9 },
  { n: 'Camiseta Oversized Quebrada', c: 'camisetas', d: 'Algodão 100% com estampa serigrafada.', p: 119.9 },
  { n: 'Calça Cargo Corre', c: 'calcas', d: 'Sarja com bolsos laterais e barra ajustável.', p: 259.9 },
  { n: 'Moletom Capuz Concreto', c: 'agasalhos', d: 'Felpado, corte amplo, cor grafite.', p: 249.9 },
  { n: 'Boné Five Panel', c: 'acessorios', d: 'Aba curva e regulagem metálica.', p: 89.9 },
  { n: 'Bolsa Transversal Rua', c: 'acessorios', d: 'Resistente à água, três bolsos.', p: 139.9 },
  { n: 'Camiseta Gráfica Vermelha', c: 'camisetas', d: 'Modelagem reta com gola reforçada.', p: 109.9 },
  { n: 'Calça Jogger Bairro', c: 'calcas', d: 'Moletom leve com punho elástico.', p: 189.9 }
];

const CATS = { camisetas: 'Camisetas', agasalhos: 'Agasalhos', calcas: 'Calças', acessorios: 'Acessórios' };
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const $ = id => document.getElementById(id);
const grid = $('grid');

grid.innerHTML = PRODUCTS.map((p, i) => `<article class="card" data-c="${p.c}">
  <div class="ph" role="img" aria-label="Espaço reservado para foto">FOTO DA PEÇA</div>
  <div class="body"><span class="cat">${CATS[p.c]}</span><h3>${p.n}</h3><p>${p.d}</p>
  <div class="price">${brl(p.p)}</div>
  <button class="btn alt add" type="button" data-i="${i}">Adicionar à sacola</button></div></article>`).join('');

let t; const toast = m => { const e = $('toast'); e.textContent = m; e.classList.add('show'); clearTimeout(t); t = setTimeout(() => e.classList.remove('show'), 2200) };

/* ===== Sacola ===== */
const cart = []; // { i: índice do produto, q: quantidade }
const drawer = $('drawer'), overlay = $('overlay');

function openCart() { drawer.classList.add('open'); overlay.classList.add('show'); document.body.style.overflow = 'hidden'; $('close').focus() }
function closeCart() { drawer.classList.remove('open'); overlay.classList.remove('show'); document.body.style.overflow = ''; $('cart').focus() }

function renderCart() {
  const n = cart.reduce((s, x) => s + x.q, 0);
  const total = cart.reduce((s, x) => s + x.q * PRODUCTS[x.i].p, 0);
  $('count').textContent = n;
  $('total').textContent = brl(total);
  $('empty').hidden = n > 0;
  drawer.classList.toggle('has-items', n > 0);
  $('items').innerHTML = cart.map(x => {
    const p = PRODUCTS[x.i]; return `<li class="ci">
    <div class="ci-ph" aria-hidden="true"></div>
    <div class="ci-info">
      <h4>${p.n}</h4><span class="cat">${CATS[p.c]}</span><span class="ci-price">${brl(p.p * x.q)}</span>
      <div class="qty">
        <button type="button" data-a="dec" data-i="${x.i}" aria-label="Diminuir quantidade">−</button>
        <output>${x.q}</output>
        <button type="button" data-a="inc" data-i="${x.i}" aria-label="Aumentar quantidade">+</button>
      </div>
    </div>
    <button class="ci-rm" type="button" data-a="rm" data-i="${x.i}" aria-label="Remover ${p.n}">Remover</button>
  </li>`}).join('');
}

function addToCart(i) { const f = cart.find(x => x.i === i); f ? f.q++ : cart.push({ i, q: 1 }); renderCart() }

grid.addEventListener('click', e => { const b = e.target.closest('.add'); if (!b) return; addToCart(+b.dataset.i); toast(PRODUCTS[b.dataset.i].n + ' adicionada à sacola') });

$('items').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const i = +b.dataset.i, a = b.dataset.a, f = cart.find(x => x.i === i);
  if (a === 'inc') f.q++;
  if (a === 'dec' && --f.q < 1) cart.splice(cart.indexOf(f), 1);
  if (a === 'rm') cart.splice(cart.indexOf(f), 1);
  renderCart();
  const again = $('items').querySelector(`[data-a="${a}"][data-i="${i}"]`);
  if (again) again.focus();
});

$('cart').addEventListener('click', openCart);
$('close').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
$('clear').addEventListener('click', () => { cart.length = 0; renderCart() });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeCart() });
renderCart();

document.querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b));
  grid.querySelectorAll('.card').forEach(c => c.hidden = !(b.dataset.f === 'todos' || c.dataset.c === b.dataset.f));
}));

const burger = $('burger'), menu = $('menu');
burger.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o) });
menu.addEventListener('click', e => { if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false) } });

const target = new Date('2026-12-05T14:00:00-03:00');
function tick() {
  let s = Math.max(0, Math.floor((target - new Date()) / 1000));
  const p = n => String(n).padStart(2, '0');
  $('d').textContent = Math.floor(s / 86400); $('h').textContent = p(Math.floor(s % 86400 / 3600));
  $('m').textContent = p(Math.floor(s % 3600 / 60)); $('s').textContent = p(s % 60)
}
tick(); setInterval(tick, 1000);

$('form').addEventListener('submit', e => {
  e.preventDefault(); const v = $('email').value.trim();
  $('msg').textContent = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? 'E-mail cadastrado. Obrigado por acompanhar a Perifar.' : 'Digite um e-mail válido, como nome@dominio.com.';
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) $('email').value = ''
});
$('year').textContent = new Date().getFullYear();
