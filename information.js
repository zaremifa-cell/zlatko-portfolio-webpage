const menuToggle = document.querySelector('.menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');
const menuDialog = document.querySelector('.menu-dialog');
const menuClose = document.querySelector('.menu-close');
const menuSearch = document.querySelector('.menu-search');
const menuItems = [...document.querySelectorAll('.menu-item')];
const menuEmpty = document.querySelector('.menu-empty');

function filterMenu(query) {
  const normalizedQuery = query.trim().toLowerCase();
  let visibleItems = 0;

  menuItems.forEach((item) => {
    const isMatch = item.dataset.menuLabel.includes(normalizedQuery);
    item.hidden = !isMatch;
    if (isMatch) visibleItems += 1;
  });

  menuEmpty.classList.toggle('is-visible', visibleItems === 0);
}

function setMenuOpen(isOpen) {
  document.body.classList.toggle('menu-open', isOpen);
  menuOverlay.classList.toggle('is-open', isOpen);
  menuOverlay.setAttribute('aria-hidden', String(!isOpen));
  menuToggle.setAttribute('aria-expanded', String(isOpen));

  if (isOpen) {
    window.setTimeout(() => menuSearch.focus(), 500);
    return;
  }

  menuSearch.value = '';
  filterMenu('');
  menuToggle.focus();
}

menuToggle.addEventListener('click', () => setMenuOpen(true));
menuClose.addEventListener('click', () => setMenuOpen(false));
menuSearch.addEventListener('input', (event) => filterMenu(event.target.value));

menuOverlay.addEventListener('click', (event) => {
  if (!menuDialog.contains(event.target)) setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuOverlay.classList.contains('is-open')) {
    setMenuOpen(false);
  }
});
