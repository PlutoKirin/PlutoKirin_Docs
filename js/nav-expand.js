// Expand semester-level sections by default, with localStorage persistence
(function () {
  var STORAGE_KEY = 'mkdocs-nav-expand';
  var semesterPattern = /^\d{2}-\d{2}(春|夏|秋冬|春夏)$/;

  // Load saved toggle states
  var saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {}

  // Apply saved/initial state and listen for changes
  function initToggles() {
    var toggles = document.querySelectorAll('.md-nav__toggle');
    var stateChanged = false;

    toggles.forEach(function (toggle) {
      var label = toggle.closest('.md-nav__item--nested');
      if (!label) return;
      var link = label.querySelector('.md-nav__link');
      if (!link) return;
      var key = link.textContent.trim();

      // Determine initial state: saved > semester default > collapsed
      if (key in saved) {
        toggle.checked = saved[key];
      } else if (semesterPattern.test(key)) {
        toggle.checked = true;
        saved[key] = true;
        stateChanged = true;
      }

      // Persist changes on user interaction
      toggle.addEventListener('change', function () {
        saved[key] = toggle.checked;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        } catch (e) {}
      });
    });

    // Save defaults if we set any
    if (stateChanged) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggles);
  } else {
    initToggles();
  }
})();
