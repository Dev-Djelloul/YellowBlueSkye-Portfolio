document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  // Variables de configuration ajustables
  const scrollThresholdDown = 100; // Seuil pour cacher la navbar
  const scrollThresholdUp = 20; // Seuil pour montrer la navbar uniquement en haut de page
  const scrollDifferenceThreshold = 5; // Réduit pour détecter les défilements lents
  let scrollTimer = null; // Pour le délai avant réapparition
  let consecutiveDownScrolls = 0; // Compteur pour les défilements lents vers le bas
  let consecutiveUpScrolls = 0; // Compteur pour les défilements lents vers le haut
  
  // Fonction principale pour mettre à jour l'état de la navbar
  function updateNavbar() {
    const scrollY = window.scrollY;
    const scrollDifference = Math.abs(scrollY - lastScrollY);
    const isScrollingDown = scrollY > lastScrollY;
    
    // Ajouter la classe 'nav-scrolled' si on a défilé un peu
    if (scrollY > 20) {
      header.classList.add('nav-scrolled');
    } else {
      header.classList.remove('nav-scrolled');
    }
    
    // Gérer les compteurs de défilement consécutif dans la même direction
    if (isScrollingDown) {
      consecutiveDownScrolls++;
      consecutiveUpScrolls = 0;
    } else {
      consecutiveUpScrolls++;
      consecutiveDownScrolls = 0;
    }
    
    // Traitement des défilements significatifs OU des défilements lents mais continus
    if (scrollDifference > scrollDifferenceThreshold || consecutiveDownScrolls > 5 || consecutiveUpScrolls > 5) {
      // Défilement vers le bas = cacher la navbar
      if (isScrollingDown && scrollY > scrollThresholdDown) {
        // Annuler tout timer existant
        if (scrollTimer) clearTimeout(scrollTimer);
        header.classList.add('nav-hidden');
      } 
      // MODIFICATION ICI : Montrer la navbar UNIQUEMENT si on est proche du haut de page
      else if (!isScrollingDown && scrollY < scrollThresholdUp) {
        // Annuler tout timer existant
        if (scrollTimer) clearTimeout(scrollTimer);
        
        // Définir un nouveau timer pour un délai avant de montrer la navbar
        scrollTimer = setTimeout(() => {
          header.classList.remove('nav-hidden');
        }, 300); // Délai de 300ms
      }
      // Laisser la navbar cachée pour tous les autres cas de défilement vers le haut
    }
    
    lastScrollY = scrollY;
    ticking = false;
  }
  
  // Optimisation des performances avec requestAnimationFrame
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    // Réinitialiser le timeout à chaque événement de défilement
    clearTimeout(scrollTimeout);
    
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
    
    // Détection de fin de défilement
    scrollTimeout = setTimeout(() => {
      // Réinitialiser les compteurs quand le défilement s'arrête
      consecutiveDownScrolls = 0;
      consecutiveUpScrolls = 0;
    }, 150);
  }, { passive: true });
  
  // Ajuster le padding du body
  function updateBodyPadding() {
    const headerHeight = header.offsetHeight;
    document.body.style.paddingTop = headerHeight + 'px';
  }
  
  // Initialisation
  updateBodyPadding();
  
  // Recalculer en cas de redimensionnement
  window.addEventListener('resize', updateBodyPadding);
  
  // Forcer la visibilité au survol du haut de page après un délai
  let hoverTimer = null;
  document.addEventListener('mousemove', function(e) {
    if (e.clientY < 15 && header.classList.contains('nav-hidden')) {
      if (hoverTimer) clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        header.classList.remove('nav-hidden');
      }, 200); // Délai avant d'apparaître au survol
    }
  });
});