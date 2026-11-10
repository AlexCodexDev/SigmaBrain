// START: Update User Interface
// function updateUserUI() {
//     const userDisplay = document.getElementById('user-display-name');
//     const scoreDisplay = document.getElementById('user-high-score');
// }
// END: Update User Interface

// function logout() {
//     playSound('click');
//     currentUser = "Tamu";
//     document.getElementById('login-username').value = "";
//     document.getElementById('login-password').value = "";
//     changeScreen('screen-login');
// }

// function loginAsGuest() {
//     playSound('click');
//     currentUser = "Tamu";
//     updateUserUI();
//     changeScreen('screen-home');
// }

import { initializeAuth } from "../../controllers/auth/index";

console.log("APP.JS BERHASIL DIMUAT");

document.addEventListener("click", (event) => {
    if (event.target.closest("#testButton")) {
        console.log("EVENT CLICK TERDETEKSI");
        alert("APP.JS BERHASIL MENANGKAP CLICK");
    }
});

async function loadComponents() {
    const loginResponse = await fetch("../../components/auth/login.html");
    const registerResponse = await fetch("../../components/auth/register.html");

    const loginHTML = await loginResponse.text();
    const registerHTML = await registerResponse.text();

    document.querySelector("#login").innerHTML = loginHTML;
    document.querySelector("#register").innerHTML = registerHTML;
}

loadComponents();

async function loadComponents() {
    const loginResponse = await fetch(
        `../../components/auth/login.html?t=${Date.now()}`
    );

    const registerResponse = await fetch(
        `../../components/auth/register.html?t=${Date.now()}`
    );

    const loginHTML = await loginResponse.text();
    const registerHTML = await registerResponse.text();

    document.querySelector("#login").innerHTML = loginHTML;
    document.querySelector("#register").innerHTML = registerHTML;

    initializeAuth();
}

loadComponents();