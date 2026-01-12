
// Déclaration des constantes pour les éléments du DOM et les URLs
// Utiliser les constantes globales si elles existent, sinon fallback local
const WORKS_API_LOCAL = (typeof WORKS_API !== 'undefined') ? WORKS_API : "http://localhost:5678/api/works";
const CATEGORY_API_LOCAL = (typeof CATEGORY_API !== 'undefined') ? CATEGORY_API : "http://localhost:5678/api/categories";
// GALLERY_MODALE est déjà déclaré dans modal-gallery.js
// GALLERY_DIV est déjà déclaré dans gallery.js
const BUTTON_CLOSE_NEW = document.querySelector('.js-modal-close-new');
const BUTTON_BACK = document.querySelector('.modal-back');
const BUTTON_ADD = document.querySelector('.button-add-photo');
const INPUT_PICTURE = document.querySelector('#input-picture');
const PICTURE_PREVIEW = document.querySelector('#picture-preview');
const PICTURE_SELECTION = document.querySelector('.picture-selection');
const CATEGORIES_SELECT = document.querySelector('.select-category');
const TITLE_NEW_PHOTO = document.querySelector('.input-titre');
const BUTTON_SUBMIT = document.querySelector('.button-submit');

let modal_new = null;


// Handler pour fermer la modale en cliquant sur le fond (en dehors)
function handleModalBackgroundClick(e) {
    // Si on clique directement sur la modale (le fond), on ferme
    // e.currentTarget est toujours la modale (#modal2)
    // e.target est l'élément sur lequel on a cliqué
    if (e.target === e.currentTarget) {
        closeModalNew(e);
    }
}

// Handler pour empêcher la propagation des clics sur le contenu
function handleModalContentClick(e) {
    e.stopPropagation();
}

// Fonction simple pour ouvrir la modale d'ajout de photo
//FONCTION OUVERTURE BOITE MODALE
const OPEN_MODAL_NEW = function (e) {
    e.preventDefault()
    //ON CACHE LA MODAL-GALLERY
    const modal = document.querySelector("#modal1");
    if (modal) {
        modal.style.display = "none";
    }
    //ON AFFICHE LA MODALE DE CREATION
    modal_new = document.querySelector("#modal2");
    if (modal_new) {
        modal_new.style.display = "flex"
        // Retirer d'abord l'event listener s'il existe pour éviter les doublons
        modal_new.removeEventListener('click', handleModalBackgroundClick);
        modal_new.addEventListener('click', handleModalBackgroundClick);
    }
    if (BUTTON_CLOSE_NEW) {
        // Retirer d'abord l'event listener s'il existe pour éviter les doublons
        BUTTON_CLOSE_NEW.removeEventListener('click', closeModalNew);
        BUTTON_CLOSE_NEW.addEventListener('click', closeModalNew);
    }
    let modal_wrapper = document.querySelector(".modal-wrapper-new")
    if (modal_wrapper) {
        modal_wrapper.style.display = "flex"
        // Empêcher la fermeture quand on clique sur le contenu
        modal_wrapper.removeEventListener('click', handleModalContentClick);
        modal_wrapper.addEventListener('click', handleModalContentClick);
    }
    resetPhotoSelection(); //REMISE A VIDE DE LA SELECTION PHOTO
    resetForm();// REMISE A VIDE FORMULAIRE AJOUT PHOTO 
    loadCategories();
}




// Bouton retour : on ferme la modale d'ajout et on rouvre la galerie
if (BUTTON_BACK) {
    BUTTON_BACK.addEventListener("click", function () {
        closeModalNew();
        const modal1 = document.querySelector("#modal1");
        if (modal1) {
            modal1.style.display = "flex";
        }
    });
}


// Bouton "Ajouter photo" : ouvre le sélecteur de fichier
BUTTON_ADD.addEventListener("click", function () {
    INPUT_PICTURE.click();
});


// Quand on choisit une image, on affiche l'aperçu
INPUT_PICTURE.addEventListener("change", function () {
    if (this.files[0]) {
        if (this.files[0].size > 4194304) {
            alert("Fichier trop volumineux (4Mo max)");
            this.value = "";
            return;
        }
        PICTURE_PREVIEW.src = URL.createObjectURL(this.files[0]);
        PICTURE_PREVIEW.style.display = "block";
        PICTURE_SELECTION.style.display = "none";
    }
});

// Fonction pour fermer la modale d'ajout
function closeModalNew(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Fermer la modale (modal2)
    if (modal_new) {
        modal_new.style.display = "none";
        // Retirer les event listeners
        modal_new.removeEventListener('click', handleModalBackgroundClick);
    }
    const modal2 = document.querySelector("#modal2");
    if (modal2) {
        modal2.style.display = "none";
    }
    
    // Fermer TOUS les wrappers modal-wrapper-new
    const modal_wrappers = document.querySelectorAll(".modal-wrapper-new");
    modal_wrappers.forEach(function(wrapper) {
        wrapper.style.display = "none";
        wrapper.removeEventListener('click', handleModalContentClick);
    });
    
    // Réinitialiser la variable
    modal_new = null;
}


