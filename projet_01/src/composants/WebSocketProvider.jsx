import React, { createContext, useContext, useEffect, useState } from 'react';
import messagingService from '../services/messagingService';

// Contexte pour le service de messagerie
const WebSocketContext = createContext();

// Hook personnalisé pour utiliser le service de messagerie
export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket doit être utilisé dans un WebSocketProvider');
    }
    return context;
};

// Composant provider
export const WebSocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);

    // Connexion WebSocket au montage du composant
    useEffect(() => {
        const connectWebSocket = async () => {
            try {
                setConnectionError(null);
                await messagingService.connect();
                setIsConnected(true);
                console.log('WebSocket connecté avec succès');
            } catch (error) {
                console.error('Erreur de connexion WebSocket:', error);
                setConnectionError(error.message);
                setIsConnected(false);
            }
        };

        // Se connecter seulement si l'utilisateur est authentifié
        const token = localStorage.getItem('token');
        if (token) {
            connectWebSocket();
        }

        // Nettoyage à la déconnexion
        return () => {
            messagingService.disconnect();
        };
    }, []);

    // Gérer la reconnexion automatique
    useEffect(() => {
        if (!isConnected && !connectionError) {
            const reconnectInterval = setInterval(async () => {
                try {
                    await messagingService.connect();
                    setIsConnected(true);
                    setConnectionError(null);
                    console.log('Reconnexion WebSocket réussie');
                } catch (error) {
                    console.error('Tentative de reconnexion échouée:', error);
                }
            }, 5000); // Tenter de se reconnecter toutes les 5 secondes

            return () => clearInterval(reconnectInterval);
        }
    }, [isConnected, connectionError]);

    // Écouter les changements de statut de connexion
    useEffect(() => {
        const checkConnection = () => {
            const connected = messagingService.isConnected();
            setIsConnected(connected);
        };

        // Vérifier le statut toutes les secondes
        const interval = setInterval(checkConnection, 1000);
        return () => clearInterval(interval);
    }, []);

    const value = {
        messagingService,
        isConnected,
        connectionError,
        // Méthodes utilitaires
        sendIndividualMessage: messagingService.sendIndividualMessage.bind(messagingService),
        sendGroupMessage: messagingService.sendGroupMessage.bind(messagingService),
        subscribeToGroup: messagingService.subscribeToGroup.bind(messagingService),
        addMessageHandler: messagingService.addMessageHandler.bind(messagingService),
        removeMessageHandler: messagingService.removeMessageHandler.bind(messagingService),
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketProvider;
