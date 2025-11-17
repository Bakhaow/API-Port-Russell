// Script principal pour le tableau de bord
let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier l'authentification
    if (!requireAuth()) return;

    // Charger les informations utilisateur
    try {
        const response = await getMe();
        currentUser = response.user;
        displayUserInfo();
        loadData();
        setupEventListeners();
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        if (error.message.includes('token') || error.message.includes('401')) {
            removeToken();
            removeUser();
            window.location.href = '/';
        }
    }
});

function displayUserInfo() {
    const userInfo = document.getElementById('user-info');
    if (userInfo && currentUser) {
        userInfo.textContent = `Connecté en tant que ${currentUser.name} (${currentUser.email}) - ${currentUser.role === 'admin' ? 'Administrateur' : 'Utilisateur'}`;
        
        // Afficher l'onglet utilisateurs si admin
        if (currentUser.role === 'admin') {
            const usersTab = document.getElementById('users-tab');
            const usersTabBtn = document.querySelector('[data-tab="users"]');
            if (usersTab) usersTab.style.display = 'block';
            if (usersTabBtn) usersTabBtn.style.display = 'block';
            
            const addCatwayBtn = document.getElementById('add-catway-btn');
            if (addCatwayBtn) addCatwayBtn.style.display = 'block';
        }
    }
}

function setupEventListeners() {
    // Déconnexion
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        removeToken();
        removeUser();
        window.location.href = '/';
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });

    // Catways
    document.getElementById('add-catway-btn')?.addEventListener('click', () => {
        openCatwayForm();
    });

    document.getElementById('cancel-catway')?.addEventListener('click', () => {
        closeCatwayForm();
    });

    document.getElementById('catway-form')?.addEventListener('submit', handleCatwaySubmit);

    document.getElementById('apply-filters')?.addEventListener('click', () => {
        loadCatways();
    });

    // Réservations
    document.getElementById('add-reservation-btn')?.addEventListener('click', () => {
        openReservationForm();
    });

    document.getElementById('cancel-reservation')?.addEventListener('click', () => {
        closeReservationForm();
    });

    document.getElementById('reservation-form')?.addEventListener('submit', handleReservationSubmit);

    // Fermer les modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });
}

function switchTab(tabName) {
    // Désactiver tous les onglets
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Activer l'onglet sélectionné
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(`${tabName}-tab`)?.classList.add('active');

    // Charger les données de l'onglet
    if (tabName === 'catways') {
        loadCatways();
    } else if (tabName === 'reservations') {
        loadReservations();
    } else if (tabName === 'users' && currentUser?.role === 'admin') {
        loadUsers();
    }
}

async function loadData() {
    await loadCatways();
}

// ========== CATWAYS ==========
async function loadCatways() {
    const listDiv = document.getElementById('catways-list');
    if (!listDiv) return;

    listDiv.innerHTML = '<p>Chargement...</p>';

    try {
        const typeFilter = document.getElementById('catway-type-filter')?.value;
        const availableFilter = document.getElementById('catway-available-filter')?.value;

        const filters = {};
        if (typeFilter) filters.type = typeFilter;
        if (availableFilter) filters.available = availableFilter === 'true';

        const response = await getCatways(filters);
        displayCatways(response.catways);
    } catch (error) {
        listDiv.innerHTML = `<p style="color: red;">Erreur: ${error.message}</p>`;
    }
}

