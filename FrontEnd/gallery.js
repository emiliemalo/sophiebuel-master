//CONSTANTES
const BASE_URL = "http://localhost:5678/api/"
const WORKS_API = BASE_URL+"works";
const CATEGORY_API = BASE_URL+"categories";
const GALLERY_DIV = document.querySelector(".gallery");
const FILTER_DIV = document.querySelector(".filter");
 
//AFFICHE LES TRAVAUX DANS LA GALERIE
fetchWorks(GALLERY_DIV,false);

//RAFRAICHIT LES TRAVAUX
function refreshWorks(targetDiv, deleteButton){
    targetDiv.innerHTML='';
    fetchWorks(targetDiv,deleteButton);
}

//RECUPERATION DES TRAVAUX
function fetchWorks(targetDiv, deleteButton){
    //CREATION DU FETCH POUR IMPORTER LES TRAVAUX
    fetch (WORKS_API)
        .then (reponse => reponse.json())
        .then (works => { 
            workList=works //STOCKAGE DES TRAVAUX DANS VARIABLES WORKLIST (POUR REUTILISATION DANS FILTRES)
            for (let i=0; i<works.length; i++){
                createWork (works[i], targetDiv, deleteButton)   
            }
        })
        .catch(() => {
            // REPLI: CHARGER LES IMAGES LOCALES DE assets/images
            const localWorks = getLocalWorksFromAssets();
            workList = localWorks;
            for (let i=0; i<localWorks.length; i++){
                createWork (localWorks[i], targetDiv, deleteButton)
            }
        })
}

//AFFICHAGE D'UN PROJET
function createWork (work, targetDiv,deleteButton) {
    let figure = document.createElement ("figure");
    let imgWorks = document.createElement ("img");
    let figcaption = document.createElement ("figcaption");
    imgWorks.src = work.imageUrl; // l'API fournit une URL absolue
    imgWorks.alt = work.title || "";
    imgWorks.loading = "lazy";
    if (work.id !== undefined) {
        imgWorks.setAttribute("data-id", String(work.id));
    }
    figcaption.innerHTML = work.title;
    figure.appendChild (imgWorks)
    figure.appendChild (figcaption)
    targetDiv.appendChild (figure)
    if (deleteButton) { // SI ON A DEMANDE LA CREATION D'UN BOUTON DE SUPPR (deleteButton == true)
        createDeleteButton(figure,work)
    }
}

// (aucune fonction d'affichage globale nécessaire en dehors de createWork)

// REPLI LOCAL: construit une liste de travaux à partir des images du projet
function getLocalWorksFromAssets() {
    // Liste basée sur les fichiers présents dans assets/images
    const assetsBase = computeAssetsBase();
    const filenames = [
        "abajour-tahina.png",
        "appartement-paris-v.png",
        "appartement-paris-x.png",
        "appartement-paris-xviii.png",
        "bar-lullaby-paris.png",
        "hotel-first-arte-new-delhi.png",
        "la-balisiere.png",
        "le-coteau-cassis.png",
        "restaurant-sushisen-londres.png",
        "structures-thermopolis.png",
        "villa-ferneze.png"
    ];

    const works = [];
    for (let i=0; i<filenames.length; i++){
        const filename = filenames[i];
        const title = filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
        works.push({
            id: i+1,
            title: title,
            imageUrl: assetsBase + filename,
            categoryId: 0
        });
    }
    return works;
}

// Détermine le bon préfixe d'assets selon le dossier racine servi par Live Server
function computeAssetsBase() {
    // On cible l'usage principal: ouverture de FrontEnd/index.html
    return "./assets/images/";
}

// Fonctions utilitaires pour interagir avec la galerie depuis d'autres modules (ex: modales)
function ajouterProjetDansGalerie(projet) {
    if (!projet || !projet.imageUrl) return;
    const target = document.querySelector(".gallery");
    if (!target) return;
    createWork({
        id: projet.id,
        title: projet.title || "Projet",
        imageUrl: projet.imageUrl,
        categoryId: projet.categoryId || 0
    }, target, false);
}

