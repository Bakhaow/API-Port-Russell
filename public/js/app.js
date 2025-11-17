// Script principal pour la page d'accueil
document.addEventListener('DOMContentLoaded', () => {
    // Rediriger si déjà connecté
    redirectIfAuthenticated();

    // Gestion de l'affichage login/register
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    showRegisterLink?.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });

    showLoginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    // Formulaire de connexion
    const loginForm = document.getElementById('login-form');
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');

        errorDiv.textContent = '';
        errorDiv.classList.remove('show');

        try {
            const response = await loginUser(email, password);
            setToken(response.token);
            setUser(response.user);
            window.location.href = '/dashboard.html';
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.add('show');
        }
    });

    // Formulaire d'inscription
    const registerForm = document.getElementById('register-form');
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const errorDiv = document.getElementById('register-error');

        errorDiv.textContent = '';
        errorDiv.classList.remove('show');

        try {
            const response = await registerUser(name, email, password);
            setToken(response.token);
            setUser(response.user);
            window.location.href = '/dashboard.html';
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.add('show');
        }
    });
});

