// Bold semester page links; collapse/expand persistence for course sections
(function () {
  var STORAGE_KEY = 'mkdocs-nav-expand';

  var saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {}

  function init() {
    // Bold semester page links (href contains /semesters/)
    document.querySelectorAll('.md-nav__link[href]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.indexOf('/semesters/') !== -1) {
        link.classList.add('md-nav__link--semester');
      }
    });

    // Persist collapse state for course section toggles
    document.querySelectorAll('.md-nav__toggle').forEach(function (toggle) {
      var li = toggle.closest('.md-nav__item--nested');
      if (!li) return;
      var label = li.querySelector('.md-nav__link');
      if (!label) return;
      var key = label.textContent.trim();

      if (key in saved) {
        toggle.checked = saved[key];
      }

      toggle.addEventListener('change', function () {
        saved[key] = toggle.checked;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        } catch (e) {}
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