function supprimerProjetDansGalerie(id) {
    const imgToRemove = document.querySelector(`.gallery img[data-id="${id}"]`);
    if (!imgToRemove) return;
    const figure = imgToRemove.closest("figure");
    if (figure) figure.remove();
}

// Expose pour usage global éventuel
window.ajouterProjetDansGalerie = ajouterProjetDansGalerie;
window.supprimerProjetDansGalerie = supprimerProjetDansGalerie;

//RECUPERATION DES CATEGORIES
fetch (CATEGORY_API)
    .then (reponse => reponse.json())
    .then (categories => {
        let filterWorks = new Set (categories)
        let nouvelleCategorie = {id:0,name:"Tous"};
        createFilterButton(nouvelleCategorie);
        addSelectedClass(nouvelleCategorie.id)
        for (let category of filterWorks) {
            createFilterButton (category)
        }   
    })

//CREATION DES BOUTONS FILTRES   
function createFilterButton (category) {
    let categoryLink = document.createElement ("a") 
    categoryLink.id="category"+category.id
    categoryLink.classList.add("category")
    categoryLink.innerHTML = category.name;
    FILTER_DIV.appendChild (categoryLink)


    //AJOUT DU EVENTLISTERNER SUR LES FILTRES
    categoryLink.addEventListener("click", function() {
        filterWorksByCategory(category.id);
    });
}

function filterWorksByCategory(categoryId) {
    //SUPPRIMER TOUT CE QU IL Y A DANS DIV GALLERY 
    GALLERY_DIV.innerHTML=''

    //AFFICHER UNIQUEMENT WORKS AVEC CATEGORY=CATEGORYID OU TOUS
    for (let i=0; i<workList.length; i++){
        if (workList[i].categoryId===categoryId || categoryId===0){
            createWork (workList[i],GALLERY_DIV,false)   
        }  
    }

    //GESTION DE L'APPARENCE DES FILTRES (SELECTION)
    removeSelectedClass() 
    addSelectedClass(categoryId) 
}
 
//MODIFICATION LOGIN EN LOGOUT SI NECESSAIRE
gestion_login();


//CREATION D'UN BOUTON SUPPRIMER POUR CHAQUE IMAGE
function createDeleteButton (figure,work){
    let button = document.createElement('i');
    button.classList.add("fa-regular", "fa-trash-can");
    button.addEventListener('click', DELETE_WORK)
    button.id = work.id
    figure.appendChild(button)
}

//AJOUT DE LA CLASSE SELECTED A UNE CATEGORY
function addSelectedClass (categoryId) {
    document.getElementById("category"+categoryId).classList.add("selected")
}

//SUPRESSION DE LA CLASSE SELECTED AUX CATEGORIES
function removeSelectedClass() {
    let filters=document.querySelectorAll(".category");
    for (let i = 0; i <filters.length; i++) {
        filters[i].classList.remove ("selected")
    }
}

function gestion_login () {
    if (sessionStorage.getItem("token")) {
        //POUR CHANGER LE MOT LOGIN EN LOGOUT
        let loginLogoutLink= document.getElementById("login_logout");
        if (loginLogoutLink) loginLogoutLink.textContent="logout"
        //POUR FAIRE APPARAITRE LE BANDEAU EDITION
        let bandeau_edit=document.getElementById("edition");
        if (bandeau_edit) bandeau_edit.style.display="flex"
        //POUR FAIRE APPARAITRE LA MODIFICATION DES PROJETS
        let projet_modif=document.getElementById("modif_projet")
        if (projet_modif) projet_modif.style.display="inline"
        //POUR CACHER LES FILTRES EN MODE EDITION
        let button_filter=document.querySelector(".filter")
        if (button_filter) button_filter.style.display="none"
        // DÉCONNEXION LORS DU CLIQUE SUR LOGOUT
        if (loginLogoutLink){
          loginLogoutLink.addEventListener("click", function (event) {
              event.preventDefault();

              // SUPPRESSION DU TOKEN DU SESSION STORAGE
              sessionStorage.removeItem("token");

              // REDIRECTION VERS LA PAGE D'ACCUEIL
              window.location.href = "index.html";
          });
        }
    }
}