// Remet à zéro la sélection d'image
function resetPhotoSelection() {
    INPUT_PICTURE.value = "";
    PICTURE_PREVIEW.src = "";
    PICTURE_PREVIEW.style.display = "none";
    PICTURE_SELECTION.style.display = "block";
}


// Remet à zéro le formulaire
function resetForm() {
    CATEGORIES_SELECT.value = 0;
    TITLE_NEW_PHOTO.value = "";
}


// Charge les catégories depuis l'API et les ajoute au select (simple)
function loadCategories() {
    CATEGORIES_SELECT.innerHTML = '';
    let option = document.createElement("option");
    option.value = 0;
    option.text = "";
    CATEGORIES_SELECT.appendChild(option);
    fetch(CATEGORY_API_LOCAL)
        .then(function (response) { return response.json(); })
        .then(function (categories) {
            categories.forEach(function (category) {
                let opt = document.createElement("option");
                opt.value = category.id;
                opt.text = category.name;
                CATEGORIES_SELECT.appendChild(opt);
            });
        });
}




// Fonction simple pour envoyer le nouveau projet à l'API
function uploadWork(e) {
    e.preventDefault();
    // Vérifie que tous les champs sont remplis
    if (!INPUT_PICTURE.files[0] || !TITLE_NEW_PHOTO.value.trim() || !CATEGORIES_SELECT.value || CATEGORIES_SELECT.value == 0) {
        alert("Tous les champs sont obligatoires.");
        return;
    }
    // Récupère le token
    var token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
        alert("Vous devez être connecté(e).");
        return;
    }
    // Prépare les données à envoyer
    var formData = new FormData();
    formData.append("image", INPUT_PICTURE.files[0]);
    formData.append("title", TITLE_NEW_PHOTO.value.trim());
    formData.append("category", CATEGORIES_SELECT.value);
    // Envoie la requête
    fetch(WORKS_API_LOCAL, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: formData
    })
        .then(function (response) {
            if (response.status === 201) {
                // Fermer la modale AUTOMATIQUEMENT après submit réussi
                closeModalNew();
                
                // Fermeture supplémentaire pour être sûr
                const modal2 = document.querySelector("#modal2");
                if (modal2) {
                    modal2.style.display = "none";
                }
                const modalWrappersNew = document.querySelectorAll(".modal-wrapper-new");
                modalWrappersNew.forEach(function(wrapper) {
                    wrapper.style.display = "none";
                });
                
                // Utiliser setTimeout pour afficher l'alerte APRÈS la fermeture
                setTimeout(function() {
                    alert("Projet ajouté !");
                    
                    // Réinitialiser le formulaire
                    resetPhotoSelection();
                    resetForm();
                    
                    // Rafraîchir les galeries
                    if (typeof refreshWorks === "function") {
                        // GALLERY_MODALE est déclaré dans modal-gallery.js
                        const galleryModale = typeof GALLERY_MODALE !== 'undefined' ? GALLERY_MODALE : document.querySelector(".modal-gallery");
                        if (galleryModale) {
                            refreshWorks(galleryModale, true);
                        }
                        // GALLERY_DIV est déclaré dans gallery.js
                        const galleryDiv = typeof GALLERY_DIV !== 'undefined' ? GALLERY_DIV : document.querySelector(".gallery");
                        if (galleryDiv) {
                            refreshWorks(galleryDiv, false);
                        }
                    }
                    checkForm();
                }, 100); // Délai de 100ms pour laisser la modale se fermer visuellement
            } else if (response.status === 400) {
                alert("Requête invalide. Vérifiez les champs.");
            } else if (response.status === 401) {
                alert("Session expirée ou non autorisée.");
            } else {
                alert("Erreur lors de l'ajout du projet.");
            }
        })
        .catch(function () {
            alert("Erreur réseau ou serveur.");
        });
}





// Vérifie si le formulaire est complet et active/désactive le bouton
function checkForm() {
    if (INPUT_PICTURE.files[0] && CATEGORIES_SELECT.value != 0 && TITLE_NEW_PHOTO.value.trim() !== "") {
        BUTTON_SUBMIT.style.backgroundColor = "#1D6154";
        BUTTON_SUBMIT.style.cursor = "pointer";
        BUTTON_SUBMIT.disabled = false;
    } else {
        BUTTON_SUBMIT.style.backgroundColor = "#A7A7A7";
        BUTTON_SUBMIT.style.cursor = "default";
        BUTTON_SUBMIT.disabled = true;
    }
}



// On vérifie le formulaire à chaque changement
INPUT_PICTURE.addEventListener("change", checkForm);
CATEGORIES_SELECT.addEventListener("change", checkForm);
TITLE_NEW_PHOTO.addEventListener("input", checkForm);

// On gère la soumission du formulaire
BUTTON_SUBMIT.addEventListener("click", uploadWork);

document.querySelectorAll('#ajout_projet').forEach(a => {
    a.addEventListener('click', OPEN_MODAL_NEW)
})

// On ferme la modale quand on clique sur la croix
BUTTON_CLOSE_NEW.addEventListener('click', closeModalNew);

