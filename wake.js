// The backend demos run on free hosting that sleeps when idle.
// Opening the portfolio wakes them, so they are ready by the time a visitor clicks a demo link.
(() => {
  const DEMOS = {
    'trustpay-demo.vercel.app': 'https://trustpay-demo.vercel.app/actuator/health',
    'boomerang-returns.onrender.com': 'https://boomerang-returns.onrender.com/up',
    'stockroom-w30t.onrender.com': 'https://stockroom-w30t.onrender.com/up',
    'pulse-qrke.onrender.com': 'https://pulse-qrke.onrender.com/api/incidents',
  };
  const AWAKE_FOR = 10 * 60 * 1000; // hosts sleep after about 15 idle minutes
  const TEXT = {
    waking: 'Waking the demo server — first launch can take up to a minute',
    ready: 'Demo server is awake — opens right away',
    unknown: 'First launch can take up to a minute while the server wakes up',
  };

  const store = {
    get(host) {
      try { return Number(sessionStorage.getItem(`wake:${host}`)) || 0; } catch { return 0; }
    },
    set(host) {
      try { sessionStorage.setItem(`wake:${host}`, String(Date.now())); } catch { /* private mode */ }
    },
  };

  const notes = {};
  const setState = (host, state) => {
    (notes[host] || []).forEach((note) => {
      note.dataset.state = state;
      note.textContent = TEXT[state];
    });
  };

  // One note per group of links that leads to a sleeping demo.
  document.querySelectorAll('a[href]').forEach((link) => {
    let host = '';
    try { host = new URL(link.href).host; } catch { return; }
    if (!DEMOS[host] || !link.closest('.work-links, .project-hero, .case-content')) return;

    let last = link;
    while (last.nextElementSibling && last.nextElementSibling.matches('a')) last = last.nextElementSibling;
    if (last.nextElementSibling && last.nextElementSibling.matches('.demo-note')) return;

    const note = document.createElement('small');
    note.className = 'demo-note';
    (link.closest('.work-links') ? link : last).after(note);
    (notes[host] = notes[host] || []).push(note);
  });

  Object.entries(DEMOS).forEach(([host, url]) => {
    if (Date.now() - store.get(host) < AWAKE_FOR) {
      setState(host, 'ready');
      return;
    }
    setState(host, 'waking');
    // "no-cors": the reply is opaque, but it only arrives once the server is up.
    fetch(url, { mode: 'no-cors', cache: 'no-store', credentials: 'omit' })
      .then(() => { store.set(host); setState(host, 'ready'); })
      .catch(() => setState(host, 'unknown'));
  });
})();
