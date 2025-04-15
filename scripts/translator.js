/**
 * Script de traduction pour le site YellowBlueSkye
 * Version corrigée pour éviter les redirections
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log("Translator script initialized");
  
  // Configuration de la langue
  let currentLanguage = localStorage.getItem('language') || 'fr';
  let translations = {};

  // Éléments DOM pour les boutons de langue
  const switchToEN = document.getElementById('switch-to-en');
  const switchToFR = document.getElementById('switch-to-fr');
  
  // Fonction pour mettre à jour l'affichage des boutons de langue
  function updateLanguageButtons() {
    if (currentLanguage === 'fr') {
      switchToEN.style.display = 'block';
      switchToFR.style.display = 'none';
    } else {
      switchToEN.style.display = 'none';
      switchToFR.style.display = 'block';
    }
  }

  // Fonction pour obtenir la valeur depuis un objet imbriqué via une chaîne de clés
  function getNestedTranslation(obj, path) {
    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] ? prev[curr] : null;
    }, obj);
  }

  // Fonction de traduction
  function translatePage() {
    console.log("Translating page to: " + currentLanguage);
    
    const elements = document.querySelectorAll('[data-i18n]');
    console.log("Found " + elements.length + " elements to translate");

    // Ajouter ces lignes dans la fonction translatePage() juste après console.log("Found " + elements.length + " elements to translate");

    // Traitement spécial pour les titres h1 et h2
    const headings = document.querySelectorAll('h1[data-i18n], h2[data-i18n]');
    console.log("Found " + headings.length + " headings to translate specifically");

    // Log pour déboguer les clés des titres
    headings.forEach(heading => {
      const key = heading.getAttribute('data-i18n');
      console.log("Heading key: " + key);
      const translation = getNestedTranslation(translations, key);
      console.log("Translation found for heading: ", translation);
      
      // Forcer la traduction des titres
      if (translation) {
        heading.innerHTML = translation; // Utiliser innerHTML au cas où le titre contient des balises HTML
      }
    });
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = getNestedTranslation(translations, key);
      
      if (translation) {
        // Si l'élément est un input avec placeholder
        if (element.placeholder !== undefined) {
          element.placeholder = translation;
        }
        // Si l'élément est un input avec value
        else if (element.value !== undefined && element.tagName.toLowerCase() === 'input' && element.type !== 'password') {
          if (element.type === 'submit' || element.type === 'button') {
            element.value = translation;
          }
        }
        // Si l'élément a des attributs title ou alt
        else if (element.title !== undefined && key.includes('title')) {
          element.title = translation;
        }
        else if (element.alt !== undefined && key.includes('alt')) {
          element.alt = translation;
        }
        // Pour les méta tags
        else if (element.tagName.toLowerCase() === 'meta' && element.name === 'description') {
          element.content = translation;
        }
        // Pour le titre de la page
        else if (element.tagName.toLowerCase() === 'title') {
          document.title = translation;
        }
        // Pour tous les autres éléments
        else {
          element.textContent = translation;
        }
      } else {
        console.warn("No translation found for key: " + key);
      }
    });

    // Ajoutez ce code à la fin de la fonction translatePage(), juste avant la mise à jour de l'attribut lang

    // Traitement spécial pour le titre des compétences qui ne se traduit pas
    const skillsTitle = document.getElementById('skills-title');
    if (skillsTitle) {
      const key = skillsTitle.getAttribute('data-i18n');
      const translation = getNestedTranslation(translations, key);
      console.log("Forcing translation for skills title:", key, translation);
      if (translation) {
        // Forcer la traduction après un court délai
        setTimeout(() => {
          skillsTitle.textContent = translation;
          console.log("Skills title translated to:", translation);
        }, 10);
      }
    }

    // Mettre à jour l'attribut lang de l'élément HTML
    document.documentElement.lang = currentLanguage;

    // Mettre à jour les boutons de langue
    updateLanguageButtons();

    // Sauvegarder la préférence dans localStorage
    localStorage.setItem('language', currentLanguage);
    
    // Réinitialiser les animations AOS après traduction
    if (typeof AOS !== 'undefined') {
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }

    // Déclencher un événement personnalisé pour informer d'autres scripts de la traduction
    document.dispatchEvent(new CustomEvent('translationCompleted', { 
      detail: { language: currentLanguage }
    }));
  }

  // Fonction pour charger les traductions
  async function loadTranslations(lang) {
    try {
      console.log("Loading translations for: " + lang);
      const response = await fetch(`translations/${lang}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      translations = await response.json();
      console.log("Translations loaded successfully");
      translatePage();
    } catch (error) {
      console.error(`Error loading translations: ${error}`);
      // Fallback: if file not found, try relative path
      try {
        const fallbackResponse = await fetch(`../translations/${lang}.json`);
        if (!fallbackResponse.ok) {
          throw new Error(`HTTP error: ${fallbackResponse.status}`);
        }
        translations = await fallbackResponse.json();
        translatePage();
      } catch (fallbackError) {
        console.error(`Fallback error loading translations: ${fallbackError}`);
      }
    }
  }

  // Événements pour les boutons de langue
  if (switchToEN) {
    console.log("Adding event listener to English button");
    switchToEN.addEventListener('click', function(e) {
      console.log("English button clicked");
      if (e.preventDefault) e.preventDefault();
      currentLanguage = 'en';
      loadTranslations(currentLanguage);
      return false; // Pour s'assurer qu'il n'y a pas de redirection
    });
  } else {
    console.warn("English language button not found");
  }

  if (switchToFR) {
    console.log("Adding event listener to French button");
    switchToFR.addEventListener('click', function(e) {
      console.log("French button clicked");
      if (e.preventDefault) e.preventDefault();
      currentLanguage = 'fr';
      loadTranslations(currentLanguage);
      return false; // Pour s'assurer qu'il n'y a pas de redirection
    });
  } else {
    console.warn("French language button not found");
  }

  // Initialisation - charger les traductions pour la langue actuelle
  console.log("Initial loading of translations");
  loadTranslations(currentLanguage);
});