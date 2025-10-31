// Mode édition

// Récupere les informations de "sessionStorage" si elles sont disponibles
const userId = sessionStorage.getItem('userId'); 
const token = sessionStorage.getItem('token');

const btnContainer = document.querySelector('#btn-container');

if (userId && token) {
    // N'affiche pas le conteneur des boutons filtres (btn-container)
    btnContainer.style.display='none';
    

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
    header.parentNode.insertBefore(editModeBanner, header);


    // Modifie le texte du lien "LogIn" dans le nav pour deconnexion
    const logoutLink = document.querySelector('nav ul li a[href="logIn.html#logIn"]');
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


    // Ajout du lien "modifier" a coté du titre "mes projets"
    const editButton = document.querySelector('#portfolio h2');
    if (editButton) {
        const editLink = document.createElement('a');
        editLink.href = "#";
        editLink.className = "edit-link";
        // Icone
        const editIcon = document.createElement('i');
        editIcon.className = 'fa-regular fa-pen-to-square';
        // Ajoute texte "modifier"
        const editText = document.createElement('p');
        editText.textContent = "Modifier";
        editText.style.display = 'inline';
        // Regroupe icone et texte dans "edit-link"
        editLink.appendChild(editIcon);
        editLink.appendChild(editText);
        // Ajoute le lien a coté du titre "mes projets"
        editButton.appendChild(editLink);
    }



    console.log("Utilisateur connecté : ", userId, token); // Affiche console si connecté

} else {
    console.log("Aucune session active"); // Affiche console si aucune session en cours
}