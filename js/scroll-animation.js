document.addEventListener('DOMContentLoaded', function() {
  // Options pour l'Intersection Observer
  const options = {
    root: null, // Viewport
    rootMargin: '0px',
    threshold: 0.15 // Déclenche lorsque 15% de l'élément est visible
  };

  // Callback pour l'Intersection Observer
  const callback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Arrête d'observer l'élément une fois animé
      }
    });
  };

  // Crée l'observer
  const observer = new IntersectionObserver(callback, options);

  // Observe tous les éléments avec la classe project-card
  document.querySelectorAll('.project-card').forEach(project => {
    observer.observe(project);
  });
});