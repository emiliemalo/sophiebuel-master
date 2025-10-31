document.addEventListener("DOMContentLoaded", () => {
  const GALLERY_DIV = document.querySelector(".gallery");
  const FILTER_DIV = document.querySelector(".filter");
  const BASE_URL = "http://localhost:5678/api/";
  const WORKS_API = BASE_URL + "works";
  let workList = [];

  // Charger les projets depuis l'API
  async function fetchWorks() {
    try {
      const response = await fetch(WORKS_API);
      workList = await response.json();
      displayWorks(workList);
      createFilters();
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error);
      // Utiliser les données locales en cas d'erreur
      workList = getLocalWorksFromAssets();
      displayWorks(workList);
      createFilters();
    }
  }

  // Afficher des projets dans la galerie
  function displayWorks(works) {
    GALLERY_DIV.innerHTML = ""; 
    works.forEach((work) => {
      const figure = document.createElement("figure");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;
      img.setAttribute("data-id", work.id);
      img.loading = "lazy";
      
      const caption = document.createElement("figcaption");
      caption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(caption);
      GALLERY_DIV.appendChild(figure);
    });
  }

  // Création des filtres
  function createFilters() {
    // Récupérer toutes les catégories uniques
    const categories = new Set(workList.map(work => work.category));
    
    // Créer le bouton "Tous"
    const allButton = document.createElement("a");
    allButton.classList.add("category");
    allButton.id = "category0";
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => filterWorks(0));
    FILTER_DIV.appendChild(allButton);
    
    // Ajouter la classe selected au bouton "Tous" par défaut
    addSelectedClass(0);

    // Créer les autres boutons de filtres
    categories.forEach(category => {
      if (category && category.id) {
        const filterButton = document.createElement("a");
        filterButton.classList.add("category");
        filterButton.id = `category${category.id}`;
        filterButton.textContent = category.name;
        filterButton.addEventListener("click", () => filterWorks(category.id));
        FILTER_DIV.appendChild(filterButton);
      }
    });
  }

  // Filtrer les projets
  function filterWorks(categoryId) {
    removeSelectedClass();
    addSelectedClass(categoryId);

    const filteredWorks = categoryId === 0 
      ? workList 
      : workList.filter(work => work.categoryId === categoryId);
    
    displayWorks(filteredWorks);
  }

  // Gestion de la classe selected
  function addSelectedClass(categoryId) {
    const button = document.getElementById(`category${categoryId}`);
    if (button) button.classList.add("selected");
  }

  function removeSelectedClass() {
    const filters = document.querySelectorAll(".category");
    filters.forEach(filter => filter.classList.remove("selected"));
  }

  // Fonctions pour la gestion de la galerie
  window.ajouterProjetDansGalerie = function(projet) {
    if (!projet || !projet.imageUrl) return;
    workList.push(projet);
    displayWorks(workList);
  };

  window.supprimerProjetDansGalerie = function(id) {
    workList = workList.filter(work => work.id !== id);
    displayWorks(workList);
  };

  // Initialisation
  fetchWorks();
});