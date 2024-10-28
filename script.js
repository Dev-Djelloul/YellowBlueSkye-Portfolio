const carousel = document.querySelector(".project-carousel");
const projects = document.querySelectorAll(".project-item");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const pauseButton = document.querySelector(".pause");

let currentIndex = 0;
let intervalId;

// Fonction pour afficher le projet actuel
function showProject(index) {
  const totalProjects = projects.length;
  currentIndex = (index + totalProjects) % totalProjects; // Boucle autour des projets
  const offset = -currentIndex * 100; // Calcule le décalage
  carousel.style.transform = `translateX(${offset}%)`;
}

// Fonction pour passer au projet suivant
function nextProject() {
  showProject(currentIndex + 1);
}

// Fonction pour passer au projet précédent
function prevProject() {
  showProject(currentIndex - 1);
}

// Fonction pour démarrer le défilement automatique
function startAutoScroll() {
  if (!intervalId) {
    // Ne pas démarrer si déjà en cours
    intervalId = setInterval(nextProject, 6000); // Change de projet toutes les 8 secondes
  }
}

// Fonction pour arrêter le défilement automatique
function pauseAutoScroll() {
  clearInterval(intervalId);
  intervalId = null; // Réinitialiser intervalId
}

// Événements pour les boutons
nextButton.addEventListener("click", nextProject);
prevButton.addEventListener("click", prevProject);
pauseButton.addEventListener("click", () => {
  if (intervalId) {
    pauseAutoScroll();
    pauseButton.innerHTML = "&#9654;"; // Mettre à jour le texte pour 'play'
  } else {
    startAutoScroll();
    pauseButton.innerHTML = "&#10074;&#10074;"; // Mettre à jour le texte pour 'pause'
  }
});

// Démarrer le défilement automatique au chargement
startAutoScroll();

// Écouteur d'événement pour les touches du clavier
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    // Flèche droite
    nextProject();
  } else if (event.key === "ArrowLeft") {
    // Flèche gauche
    prevProject();
  } else if (event.key === " ") {
    // Barre d'espace
    event.preventDefault(); // Empêcher le défilement de la page
    if (intervalId) {
      pauseAutoScroll();
      pauseButton.innerHTML = "&#9654;"; // Mettre à jour le texte pour 'play'
    } else {
      startAutoScroll();
      pauseButton.innerHTML = "&#10074;&#10074;"; // Mettre à jour le texte pour 'pause'
    }
  }
});

// Bouton de retour en haut
const backToTopButton = document.getElementById("backToTop");

// Affiche le bouton de retour en haut lorsque l'utilisateur défile
window.addEventListener("scroll", function () {
  if (window.scrollY > 200) {
    backToTopButton.classList.add("show-back-to-top");
  } else {
    backToTopButton.classList.remove("show-back-to-top");
  }
});

// Remonte la page lorsque l'utilisateur clique sur le bouton de retour en haut
backToTopButton.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
