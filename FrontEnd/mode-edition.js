// Mode édition

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Récupere les informations de "sessionStorage" si elles sont disponibles
    const token = sessionStorage.getItem('token');

    const btnContainer = document.querySelector('#btn-container');

    if (token) {
        // N'affiche pas le conteneur des boutons filtres (btn-container)
        if (btnContainer) {
            btnContainer.style.display='none';
        }
        

        // Afficher le bandeau "Mode edition" existant dans le HTML
        const editionSection = document.querySelector('#edition');
        if (editionSection) {
            editionSection.style.display = 'block';
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
            console.log("Bouton modifier trouvé et affiché");
            
            // S'assurer que l'event listener est attaché (au cas où modal-gallery.js ne l'a pas fait)
            // Attendre un peu pour que les autres scripts soient chargés
            setTimeout(function() {
                // Si OPEN_MODAL existe, l'utiliser
                if (typeof OPEN_MODAL === 'function') {
                    editButton.addEventListener('click', OPEN_MODAL);
                    console.log("Event listener OPEN_MODAL attaché");
                } else {
                    console.log("OPEN_MODAL n'existe pas encore");
                }
            }, 200);
        } else {
            console.log("Bouton #modif_projet non trouvé dans le DOM");
        }

        console.log("Utilisateur connecté : ", token); // Affiche console si connecté

    } else {
        // Cache le bandeau "Mode edition" si l'utilisateur n'est pas connecté
        const editionSection = document.querySelector('#edition');
        if (editionSection) {
            editionSection.style.display = 'none';
        }
        
        // Cache le bouton "modifier" si l'utilisateur n'est pas connecté
        const editButton = document.querySelector('#modif_projet');
        if (editButton) {
            editButton.style.display = 'none';
        }
        console.log("Aucune session active"); // Affiche console si aucune session en cours
    }
});