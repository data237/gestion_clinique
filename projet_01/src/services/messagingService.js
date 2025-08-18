import axios from 'axios';
import { API_BASE, WEBSOCKET_CONFIG, MESSAGING_ENDPOINTS } from '../composants/config/apiconfig';

class MessagingService {
    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.subscriptions = new Map();
        this.messageHandlers = new Map();
        this.connectionPromise = null;
    }

    // Connexion WebSocket
    async connect(retryCount = 0) {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        this.connectionPromise = new Promise((resolve, reject) => {
            try {
                console.log('Tentative de connexion WebSocket...');
                
                // Import SockJS et Stomp dynamiquement
                import('sockjs-client').then(({ default: SockJS }) => {
                    import('@stomp/stompjs').then(({ Stomp }) => {
                        // Construire l'URL WebSocket correctement
                        // Utiliser directement WS_BASE de la configuration
                        const wsUrl = MESSAGING_ENDPOINTS.WS_BASE;
                        console.log('URL WebSocket:', wsUrl);
                        console.log('API_BASE original:', API_BASE);
                        console.log('MESSAGING_ENDPOINTS.WS_BASE:', MESSAGING_ENDPOINTS.WS_BASE);
                        
                        try {
                            const socket = new SockJS(wsUrl);
                            console.log('SockJS socket créé avec succès');
                            
                            this.stompClient = Stomp.over(socket);
                            console.log('Stomp client créé avec succès');
                            
                            // Configuration de debug pour Stomp
                            this.stompClient.debug = (str) => {
                                console.log('STOMP Debug:', str);
                            };
                            
                            // Timeout de connexion
                            const connectionTimeout = setTimeout(() => {
                                console.error('Timeout de connexion WebSocket après', WEBSOCKET_CONFIG.CONNECTION.TIMEOUT, 'ms');
                                reject(new Error('Timeout de connexion WebSocket'));
                            }, WEBSOCKET_CONFIG.CONNECTION.TIMEOUT);
                            
                            console.log('Tentative de connexion Stomp...');
                            this.stompClient.connect(
                                {},
                                (frame) => {
                                    clearTimeout(connectionTimeout);
                                    console.log('WebSocket connecté avec succès:', frame);
                                    this.connected = true;
                                    this.subscribeToUserQueue();
                                    resolve();
                                },
                                (error) => {
                                    clearTimeout(connectionTimeout);
                                    console.error('Erreur WebSocket:', error);
                                    this.connected = false;
                                    
                                    // Logique de retry
                                    if (retryCount < WEBSOCKET_CONFIG.CONNECTION.RETRY_ATTEMPTS) {
                                        console.log(`Tentative de reconnexion ${retryCount + 1}/${WEBSOCKET_CONFIG.CONNECTION.RETRY_ATTEMPTS} dans ${WEBSOCKET_CONFIG.CONNECTION.RETRY_DELAY}ms...`);
                                        setTimeout(() => {
                                            this.connectionPromise = null; // Reset la promesse
                                            this.connect(retryCount + 1).then(resolve).catch(reject);
                                        }, WEBSOCKET_CONFIG.CONNECTION.RETRY_DELAY);
                                    } else {
                                        console.error('Nombre maximum de tentatives de reconnexion atteint');
                                        reject(error);
                                    }
                                }
                            );
                        } catch (socketError) {
                            console.error('Erreur lors de la création du socket SockJS:', socketError);
                            reject(socketError);
                        }
                    }).catch(importError => {
                        console.error('Erreur import Stomp:', importError);
                        reject(importError);
                    });
                }).catch(importError => {
                    console.error('Erreur import SockJS:', importError);
                    reject(importError);
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
        const userId = localStorage.getItem('id');
        if (!userId) {
            console.warn('ID utilisateur non trouvé, impossible de s\'abonner à la queue personnelle');
            return;
        }

        try {
            const subscription = this.stompClient.subscribe(
                WEBSOCKET_CONFIG.TOPICS.USER_QUEUE(userId),
                (message) => {
                    try {
                        const messageEvent = JSON.parse(message.body);
                        this.handleIncomingMessage(messageEvent);
                    } catch (parseError) {
                        console.error('Erreur parsing message:', parseError);
                    }
                }
            );

            this.subscriptions.set(`user.${userId}`, subscription);
            console.log(`Abonnement à la queue utilisateur ${userId} réussi`);
        } catch (error) {
            console.error('Erreur lors de l\'abonnement à la queue utilisateur:', error);
        }
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

        const expediteurId = localStorage.getItem('id');
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

        const expediteurId = localStorage.getItem('id');
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
            const idCreateur = localStorage.getItem('id');
            
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
        const stompConnected = this.stompClient && this.stompClient.connected;
        const serviceConnected = this.connected;
        
        console.log('Statut de connexion:', {
            serviceConnected,
            stompConnected,
            hasStompClient: !!this.stompClient,
            stompClientState: this.stompClient ? this.stompClient.connected : 'null'
        });
        
        return serviceConnected && stompConnected;
    }

    // Tester la connexion
    async testConnection() {
        try {
            console.log('Test de connexion WebSocket...');
            console.log('État actuel:', {
                connected: this.connected,
                stompClient: !!this.stompClient,
                stompConnected: this.stompClient ? this.stompClient.connected : false
            });
            
            await this.connect();
            const isConnected = this.isConnected();
            console.log('Test de connexion réussi, connecté:', isConnected);
            return isConnected;
        } catch (error) {
            console.error('Test de connexion échoué:', error);
            return false;
        }
    }

    // Obtenir le statut de connexion détaillé
    getConnectionStatus() {
        return {
            connected: this.connected,
            stompConnected: this.stompClient ? this.stompClient.connected : false,
            hasStompClient: !!this.stompClient,
            userId: localStorage.getItem('id'),
            apiBase: API_BASE,
            wsBase: MESSAGING_ENDPOINTS.WS_BASE,
            connectionPromise: !!this.connectionPromise
        };
    }
}

// Instance singleton
const messagingService = new MessagingService();
export default messagingService; 