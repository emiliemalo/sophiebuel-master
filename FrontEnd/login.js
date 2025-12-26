// Constantes
const LOGIN_BASE_URL = "http://localhost:5678/api/";
const USERS_API = LOGIN_BASE_URL + "users/login";
const LOGIN_BUTTON = document.getElementById("se_connecter");

// Événement de connexion
if (LOGIN_BUTTON) {
    LOGIN_BUTTON.addEventListener("click", function() {
        loginUser();
    });
}

// Fonction de connexion
function loginUser() {
    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };
    
    fetch(USERS_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(function(response) {
        if (response.status === 200) {
            return response.json();
        } else {
            let loginError = document.getElementById("login_error");
            loginError.innerHTML = "E-mail ou mot de passe incorrect";
            loginError.style.display = "flex";
        }
    })
    .then(function(data) {
        if (data) {
            sessionStorage.setItem("token", data.token);
            window.location.href = "index.html";
        }
    });
}