function displayCatways(catways) {
    const listDiv = document.getElementById('catways-list');
    if (!listDiv) return;

    if (catways.length === 0) {
        listDiv.innerHTML = '<p>Aucun catway trouvé.</p>';
        return;
    }

    listDiv.innerHTML = catways.map(catway => `
        <div class="data-card">
            <h3>Catway #${catway.catwayNumber}</h3>
            <p><strong>Type:</strong> ${catway.catwayType}</p>
            <p><strong>État:</strong> ${catway.catwayState}</p>
            <span class="badge ${catway.isAvailable ? 'available' : 'unavailable'}">
                ${catway.isAvailable ? 'Disponible' : 'Non disponible'}
            </span>
            ${currentUser?.role === 'admin' ? `
                <div class="actions">
                    <button class="btn btn-primary" onclick="editCatway(${catway.catwayNumber})">Modifier</button>
                    <button class="btn btn-danger" onclick="deleteCatwayConfirm(${catway.catwayNumber})">Supprimer</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function openCatwayForm(catwayNumber = null) {
    const modal = document.getElementById('catway-form-modal');
    const form = document.getElementById('catway-form');
    const title = document.getElementById('catway-form-title');

    if (catwayNumber) {
        title.textContent = 'Modifier le catway';
        loadCatwayData(catwayNumber);
    } else {
        title.textContent = 'Ajouter un catway';
        form.reset();
        document.getElementById('catway-id').value = '';
    }

    modal.style.display = 'block';
}

function closeCatwayForm() {
    document.getElementById('catway-form-modal').style.display = 'none';
}

async function loadCatwayData(catwayNumber) {
    try {
        const response = await getCatway(catwayNumber);
        const catway = response.catway;
        document.getElementById('catway-number').value = catway.catwayNumber;
        document.getElementById('catway-type').value = catway.catwayType;
        document.getElementById('catway-state').value = catway.catwayState;
        document.getElementById('catway-available').checked = catway.isAvailable;
        document.getElementById('catway-id').value = catwayNumber;
    } catch (error) {
        alert('Erreur lors du chargement: ' + error.message);
    }
}

async function handleCatwaySubmit(e) {
    e.preventDefault();
    const catwayNumber = document.getElementById('catway-id').value;
    const data = {
        catwayNumber: parseInt(document.getElementById('catway-number').value),
        catwayType: document.getElementById('catway-type').value,
        catwayState: document.getElementById('catway-state').value,
        isAvailable: document.getElementById('catway-available').checked
    };

    try {
        if (catwayNumber) {
            await updateCatway(catwayNumber, data);
        } else {
            await createCatway(data);
        }
        closeCatwayForm();
        loadCatways();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

window.editCatway = function(catwayNumber) {
    openCatwayForm(catwayNumber);
};

window.deleteCatwayConfirm = async function(catwayNumber) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce catway ?')) {
        try {
            await deleteCatway(catwayNumber);
            loadCatways();
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }
};

// ========== RESERVATIONS ==========
async function loadReservations() {
    const listDiv = document.getElementById('reservations-list');
    if (!listDiv) return;

    listDiv.innerHTML = '<p>Chargement...</p>';

    try {
        const response = await getReservations();
        displayReservations(response.reservations);
    } catch (error) {
        listDiv.innerHTML = `<p style="color: red;">Erreur: ${error.message}</p>`;
    }
}

function displayReservations(reservations) {
    const listDiv = document.getElementById('reservations-list');
    if (!listDiv) return;

    if (reservations.length === 0) {
        listDiv.innerHTML = '<p>Aucune réservation trouvée.</p>';
        return;
    }

    listDiv.innerHTML = reservations.map(reservation => {
        const startDate = new Date(reservation.startDate).toLocaleDateString('fr-FR');
        const endDate = new Date(reservation.endDate).toLocaleDateString('fr-FR');
        const canEdit = currentUser?.role === 'admin' || 
                       (reservation.user && reservation.user._id === currentUser?._id);

        return `
            <div class="data-card">
                <h3>Réservation #${reservation._id.slice(-6)}</h3>
                <p><strong>Catway:</strong> #${reservation.catwayNumber}</p>
                <p><strong>Client:</strong> ${reservation.clientName}</p>
                <p><strong>Bateau:</strong> ${reservation.boatName}</p>
                <p><strong>Du:</strong> ${startDate}</p>
                <p><strong>Au:</strong> ${endDate}</p>
                <span class="badge ${reservation.status}">${reservation.status}</span>
                ${canEdit ? `
                    <div class="actions">
                        <button class="btn btn-primary" onclick="editReservation('${reservation._id}')">Modifier</button>
                        <button class="btn btn-danger" onclick="deleteReservationConfirm('${reservation._id}')">Supprimer</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function openReservationForm(reservationId = null) {
    const modal = document.getElementById('reservation-form-modal');
    const form = document.getElementById('reservation-form');
    const title = document.getElementById('reservation-form-title');

    if (reservationId) {
        title.textContent = 'Modifier la réservation';
        loadReservationData(reservationId);
    } else {
        title.textContent = 'Nouvelle réservation';
        form.reset();
        document.getElementById('reservation-id').value = '';
    }

    modal.style.display = 'block';
}

function closeReservationForm() {
    document.getElementById('reservation-form-modal').style.display = 'none';
}

async function loadReservationData(reservationId) {
    try {
        const response = await getReservation(reservationId);
        const reservation = response.reservation;
        
        // Convertir les dates pour l'input datetime-local
        const startDate = new Date(reservation.startDate);
        const endDate = new Date(reservation.endDate);
        
        document.getElementById('reservation-catway').value = reservation.catwayNumber;
        document.getElementById('reservation-client').value = reservation.clientName;
        document.getElementById('reservation-boat').value = reservation.boatName;
        document.getElementById('reservation-start').value = formatDateTimeLocal(startDate);
        document.getElementById('reservation-end').value = formatDateTimeLocal(endDate);
        document.getElementById('reservation-status').value = reservation.status;
        document.getElementById('reservation-id').value = reservationId;
    } catch (error) {
        alert('Erreur lors du chargement: ' + error.message);
    }
}

function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

async function handleReservationSubmit(e) {
    e.preventDefault();
    const reservationId = document.getElementById('reservation-id').value;
    const data = {
        catwayNumber: parseInt(document.getElementById('reservation-catway').value),
        clientName: document.getElementById('reservation-client').value,
        boatName: document.getElementById('reservation-boat').value,
        startDate: new Date(document.getElementById('reservation-start').value).toISOString(),
        endDate: new Date(document.getElementById('reservation-end').value).toISOString(),
        status: document.getElementById('reservation-status').value
    };

    try {
        if (reservationId) {
            await updateReservation(reservationId, data);
        } else {
            await createReservation(data);
        }
        closeReservationForm();
        loadReservations();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

window.editReservation = function(reservationId) {
    openReservationForm(reservationId);
};

window.deleteReservationConfirm = async function(reservationId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
        try {
            await deleteReservation(reservationId);
            loadReservations();
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }
};

// ========== USERS (Admin only) ==========
async function loadUsers() {
    const listDiv = document.getElementById('users-list');
    if (!listDiv) return;

    listDiv.innerHTML = '<p>Chargement...</p>';

    try {
        const response = await getUsers();
        displayUsers(response.users);
    } catch (error) {
        listDiv.innerHTML = `<p style="color: red;">Erreur: ${error.message}</p>`;
    }
}

function displayUsers(users) {
    const listDiv = document.getElementById('users-list');
    if (!listDiv) return;

    if (users.length === 0) {
        listDiv.innerHTML = '<p>Aucun utilisateur trouvé.</p>';
        return;
    }

    listDiv.innerHTML = users.map(user => `
        <div class="data-card">
            <h3>${user.name}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Rôle:</strong> ${user.role}</p>
            <p><strong>Créé le:</strong> ${new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
            <div class="actions">
                <button class="btn btn-danger" onclick="deleteUserConfirm('${user._id}')">Supprimer</button>
            </div>
        </div>
    `).join('');
}

window.deleteUserConfirm = async function(userId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        try {
            await deleteUser(userId);
            loadUsers();
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }
};

