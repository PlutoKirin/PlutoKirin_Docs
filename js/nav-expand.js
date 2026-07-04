// Expand semester-level sections by default, with localStorage persistence
// Also marks semester nav items as non-clickable toggles
(function () {
  var STORAGE_KEY = 'mkdocs-nav-expand';
  var semesterPattern = /^\d{2}-\d{2}(春|夏|秋冬|春夏)$/;

  var saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {}

  function initToggles() {
    var toggles = document.querySelectorAll('.md-nav__toggle');
    var stateChanged = false;

    toggles.forEach(function (toggle) {
      var li = toggle.closest('.md-nav__item--nested');
      if (!li) return;
      var label = li.querySelector('.md-nav__link');
      if (!label) return;
      var key = label.textContent.trim();
      var isSemester = semesterPattern.test(key);

      // Mark semester sections for CSS styling
      if (isSemester) {
        li.classList.add('md-nav__item--semester');
      }

      // Determine initial state: saved > semester default > collapsed
      if (key in saved) {
        toggle.checked = saved[key];
      } else if (isSemester) {
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
