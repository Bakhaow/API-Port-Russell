// Fonctions pour les appels API
const API_URL = window.location.origin;

async function apiCall(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Une erreur est survenue');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// API Users
async function registerUser(name, email, password) {
    return apiCall('/api/users/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
    });
}

async function loginUser(email, password) {
    return apiCall('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

async function getMe() {
    return apiCall('/api/users/me');
}

async function getUsers() {
    return apiCall('/api/users');
}

async function updateUser(id, data) {
    return apiCall(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

async function deleteUser(id) {
    return apiCall(`/api/users/${id}`, {
        method: 'DELETE'
    });
}

// API Catways
async function getCatways(filters = {}) {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.available !== undefined) params.append('available', filters.available);
    const query = params.toString();
    return apiCall(`/api/catways${query ? '?' + query : ''}`);
}

async function getCatway(catwayNumber) {
    return apiCall(`/api/catways/${catwayNumber}`);
}

async function createCatway(data) {
    return apiCall('/api/catways', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

async function updateCatway(catwayNumber, data) {
    return apiCall(`/api/catways/${catwayNumber}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

async function deleteCatway(catwayNumber) {
    return apiCall(`/api/catways/${catwayNumber}`, {
        method: 'DELETE'
    });
}

// API Reservations
async function getReservations() {
    return apiCall('/api/reservations');
}

async function getReservation(id) {
    return apiCall(`/api/reservations/${id}`);
}

async function createReservation(data) {
    return apiCall('/api/reservations', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

async function updateReservation(id, data) {
    return apiCall(`/api/reservations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

async function deleteReservation(id) {
    return apiCall(`/api/reservations/${id}`, {
        method: 'DELETE'
    });
}

