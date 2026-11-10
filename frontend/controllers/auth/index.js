let currentAuthMode = 'login';

export function initializeAuth() {
    window.switchAuthTab = switchAuthTab;

    initializeRegister();
    switchAuthTab(currentAuthMode);
}

// START: Login & Register Tab Switching
function switchAuthTab(mode) {
    playSound('click');
    currentAuthMode = mode;

    // START: Login Declaration
    const loginSection = document.getElementById('login');

    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");
    // END: Login Declaration

    // START: Register Declaration
    const registerSection = document.getElementById('register');

    const registerUsername = document.getElementById("registerUsername");
    const registerEmail = document.getElementById("registerEmail");
    const registerPassword = document.getElementById("registerPassword");
    const registerConfirmPassword = document.getElementById("registerConfirmPassword");
    // END: Register Declaration

    if(!loginSection || !registerSection) return;

    if (mode === 'login') {
        loginSection.classList.remove("hidden");
        registerSection.classList.add("hidden");

        registerUsername.value = null;
        registerEmail.value = null;
        registerPassword.value = null;
        registerConfirmPassword.value = null;
        
    } else {
        registerSection.classList.remove("hidden");
        loginSection.classList.add("hidden");

        loginUsername.value = null;
        loginPassword.value = null;
    }
}
// END: Login & Register Tab Switching

// START: Form Register
function initializeRegister() {
    // Mencegah listener terpasang berulang kali
    if (window.registerSubmitInitialized) return;
    window.registerSubmitInitialized = true;

    document.addEventListener("submit", async (event) => {
        const form = event.target;

        if (!(form instanceof HTMLFormElement)) return;
        if (form.id !== "registerForm") return;

        // Cegah browser melakukan submit normal
        event.preventDefault();
        event.stopImmediatePropagation();

        const username = document.getElementById("registerUsername").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("registerConfirmPassword").value;

        if (password !== confirmPassword) {
            showToast("Konfirmasi password tidak sama!", "error");
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                showToast(result.message || "Registrasi gagal", "error");
                return;
            }

            showToast(result.message || "Registrasi berhasil", "success");
            form.reset();

        } catch (error) {
            console.error("Register error:", error);
            showToast("Tidak dapat terhubung ke server.", "error");
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    }, true);
}
// END: Form Register