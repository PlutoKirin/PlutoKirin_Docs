// Inject busuanzi page view counters at the bottom of each page
// Busuanzi script is loaded dynamically after DOM elements are in place
(function () {
  function injectCounters() {
    var article = document.querySelector('.md-content__inner');
    if (!article) return;
    if (document.getElementById('busuanzi_container_page_pv')) return;

    var wrapper = document.createElement('div');
    wrapper.style.cssText =
      'margin-top:2rem;padding-top:1rem;border-top:1px solid var(--md-default-fg-color--lightest);text-align:center';

    var path = window.location.pathname;
    var isHome =
      path === '/' || /\/PlutoKirin_Docs\/?(index\.html)?$/.test(path);

    if (isHome) {
      var siteSpan = document.createElement('span');
      siteSpan.id = 'busuanzi_container_site_pv';
      siteSpan.style.cssText =
        'font-size:0.7rem;color:var(--md-default-fg-color--lighter)';
      siteSpan.innerHTML =
        'This site has been visited <span id="busuanzi_value_site_pv"></span> times';
      wrapper.appendChild(siteSpan);

      var sep = document.createElement('span');
      sep.style.cssText =
        'margin:0 0.5em;font-size:0.7rem;color:var(--md-default-fg-color--lighter)';
      sep.textContent = '|';
      wrapper.appendChild(sep);
    }

    var pageSpan = document.createElement('span');
    pageSpan.id = 'busuanzi_container_page_pv';
    pageSpan.style.cssText =
      'font-size:0.7rem;color:var(--md-default-fg-color--lighter)';
    pageSpan.innerHTML =
      'This page has been viewed <span id="busuanzi_value_page_pv"></span> times';
    wrapper.appendChild(pageSpan);

    article.appendChild(wrapper);

    // Load busuanzi after elements exist
    var script = document.createElement('script');
    script.async = true;
    script.src =
      'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCounters);
  } else {
    injectCounters();
  }
})();
