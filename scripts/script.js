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
    intervalId = setInterval(nextProject, 2500); // Change de projet toutes les 2,5 secondes
  }
}

// Fonction pour arrêter le défilement automatique
function pauseAutoScroll() {
  clearInterval(intervalId);
  intervalId = null; // Réinitialiser intervalId
}

// Événements pour les boutons de navigation
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

// Écouteur d'événement sur chaque projet pour permettre de cliquer n'importe où
projects.forEach(project => {
  const projectWrapper = project.querySelector('.project-item-wrapper');
  projectWrapper.addEventListener("click", () => {
    if (intervalId) {
      pauseAutoScroll();
      pauseButton.innerHTML = "&#9654;"; // Mettre à jour le texte pour 'play'
    } else {
      startAutoScroll();
      pauseButton.innerHTML = "&#10074;&#10074;"; // Mettre à jour le texte pour 'pause'
    }
  });
});

// Démarrer le défilement automatique au chargement
startAutoScroll();
showProject(currentIndex); // Afficher le premier projet

// Écouteur d'événement pour les touches du clavier
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    nextProject();
  } else if (event.key === "ArrowLeft") {
    prevProject();
  } else if (event.key === " ") {
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

window.addEventListener("scroll", function () {
  if (window.scrollY > 200) {
    backToTopButton.classList.add("show-back-to-top");
  } else {
    backToTopButton.classList.remove("show-back-to-top");
  }
});

backToTopButton.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
