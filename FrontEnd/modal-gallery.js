// ============================================
// MODAL GALLERY - Gestion de la modale de galerie
// ============================================

// CONSTANTES
const GALLERY_MODALE = document.querySelector(".modal-gallery");
const BUTTON_CLOSE = document.querySelector('.js-modal-close-1');
const MODALE_WRAPPER = document.querySelector(".modal-wrapper");
const BUTTON_MODIF_WORKS = document.querySelector('#modif_projet');

let modal = null;

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

// APPEL API SUPPRESSION TRAVAUX
function deleteWorkFetch(idWork) {
    let token = sessionStorage.getItem("token");
    const WORKS_API_DELETE = "http://localhost:5678/api/works";

    fetch(WORKS_API_DELETE + '/' + idWork, {
        method: "DELETE",
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => {
        if (response.status === 200 || response.status === 201 || response.status === 204) {
            refreshWorks(GALLERY_MODALE, true); // REAFFICHAGE TRAVAUX DANS MODALE
            // GALLERY_DIV est déclaré dans gallery.js, on le récupère directement
            const galleryDiv = typeof GALLERY_DIV !== 'undefined' ? GALLERY_DIV : document.querySelector(".gallery");
            if (galleryDiv) {
                refreshWorks(galleryDiv, false); // REAFFICHAGE TRAVAUX DANS INDEX
            }
        } else {
            alert("Erreur lors de la suppression du projet.");
        }
    })
    .catch(error => {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du projet.");
    });
}

// ============================================
// FONCTIONS PRINCIPALES
// ============================================

// FONCTION OUVERTURE BOITE MODALE
const OPEN_MODAL = function (e) {
    e.preventDefault();
    modal = document.querySelector("#modal1");
    modal.style.display = null;
    modal.addEventListener('click', CLOSE_MODAL);
    BUTTON_CLOSE.addEventListener('click', CLOSE_MODAL);
    MODALE_WRAPPER.style.display = "flex";
    GALLERY_MODALE.innerHTML = '';
    fetchWorks(GALLERY_MODALE, true);
};

// FONCTION FERMETURE BOITE MODALE
const CLOSE_MODAL = function (e) {
    if (modal == null) return;
    // SI ON CLIQUE SUR AUTRE CHOSE QUE LA MODALE OU LE BOUTON ON NE VEUT PAS FERMER
    if (e.target != modal && e.target != BUTTON_CLOSE && e.target != document.querySelector('.fa-solid')) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.removeEventListener('click', CLOSE_MODAL);
    BUTTON_CLOSE.removeEventListener('click', CLOSE_MODAL);
};

// FONCTION SUPPRESSION TRAVAUX
const DELETE_WORK = function (e) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");

    if (confirmation) {
        try {
            deleteWorkFetch(e.target.id);
        } catch (error) {
            console.error("Erreur lors de la suppression du projet:", error);
        }
    }
};

// ============================================
// INITIALISATION
// ============================================

// AJOUT LISTENER SUR CLIQUE BOUTON MODIFIER POUR APPELER OUVERTURE MODALE
if (BUTTON_MODIF_WORKS) {
    // Vérifier si le listener n'a pas déjà été attaché pour éviter les doublons
    if (!BUTTON_MODIF_WORKS.hasAttribute('data-modal-listener-attached')) {
        BUTTON_MODIF_WORKS.addEventListener('click', OPEN_MODAL);
        BUTTON_MODIF_WORKS.setAttribute('data-modal-listener-attached', 'true');
    }
}
