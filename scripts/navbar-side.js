document.addEventListener('DOMContentLoaded', function() {
  // Éléments du menu hamburger
  const hamburger = document.getElementById('hamburger');
  const sidebarMenu = document.getElementById('sidebar-menu');
  const closeMenu = document.getElementById('close-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  
  // Fonction pour ouvrir le menu
  function openMenu() {
    sidebarMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Empêcher le défilement
  }
  
  // Fonction pour fermer le menu
  function closeMenuFunction() {
    sidebarMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Réactiver le défilement
  }
  
  // Événements pour le menu
  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeMenu) closeMenu.addEventListener('click', closeMenuFunction);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenuFunction);
  
  // Fermer le menu quand on clique sur un lien
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenuFunction);
  });
  
  // Fermer le menu avec Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebarMenu && sidebarMenu.classList.contains('active')) {
      closeMenuFunction();
    }
  });
  
  // Demo du changement de thème
  const themeToggle = document.querySelector('.theme-toggle button');
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    
    // Changer l'icône
    const icon = themeToggle.querySelector('i');
    if (icon.classList.contains('fa-moon')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  });
  
  // =========== AJOUT DE LA LOGIQUE DE SCROLL POUR HEADER ===========
  
  const header = document.querySelector('header');
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  // Variables de configuration
  const scrollThresholdDown = 100;
  const scrollThresholdUp = 20;
  const scrollDifferenceThreshold = 5;
  let scrollTimer = null;
  let consecutiveDownScrolls = 0;
  let consecutiveUpScrolls = 0;
  
  // Fonction pour mettre à jour l'état de la navbar
  function updateNavbar() {
    const scrollY = window.scrollY;
    const scrollDifference = Math.abs(scrollY - lastScrollY);
    const isScrollingDown = scrollY > lastScrollY;
    
    // Classe 'nav-scrolled' si on a défilé un peu
    if (scrollY > 20) {
      header.classList.add('nav-scrolled');
    } else {
      header.classList.remove('nav-scrolled');
    }
    
    // Compteurs de défilement consécutif
    if (isScrollingDown) {
      consecutiveDownScrolls++;
      consecutiveUpScrolls = 0;
    } else {
      consecutiveUpScrolls++;
      consecutiveDownScrolls = 0;
    }
    
    // Traitement des défilements
    if (scrollDifference > scrollDifferenceThreshold || consecutiveDownScrolls > 5 || consecutiveUpScrolls > 5) {
      // Défilement vers le bas = cacher la navbar
      if (isScrollingDown && scrollY > scrollThresholdDown) {
        if (scrollTimer) clearTimeout(scrollTimer);
        header.classList.add('nav-hidden');
      } 
      // Défilement vers le haut proche du haut = montrer la navbar
      else if (!isScrollingDown && scrollY < scrollThresholdUp) {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          header.classList.remove('nav-hidden');
        }, 300);
      }
    }
    
    lastScrollY = scrollY;
    ticking = false;
  }
  
  // Gestion du scroll avec optimisation performance
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
    
    // Réinitialiser le timeout à chaque événement
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      consecutiveDownScrolls = 0;
      consecutiveUpScrolls = 0;
    }, 150);
  }, { passive: true });
  
  // Ajustement du padding body
  function updateBodyPadding() {
    const headerHeight = header.offsetHeight;
    document.body.style.paddingTop = headerHeight + 'px';
  }
  
  // Initialisation du padding
  updateBodyPadding();
  window.addEventListener('resize', updateBodyPadding);
  
  // Réapparition au survol du haut de page
  let hoverTimer = null;
  document.addEventListener('mousemove', function(e) {
    if (e.clientY < 15 && header.classList.contains('nav-hidden')) {
      if (hoverTimer) clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        header.classList.remove('nav-hidden');
      }, 200);
    }
  });
});