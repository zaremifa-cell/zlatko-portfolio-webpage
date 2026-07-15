const menuToggle = document.querySelector('.menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');
const menuDialog = document.querySelector('.menu-dialog');
const menuClose = document.querySelector('.menu-close');
const menuSearch = document.querySelector('.menu-search');
const menuItems = [...document.querySelectorAll('.menu-item')];
const menuEmpty = document.querySelector('.menu-empty');

function filterMenu(query) {
  const value = query.trim().toLowerCase();
  let visible = 0;
  menuItems.forEach((item) => {
    const match = item.dataset.menuLabel.includes(value);
    item.hidden = !match;
    if (match) visible += 1;
  });
  menuEmpty.classList.toggle('is-visible', visible === 0);
}

function setMenuOpen(open) {
  document.body.classList.toggle('menu-open', open);
  menuOverlay.classList.toggle('is-open', open);
  menuOverlay.setAttribute('aria-hidden', String(!open));
  menuToggle.setAttribute('aria-expanded', String(open));
  if (open) window.setTimeout(() => menuSearch.focus(), 300);
  else { menuSearch.value = ''; filterMenu(''); menuToggle.focus(); }
}

menuToggle.addEventListener('click', () => setMenuOpen(true));
menuClose.addEventListener('click', () => setMenuOpen(false));
menuSearch.addEventListener('input', (event) => filterMenu(event.target.value));
menuOverlay.addEventListener('click', (event) => { if (!menuDialog.contains(event.target)) setMenuOpen(false); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menuOverlay.classList.contains('is-open')) setMenuOpen(false); });
