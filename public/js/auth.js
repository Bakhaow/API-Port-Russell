// Gestion de l'authentification et du token
const API_URL = window.location.origin;

// Fonctions de gestion du token
function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
}

function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function removeUser() {
    localStorage.removeItem('user');
}

// Vérifier si l'utilisateur est connecté
function isAuthenticated() {
    return getToken() !== null;
}

// Rediriger vers la page d'accueil si non authentifié
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/';
        return false;
    }
    return true;
}

// Rediriger vers le dashboard si authentifié
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = '/dashboard.html';
    }
}

