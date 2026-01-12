// ============================================
// MODAL NEW - Gestion de la modale d'ajout de projet
// ============================================

// ============================================
// CONSTANTES
// ============================================
const WORKS_API_LOCAL = (typeof WORKS_API !== 'undefined') ? WORKS_API : "http://localhost:5678/api/works";
const CATEGORY_API_LOCAL = (typeof CATEGORY_API !== 'undefined') ? CATEGORY_API : "http://localhost:5678/api/categories";
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

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

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

// Charge les catégories depuis l'API et les ajoute au select
function loadCategories() {
    CATEGORIES_SELECT.innerHTML = '';
    let option = document.createElement("option");
    option.value = 0;
    option.text = "";
    CATEGORIES_SELECT.appendChild(option);
    fetch(CATEGORY_API_LOCAL)
        .then(function(response) { 
            return response.json(); 
        })
        .then(function(categories) {
            categories.forEach(function(category) {
                let opt = document.createElement("option");
                opt.value = category.id;
                opt.text = category.name;
                CATEGORIES_SELECT.appendChild(opt);
            });
        })
        .catch(function(error) {
            console.error("Erreur lors du chargement des catégories:", error);
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

// ============================================
// FONCTIONS API
// ============================================

// Fonction pour envoyer le nouveau projet à l'API
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
    .then(function(response) {
        if (response.status === 201 || response.status === 200) {
            // FERMER LA MODALE IMMÉDIATEMENT avant l'alert
            closeModalNew();
            
            // Fermeture supplémentaire directe pour être sûr
            const modal2 = document.querySelector("#modal2");
            if (modal2) {
                modal2.style.display = "none";
            }
            
            // Fermer TOUS les wrappers modal-wrapper-new
            const modalWrappersNew = document.querySelectorAll(".modal-wrapper-new");
            modalWrappersNew.forEach(function(wrapper) {
                wrapper.style.display = "none";
            });
            
            // Fermer aussi la modale de galerie (modal1) si elle est ouverte
            const modal1 = document.querySelector("#modal1");
            if (modal1) {
                modal1.style.display = "none";
            }
            const modalWrapper1 = document.querySelector(".modal-wrapper");
            if (modalWrapper1) {
                modalWrapper1.style.display = "none";
            }
            
            // Utiliser setTimeout pour afficher l'alert APRÈS la fermeture de la modale
            setTimeout(function() {
                alert("Projet ajouté !");
                
                // Rafraîchir la galerie APRÈS l'alert
                if (typeof refreshWorks === "function") {
                    refreshWorks(document.querySelector(".gallery"), false);
                }
            }, 100); // Délai de 100ms pour laisser le navigateur fermer la modale avant l'alert
        } else if (response.status === 400) {
            alert("Requête invalide. Vérifiez les champs.");
        } else if (response.status === 401) {
            alert("Session expirée ou non autorisée.");
        } else {
            alert("Erreur lors de l'ajout du projet.");
        }
    })
    .catch(function(error) {
        console.error("Erreur lors de l'ajout du projet:", error);
        alert("Erreur réseau ou serveur.");
    });
}

// ============================================
// FONCTIONS PRINCIPALES
// ============================================

// Handler pour fermer la modal en cliquant sur le fond
function handleModalBackgroundClick(e) {
    // Si on clique directement sur la modal (le fond), on ferme
    // e.currentTarget est toujours la modal (#modal2)
    // e.target est l'élément sur lequel on a cliqué
    if (e.target === e.currentTarget) {
        closeModalNew(e);
    }
}

// Handler pour empêcher la propagation des clics sur le contenu
function handleModalContentClick(e) {
    e.stopPropagation();
}

// FONCTION OUVERTURE BOITE MODALE
const OPEN_MODAL_NEW = function (e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    // ON CACHE LA MODAL-GALLERY
    const modal = document.querySelector("#modal1");
    if (modal) {
        modal.style.display = "none";
    }
    // ON AFFICHE LA MODALE DE CREATION
    modal_new = document.querySelector("#modal2");
    if (modal_new) {
        modal_new.style.display = "flex";
    }
    let modal_wrapper = document.querySelector(".modal-wrapper-new");
    if (modal_wrapper) {
        modal_wrapper.style.display = "flex";
    }
    resetPhotoSelection(); // REMISE A VIDE DE LA SELECTION PHOTO
    resetForm(); // REMISE A VIDE FORMULAIRE AJOUT PHOTO 
    loadCategories();
};

// Fonction pour fermer la modale d'ajout
function closeModalNew(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Fermer la modale (modal2) - utiliser querySelector directement pour être sûr
    const modal2 = document.querySelector("#modal2");
    if (modal2) {
        modal2.style.display = "none";
    }
    // Mettre à jour la variable aussi
    if (modal_new) {
        modal_new.style.display = "none";
    }
    
    // Fermer TOUS les wrappers modal-wrapper-new (au cas où il y en aurait plusieurs)
    const modal_wrappers = document.querySelectorAll(".modal-wrapper-new");
    modal_wrappers.forEach(function(wrapper) {
        wrapper.style.display = "none";
    });
    
    // Réinitialiser la variable
    modal_new = null;
}

// ============================================
// INITIALISATION
// ============================================

// Initialisation des event listeners au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    // Event listener pour fermer la modal en cliquant sur le fond
    const modal2 = document.querySelector("#modal2");
    if (modal2) {
        modal2.addEventListener('click', handleModalBackgroundClick);
    }
    
    // Event listener pour empêcher la fermeture quand on clique sur le contenu
    const modal_wrapper = document.querySelector(".modal-wrapper-new");
    if (modal_wrapper) {
        modal_wrapper.addEventListener('click', handleModalContentClick);
    }
    
    // Event listener pour le bouton de fermeture
    if (BUTTON_CLOSE_NEW) {
        BUTTON_CLOSE_NEW.addEventListener('click', closeModalNew);
    }
    
    // Bouton retour ferme la modale d'ajout et on rouvre la galerie
    if (BUTTON_BACK) {
        BUTTON_BACK.addEventListener("click", function() {
            if (modal_new) modal_new.style.display = "none";
            const modal1 = document.querySelector("#modal1");
            if (modal1) {
                modal1.style.display = "flex";
            }
        });
    }
    
    // Bouton pour ouvrir le browser de fichiers
    if (BUTTON_ADD) {
        BUTTON_ADD.addEventListener("click", function() {
            INPUT_PICTURE.click();
        });
    }
    
    // Aperçu de l'image sélectionnée
    if (INPUT_PICTURE) {
        INPUT_PICTURE.addEventListener("change", function() {
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
    }
    
    // Vérification du formulaire à chaque changement
    if (INPUT_PICTURE) {
        INPUT_PICTURE.addEventListener("change", checkForm);
    }
    if (CATEGORIES_SELECT) {
        CATEGORIES_SELECT.addEventListener("change", checkForm);
    }
    if (TITLE_NEW_PHOTO) {
        TITLE_NEW_PHOTO.addEventListener("input", checkForm);
    }
    
    // Gestion de la soumission du formulaire
    if (BUTTON_SUBMIT) {
        BUTTON_SUBMIT.addEventListener("click", function(e) {
            // Fermer la modale avant l'upload
            closeModalNew();
            
            // Attendre un peu pour laisser la modale se fermer
            setTimeout(function() {
                // Appeler uploadWork qui va faire l'upload et afficher l'alert après
                uploadWork(e);
            }, 50);
        });
    }
});

// Ajout de l'event listener pour le bouton "Ajouter une photo"
// Utilisation de la délégation d'événements sur document pour fonctionner même si le bouton est dans une modal cachée
document.addEventListener('click', function(e) {
    // Vérifier si le clic est sur le bouton "Ajouter une photo" ou un de ses enfants
    const target = e.target.closest('#ajout_projet');
    if (target) {
        OPEN_MODAL_NEW(e);
    }
});
