(function(){
  function $(sel){ return document.querySelector(sel); }
  function createQA(q, a){
    const wrap = document.createElement('article');
    wrap.className = 'faq-item';
    const h3 = document.createElement('h3'); h3.textContent = q;
    const p = document.createElement('p'); p.textContent = a;
    wrap.appendChild(h3); wrap.appendChild(p);
    return wrap;
  }
  function loadData(){
    try {
      const json = JSON.parse(document.getElementById('faq-data').textContent);
      return json.items || [];
    } catch(e){ return []; }
  }
  function renderNextChunk(){
    if (index >= data.length) return;
    loading.hidden = false;
    const end = Math.min(index + BATCH, data.length);
    for (let i=index; i<end; i++){
      list.appendChild(createQA(data[i].q, data[i].a));
    }
    index = end;
    loading.hidden = true;
  }

  const list = $('#faq-list');
  const loading = $('#faq-loading');
  const sentinel = $('#faq-sentinel');
  const data = loadData();
  let index = 0;
  const BATCH = 4;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        renderNextChunk();
      }
    })
  }, { rootMargin: '200px' });
  io.observe(sentinel);

  // initial
  renderNextChunk();
})();
