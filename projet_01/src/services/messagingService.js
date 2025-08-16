import axios from 'axios';
import { API_BASE, WEBSOCKET_CONFIG } from '../composants/config/apiConfig';

class MessagingService {
    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.subscriptions = new Map();
        this.messageHandlers = new Map();
        this.connectionPromise = null;
    }

    // Connexion WebSocket
    async connect() {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        this.connectionPromise = new Promise((resolve, reject) => {
            try {
                // Import SockJS et Stomp dynamiquement
                import('sockjs-client').then(({ default: SockJS }) => {
                    import('@stomp/stompjs').then(({ Stomp }) => {
                        const socket = new SockJS(`${API_BASE.replace('http', 'ws')}/ws`);
                        this.stompClient = Stomp.over(socket);
                        
                        this.stompClient.connect(
                            {},
                            (frame) => {
                                console.log('WebSocket connecté:', frame);
                                this.connected = true;
                                this.subscribeToUserQueue();
                                resolve();
                            },
                            (error) => {
                                console.error('Erreur WebSocket:', error);
                                this.connected = false;
                                reject(error);
                            }
                        );
                    });
                });
            } catch (error) {
                console.error('Erreur lors de la connexion WebSocket:', error);
                reject(error);
            }
        });

        return this.connectionPromise;
    }

    // Déconnexion
    disconnect() {
        if (this.stompClient && this.connected) {
            this.stompClient.disconnect();
            this.connected = false;
            this.subscriptions.clear();
        }
    }

    // S'abonner à la queue personnelle de l'utilisateur
    subscribeToUserQueue() {
        const userId = localStorage.getItem('idUser');
        if (!userId) return;

        const subscription = this.stompClient.subscribe(
            WEBSOCKET_CONFIG.TOPICS.USER_QUEUE(userId),
            (message) => {
                const messageEvent = JSON.parse(message.body);
                this.handleIncomingMessage(messageEvent);
            }
        );

        this.subscriptions.set(`user.${userId}`, subscription);
    }

    // S'abonner à un groupe
    subscribeToGroup(groupId) {
        if (this.subscriptions.has(`group.${groupId}`)) {
            return; // Déjà abonné
        }

        const subscription = this.stompClient.subscribe(
            WEBSOCKET_CONFIG.TOPICS.GROUP_TOPIC(groupId),
            (message) => {
                const messageEvent = JSON.parse(message.body);
                this.handleIncomingMessage(messageEvent);
            }
        );

        this.subscriptions.set(`group.${groupId}`, subscription);
    }

    // Envoyer un message individuel
    async sendIndividualMessage(destinataireId, contenu) {
        if (!this.connected) {
            await this.connect();
        }

        const expediteurId = localStorage.getItem('idUser');
        const messageData = {
            expediteurId: parseInt(expediteurId),
            destinataireId: parseInt(destinataireId),
            contenu: contenu,
            timestamp: new Date().toISOString()
        };

        this.stompClient.send(WEBSOCKET_CONFIG.ENDPOINTS.SEND_MESSAGE, {}, JSON.stringify(messageData));
        return messageData;
    }

    // Envoyer un message de groupe
    async sendGroupMessage(groupeId, contenu) {
        if (!this.connected) {
            await this.connect();
        }

        const expediteurId = localStorage.getItem('idUser');
        const messageData = {
            expediteurId: parseInt(expediteurId),
            groupeId: parseInt(groupeId),
            contenu: contenu,
            timestamp: new Date().toISOString()
        };

        this.stompClient.send(WEBSOCKET_CONFIG.ENDPOINTS.SEND_MESSAGE, {}, JSON.stringify(messageData));
        return messageData;
    }

    // Créer un groupe
    async createGroup(nom, description, idsMembres) {
        try {
            const token = localStorage.getItem('token');
            const idCreateur = localStorage.getItem('idUser');
            
            const response = await axios.post(`${API_BASE}/messagerie/groupes`, {
                nom: nom,
                description: description,
                idCreateur: parseInt(idCreateur),
                idsMembres: idsMembres.map(id => parseInt(id))
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création du groupe:', error);
            throw error;
        }
    }

    // Gérer les messages entrants
    handleIncomingMessage(messageEvent) {
        const { type, data } = messageEvent;
        
        // Notifier tous les handlers enregistrés
        this.messageHandlers.forEach((handler) => {
            try {
                handler(messageEvent);
            } catch (error) {
                console.error('Erreur dans le handler de message:', error);
            }
        });

        // Gérer les notifications push
        this.showNotification(data);
    }

    // Enregistrer un handler de message
    addMessageHandler(handler) {
        const id = Date.now().toString();
        this.messageHandlers.set(id, handler);
        return id;
    }

    // Supprimer un handler de message
    removeMessageHandler(handlerId) {
        this.messageHandlers.delete(handlerId);
    }

    // Notifications push
    showNotification(messageData) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification('Nouveau message', {
                body: `${messageData.expediteur?.prenom || 'Quelqu\'un'} : ${messageData.contenu}`,
                icon: '/favicon.ico',
                tag: 'message'
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    }

    // Vérifier le statut de connexion
    isConnected() {
        return this.connected;
    }
}

// Instance singleton
const messagingService = new MessagingService();
export default messagingService; 