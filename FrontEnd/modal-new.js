
// Déclaration des constantes pour les éléments du DOM et les URLs
// WORKS_API, CATEGORY_API, GALLERY_DIV sont déjà déclarées dans gallery.js
// GALLERY_MODALE est déjà déclarée dans modal-gallery.js
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


// Fonction simple pour ouvrir la modale d'ajout de photo
//FONCTION OUVERTURE BOITE MODALE
const OPEN_MODAL_NEW = function (e) {
    e.preventDefault()
    //ON CACHE LA MODAL-GALLERY
    const modal = document.querySelector("#modal1");
    modal.style.display="none";
    //ON AFFICHE LA MODALE DE CREATION
    modal_new=document.querySelector("#modal2");
    modal_new.style.display="flex"
    modal_new.addEventListener('click', closeModalNew)
    BUTTON_CLOSE_NEW.addEventListener('click', closeModalNew)
    let modal_wrapper=document.querySelector(".modal-wrapper-new")
    modal_wrapper.style.display="flex"
    resetPhotoSelection(); //REMISE A VIDE DE LA SELECTION PHOTO
    resetForm();// REMISE A VIDE FORMULAIRE AJOUT PHOTO 
    loadCategories();
}


// Fonction pour fermer la modale d'ajout
function closeModalNew(e) {
    if (e) {
        // Si on clique sur le contenu de la modale (modal-wrapper-new), on ne ferme pas
        if (e.target.closest('.modal-wrapper-new')) {
            return;
        }
        
        // On ferme seulement si on clique sur le fond (modal_new) ou le bouton de fermeture
        if (e.target === modal_new || e.target === BUTTON_CLOSE_NEW || e.target.closest('.js-modal-close-new')) {
            e.preventDefault();
            e.stopPropagation();
            
            // On ferme la modale
            if (modal_new) {
                modal_new.style.display = "none";
                modal_new.removeEventListener('click', closeModalNew);
                BUTTON_CLOSE_NEW.removeEventListener('click', closeModalNew);
            }
        }
    } else {
        // Appel sans événement (depuis uploadWork par exemple)
        if (modal_new) {
            modal_new.style.display = "none";
            modal_new.removeEventListener('click', closeModalNew);
            BUTTON_CLOSE_NEW.removeEventListener('click', closeModalNew);
        }
    }
}


// Bouton retour : on ferme la modale d'ajout et on rouvre la galerie
BUTTON_BACK.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (modal_new) modal_new.style.display = "none";
    document.querySelector("#modal1").style.display = "flex";
});


// Bouton "Ajouter photo" : ouvre le sélecteur de fichier
BUTTON_ADD.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    INPUT_PICTURE.click();
});


// Quand on choisit une image, on affiche l'aperçu
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
    fetch(CATEGORY_API)
        .then(function(response) { return response.json(); })
        .then(function(categories) {
            categories.forEach(function(category) {
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
    fetch(WORKS_API, {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token
            // Ne pas mettre Content-Type pour FormData, le navigateur le fait automatiquement
        },
        body: formData
    })
    .then(function(response) {
        console.log("Réponse API:", response.status, response.statusText);
        if (response.status === 201) {
            return response.json().then(function(data) {
                console.log("Projet ajouté avec succès:", data);
                alert("Projet ajouté !");
                resetPhotoSelection();
                resetForm();
                if (typeof refreshWorks === "function") {
                    refreshWorks(GALLERY_MODALE, true);
                    refreshWorks(GALLERY_DIV, false);
                }
                checkForm();
                closeModalNew();
            });
        } else if (response.status === 400) {
            return response.json().then(function(data) {
                console.error("Erreur 400:", data);
                alert("Requête invalide. Vérifiez les champs.");
            }).catch(function() {
                alert("Requête invalide. Vérifiez les champs.");
            });
        } else if (response.status === 401) {
            alert("Session expirée ou non autorisée.");
        } else {
            console.error("Erreur inattendue:", response.status, response.statusText);
            alert("Erreur lors de l'ajout du projet (code: " + response.status + ").");
        }
    })
    .catch(function(error) {
        console.error("Erreur réseau:", error);
        alert("Erreur réseau ou serveur: " + error.message);
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
INPUT_PICTURE.addEventListener("click", function(e) {
    e.stopPropagation();
});

CATEGORIES_SELECT.addEventListener("change", checkForm);
CATEGORIES_SELECT.addEventListener("click", function(e) {
    e.stopPropagation();
});

TITLE_NEW_PHOTO.addEventListener("input", checkForm);
TITLE_NEW_PHOTO.addEventListener("click", function(e) {
    e.stopPropagation();
});

// On gère la soumission du formulaire
BUTTON_SUBMIT.addEventListener("click", function(e) {
    e.stopPropagation();
    uploadWork(e);
});
document.querySelectorAll('#ajout_projet').forEach(a => {
    a.addEventListener('click', OPEN_MODAL_NEW)
})


