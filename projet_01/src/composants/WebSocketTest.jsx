import React, { useState, useEffect } from 'react';
import messagingService from '../services/messagingService';

const WebSocketTest = () => {
    const [connectionStatus, setConnectionStatus] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);

    const testConnection = async () => {
        setIsConnecting(true);
        setError(null);
        
        try {
            console.log('=== TEST DE CONNEXION WEBSOCKET ===');
            const status = await messagingService.testConnection();
            setConnectionStatus(messagingService.getConnectionStatus());
            console.log('=== FIN DU TEST ===');
        } catch (err) {
            setError(err.message);
            console.error('Erreur de test:', err);
        } finally {
            setIsConnecting(false);
        }
    };

    const getDetailedStatus = () => {
        const status = messagingService.getConnectionStatus();
        setConnectionStatus(status);
    };

    const disconnect = () => {
        messagingService.disconnect();
        setConnectionStatus(messagingService.getConnectionStatus());
    };

    useEffect(() => {
        // Obtenir le statut initial
        getDetailedStatus();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>🔌 Test WebSocket Connection</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={testConnection} 
                    disabled={isConnecting}
                    style={{ 
                        padding: '10px 20px', 
                        marginRight: '10px',
                        backgroundColor: isConnecting ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: isConnecting ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isConnecting ? 'Connexion...' : 'Tester la Connexion'}
                </button>
                
                <button 
                    onClick={getDetailedStatus}
                    style={{ 
                        padding: '10px 20px', 
                        marginRight: '10px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Rafraîchir le Statut
                </button>
                
                <button 
                    onClick={disconnect}
                    style={{ 
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Déconnecter
                </button>
            </div>

            {error && (
                <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#f8d7da', 
                    color: '#721c24', 
                    border: '1px solid #f5c6cb', 
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    <strong>Erreur:</strong> {error}
                </div>
            )}

            {connectionStatus && (
                <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #dee2e6', 
                    borderRadius: '5px'
                }}>
                    <h3>📊 Statut de la Connexion</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div><strong>Service Connected:</strong> {connectionStatus.connected ? '✅ Oui' : '❌ Non'}</div>
                        <div><strong>Stomp Connected:</strong> {connectionStatus.stompConnected ? '✅ Oui' : '❌ Non'}</div>
                        <div><strong>Has Stomp Client:</strong> {connectionStatus.hasStompClient ? '✅ Oui' : '❌ Non'}</div>
                        <div><strong>Connection Promise:</strong> {connectionStatus.connectionPromise ? '✅ Oui' : '❌ Non'}</div>
                        <div><strong>User ID:</strong> {connectionStatus.userId || '❌ Non défini'}</div>
                        <div><strong>API Base:</strong> {connectionStatus.apiBase}</div>
                        <div><strong>WS Base:</strong> {connectionStatus.wsBase}</div>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                <p><strong>Instructions:</strong></p>
                <ol>
                    <li>Cliquez sur "Tester la Connexion" pour démarrer le test</li>
                    <li>Vérifiez la console du navigateur pour les logs détaillés</li>
                    <li>Utilisez "Rafraîchir le Statut" pour voir l'état actuel</li>
                    <li>Utilisez "Déconnecter" pour fermer la connexion</li>
                </ol>
            </div>
        </div>
    );
};

export default WebSocketTest;
