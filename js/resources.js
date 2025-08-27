(function() {
  const listEl = document.getElementById('resources-list');
  const loadingEl = document.getElementById('loading');
  const sentinel = document.getElementById('sentinel');
  const filters = document.getElementById('resource-filters');

  let page = 0;
  const pageSize = 9;
  let allItems = [];
  let activeFilter = 'all';
  let loading = false;
  let done = false;

  function renderCard(item) {
    const card = document.createElement('article');
    card.className = 'resource-card';
    card.innerHTML = `
      <div class="type">${item.type}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      <a class="read-more" href="${item.url}" target="_blank" rel="noopener noreferrer">Open in new tab →</a>
    `;
    return card;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
  }

  function applyFilter(items, filter) {
    if (filter === 'all') return items;
    return items.filter(i => i.type === filter);
  }

  function showLoading(show) {
    loadingEl.hidden = !show;
  }

  async function loadData() {
    if (allItems.length) return allItems;
    const res = await fetch('resources.json');
    if (!res.ok) throw new Error('Failed to load resources.json');
    const data = await res.json();
    allItems = data.items || [];
    return allItems;
  }

  function nextPageItems() {
    const filtered = applyFilter(allItems, activeFilter);
    const start = page * pageSize;
    const slice = filtered.slice(start, start + pageSize);
    page += 1;
    if (start + slice.length >= filtered.length) done = true;
    return slice;
  }

  async function loadMore() {
    if (loading || done) return;
    loading = true;
    showLoading(true);
    try {
      await loadData();
      const items = nextPageItems();
      for (const item of items) listEl.appendChild(renderCard(item));
    } catch (e) {
      console.error(e);
    } finally {
      showLoading(false);
      loading = false;
    }
  }

  function resetAndRender() {
    page = 0;
    done = false;
    listEl.innerHTML = '';
    loadMore();
  }

  // Filters
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    [...filters.querySelectorAll('.chip')].forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
    activeFilter = btn.dataset.filter;
    resetAndRender();
  });

  // Infinite scroll via IntersectionObserver
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) loadMore();
    });
  }, { rootMargin: '600px 0px' });
  io.observe(sentinel);

  // Initial render
  loadMore();
})();
