// I know, it's not great, but I had to urgently refactor it into a simpler HTML and CSS page, so I wasn't too concerned about perfection.

(() => {
  let isMobileView = window.innerWidth <= 768;

  function checkMobileView() {
    isMobileView = window.innerWidth <= 768;
  }

  function setupMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('main');

    menuToggle.addEventListener('click', function() {
      if (isMobileView) {
        sidebar.classList.toggle('show');
      }
    });


    main.addEventListener('click', function(e) {
      if (isMobileView && sidebar.classList.contains('show') && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('show');
      }
    });
  }

  setupMenuToggle();

  window.addEventListener('resize', function() {
    checkMobileView();
    if (!isMobileView) {
      document.getElementById('sidebar').classList.remove('show');
    }
  });

})();
