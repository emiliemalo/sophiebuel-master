document.addEventListener('DOMContentLoaded', function () {
  function editionMode() {
    // Création de la barre d'édition
    const body = document.querySelector("body");
    const editMode = document.createElement("div");
    editMode.innerHTML = `<span><i class="fa-regular fa-pen-to-square"></i></span><p>Mode édition</p>`;
    editMode.classList.add("edit-mode");
    body.prepend(editMode);

    // Modification du bouton logout
    const logOut = document.getElementById("logout");
    if (logOut) logOut.innerHTML = "logout";

    // Ajout du bouton modifier
    const divModifier = document.querySelector(".modifier");
    if (!divModifier) {
      console.warn("Le bouton 'modifier' est introuvable");
      return;
    }

    divModifier.classList.add("btn-modifier");
    divModifier.innerHTML = `<i class="fa-regular fa-pen-to-square"></i><a>modifier</a>`;

    // Gestionnaire d'événement pour l'ouverture de la modale
    divModifier.addEventListener("click", function (event) {
      event.preventDefault();
      const fondModale = document.getElementById("modal");
      const modal1 = document.querySelector(".modal-gallery");
      const modal2 = document.querySelector(".modal-add");

      if (fondModale) fondModale.style.display = "flex";
      if (modal1) modal1.style.display = "block";
      if (modal2) modal2.style.display = "none";
    });
  }

  editionMode();
});

<script src="./assets/js/edition.js"></script>