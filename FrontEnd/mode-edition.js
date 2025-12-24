// Mode édition

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Récupere les informations de "sessionStorage" si elles sont disponibles
    const userId = sessionStorage.getItem('userId'); 
    const token = sessionStorage.getItem('token');

    const btnContainer = document.querySelector('#btn-container');

    if (userId && token) {
        // N'affiche pas le conteneur des boutons filtres (btn-container)
        if (btnContainer) {
            btnContainer.style.display='none';
        }
        

        // Créer le bandeau "Mode edition"
        const editModeBanner = document.createElement('div');
        editModeBanner.id = 'edit-mode-banner';
        // Icone
        const icon = document.createElement('i');
        icon.className = 'fa-regular fa-pen-to-square';
        // <p> pour texte
        const textElement = document.createElement('p');
        textElement.textContent = "Mode edition";
        textElement.style.display = 'inline';
        // Ajout icone et texte au bandeau
        editModeBanner.appendChild(icon);
        editModeBanner.appendChild(textElement);
        // Ajoute le bandeau avant le header
        const header = document.querySelector('header');
        if (header) {
            header.parentNode.insertBefore(editModeBanner, header);
        }


        // Modifie le texte du lien "LogIn" dans le nav pour deconnexion
        const logoutLink = document.querySelector('nav ul li a[href="login.html"]') || 
                          document.querySelector('nav ul li a[href="logIn.html#logIn"]');
        if (logoutLink) {
            logoutLink.textContent = "logout"; // Met a jour le texte
            // Ecoute le lien "logout"
            logoutLink.addEventListener('click', function(event){
                event.preventDefault();
                // vide les elements de "sessionStorage"
                sessionStorage.removeItem('userId');
                sessionStorage.removeItem('token');
                // Redirige vers "index.html"
                window.location.href = 'index.html';
            });
        }


        // Affiche le bouton "modifier" existant dans le HTML
        const editButton = document.querySelector('#modif_projet');
        if (editButton) {
            editButton.style.display = 'inline-flex';
            
            // S'assurer que l'event listener est attaché (au cas où modal-gallery.js ne l'a pas fait)
            // Attendre un peu pour que les autres scripts soient chargés
            setTimeout(function() {
                // Si OPEN_MODAL existe, l'utiliser
                if (typeof OPEN_MODAL === 'function') {
                    editButton.addEventListener('click', OPEN_MODAL);
                }
            }, 200);
        }

        console.log("Utilisateur connecté : ", userId, token); // Affiche console si connecté

    } else {
        // Cache le bouton "modifier" si l'utilisateur n'est pas connecté
        const editButton = document.querySelector('#modif_projet');
        if (editButton) {
            editButton.style.display = 'none';
        }
        console.log("Aucune session active"); // Affiche console si aucune session en cours
    }
});