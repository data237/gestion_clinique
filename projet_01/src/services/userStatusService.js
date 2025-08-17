import { API_BASE } from '../composants/config/apiConfig';

class UserStatusService {
    constructor() {
        this.statusUpdateCallbacks = new Map();
        this.userStatuses = new Map();
        this.updateInterval = null;
        this.isInitialized = false;
    }

    /**
     * Initialise le service de statut
     */
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Charger les statuts initiaux
            await this.loadAllUserStatuses();
            
            // Démarrer la mise à jour périodique
            this.startPeriodicUpdates();
            
            this.isInitialized = true;
            console.log('UserStatusService initialisé');
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du UserStatusService:', error);
        }
    }

    /**
     * Charge les statuts de tous les utilisateurs
     */
    async loadAllUserStatuses() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Charger les utilisateurs connectés
            const connectedResponse = await fetch(`${API_BASE}/utilisateurs/connected/last-activity`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (connectedResponse.ok) {
                const connectedUsers = await connectedResponse.json();
                connectedUsers.forEach(user => {
                    this.userStatuses.set(user.id, {
                        status: 'CONNECTE',
                        lastActivity: user.lastActivity || new Date().toISOString(),
                        isOnline: true
                    });
                });
            }

            // Charger les utilisateurs déconnectés
            const disconnectedResponse = await fetch(`${API_BASE}/utilisateurs/disconnected/last-activity`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (disconnectedResponse.ok) {
                const disconnectedUsers = await disconnectedResponse.json();
                disconnectedUsers.forEach(user => {
                    this.userStatuses.set(user.id, {
                        status: 'HORS_LIGNE',
                        lastActivity: user.lastActivity || new Date().toISOString(),
                        isOnline: false
                    });
                });
            }

            // Notifier tous les callbacks
            this.notifyStatusUpdate();
            
        } catch (error) {
            console.error('Erreur lors du chargement des statuts:', error);
        }
    }

    /**
     * Démarre les mises à jour périodiques
     */
    startPeriodicUpdates() {
        // Mettre à jour toutes les 30 secondes
        this.updateInterval = setInterval(async () => {
            await this.loadAllUserStatuses();
        }, 30000);
    }

    /**
     * Arrête les mises à jour périodiques
     */
    stopPeriodicUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Obtient le statut d'un utilisateur
     * @param {number|string} userId - ID de l'utilisateur
     * @returns {Object} Statut de l'utilisateur
     */
    getUserStatus(userId) {
        return this.userStatuses.get(userId) || {
            status: 'HORS_LIGNE',
            lastActivity: null,
            isOnline: false
        };
    }

    /**
     * Obtient le statut de plusieurs utilisateurs
     * @param {Array} userIds - IDs des utilisateurs
     * @returns {Map} Map des statuts
     */
    getUsersStatuses(userIds) {
        const statuses = new Map();
        userIds.forEach(userId => {
            statuses.set(userId, this.getUserStatus(userId));
        });
        return statuses;
    }

    /**
     * Met à jour le statut d'un utilisateur
     * @param {number|string} userId - ID de l'utilisateur
     * @param {Object} status - Nouveau statut
     */
    updateUserStatus(userId, status) {
        this.userStatuses.set(userId, {
            ...this.getUserStatus(userId),
            ...status,
            lastUpdate: new Date().toISOString()
        });
        
        this.notifyStatusUpdate();
    }

    /**
     * Marque l'utilisateur actuel comme connecté
     */
    async markCurrentUserAsConnected() {
        try {
            const userId = localStorage.getItem('id');
            if (!userId) return;

            const token = localStorage.getItem('token');
            if (!token) return;

            // Appeler l'API pour marquer l'utilisateur comme connecté
            const response = await fetch(`${API_BASE}/utilisateurs/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'CONNECTE',
                    lastActivity: new Date().toISOString()
                })
            });

            if (response.ok) {
                this.updateUserStatus(userId, {
                    status: 'CONNECTE',
                    lastActivity: new Date().toISOString(),
                    isOnline: true
                });
            }
        } catch (error) {
            console.warn('Erreur lors de la mise à jour du statut de connexion:', error);
        }
    }

    /**
     * Marque l'utilisateur actuel comme déconnecté
     */
    async markCurrentUserAsDisconnected() {
        try {
            const userId = localStorage.getItem('id');
            if (!userId) return;

            const token = localStorage.getItem('token');
            if (!token) return;

            // Appeler l'API pour marquer l'utilisateur comme déconnecté
            const response = await fetch(`${API_BASE}/utilisateurs/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'HORS_LIGNE',
                    lastActivity: new Date().toISOString()
                })
            });

            if (response.ok) {
                this.updateUserStatus(userId, {
                    status: 'HORS_LIGNE',
                    lastActivity: new Date().toISOString(),
                    isOnline: false
                });
            }
        } catch (error) {
            console.warn('Erreur lors de la mise à jour du statut de déconnexion:', error);
        }
    }

    /**
     * S'abonne aux mises à jour de statut
     * @param {string} callbackId - Identifiant unique du callback
     * @param {Function} callback - Fonction à appeler lors des mises à jour
     */
    subscribeToStatusUpdates(callbackId, callback) {
        this.statusUpdateCallbacks.set(callbackId, callback);
        
        // Appeler immédiatement avec les statuts actuels
        if (this.isInitialized) {
            callback(this.userStatuses);
        }
    }

    /**
     * Se désabonne des mises à jour de statut
     * @param {string} callbackId - Identifiant du callback à supprimer
     */
    unsubscribeFromStatusUpdates(callbackId) {
        this.statusUpdateCallbacks.delete(callbackId);
    }

    /**
     * Notifie tous les callbacks d'une mise à jour
     */
    notifyStatusUpdate() {
        this.statusUpdateCallbacks.forEach(callback => {
            try {
                callback(this.userStatuses);
            } catch (error) {
                console.error('Erreur dans le callback de statut:', error);
            }
        });
    }

    /**
     * Nettoie le service
     */
    cleanup() {
        this.stopPeriodicUpdates();
        this.statusUpdateCallbacks.clear();
        this.userStatuses.clear();
        this.isInitialized = false;
    }

    /**
     * Formate le statut pour l'affichage
     * @param {Object} status - Statut de l'utilisateur
     * @returns {Object} Statut formaté
     */
    formatStatusForDisplay(status) {
        if (!status) {
            return {
                text: 'Hors ligne',
                isOnline: false,
                lastSeen: null
            };
        }

        const isOnline = status.isOnline && status.status === 'CONNECTE';
        const lastSeen = status.lastActivity ? new Date(status.lastActivity) : null;

        return {
            text: isOnline ? 'En ligne' : 'Hors ligne',
            isOnline: isOnline,
            lastSeen: lastSeen,
            lastSeenText: lastSeen ? this.formatLastSeen(lastSeen) : null
        };
    }

    /**
     * Formate la dernière activité
     * @param {Date} lastSeen - Date de dernière activité
     * @returns {string} Texte formaté
     */
    formatLastSeen(lastSeen) {
        const now = new Date();
        const diffMs = now - lastSeen;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays < 7) return `Il y a ${diffDays}j`;
        
        return lastSeen.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Instance singleton
const userStatusService = new UserStatusService();

export default userStatusService;
