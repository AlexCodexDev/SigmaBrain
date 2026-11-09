let currentAuthMode = 'login';

export function initializeAuth() {
    window.switchAuthTab = switchAuthTab;

    switchAuthTab(currentAuthMode);
}

// START: Login & Register Tab Switching
function switchAuthTab(mode) {
    playSound('click');
    currentAuthMode = mode;

    const loginSection = document.getElementById('login');
    const registerSection = document.getElementById('register');

    if (mode === 'login') {
        loginSection.classList.remove("hidden");
        registerSection.classList.add("hidden");
    } else {
        registerSection.classList.remove("hidden");
        loginSection.classList.add("hidden");
    }
}
// END: Login & Register Tab Switching