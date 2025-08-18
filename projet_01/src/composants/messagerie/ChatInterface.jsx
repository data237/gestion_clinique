import React, { useState, useEffect, useRef } from 'react';
import messagingService from '../../services/messagingService';
import imgprofilDefault from '../../assets/photoDoc.png';
import { API_BASE } from '../config/apiconfig';
import UserPhotoService from '../../services/userPhotoService';
import UserStatusIndicator from '../shared/UserStatusIndicator';

const ChatInterface = ({ selectedContact, selectedGroup, onMessageSent, messages: externalMessages, isWebSocketConnected }) => {
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    
    // Utiliser les messages externes si fournis, sinon utiliser l'état local
    const messages = externalMessages || [];

    // Scroll automatique vers le bas
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialisation du chat (plus de logique WebSocket ici)
    useEffect(() => {
        setLoading(false);
        setError(null);
    }, [selectedContact, selectedGroup]);

    // Envoyer un message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim()) return;
        
        if (!isWebSocketConnected) {
            setError('WebSocket non connecté. Impossible d\'envoyer le message.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Préparer les données du message
            const messageData = {
                contenu: newMessage.trim(),
                timestamp: new Date().toISOString()
            };

            // Notifier le composant parent qui gère l'envoi WebSocket
            if (onMessageSent) {
                await onMessageSent(messageData);
                setNewMessage(''); // Vider le champ seulement si l'envoi réussit
            }

        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            setError('Erreur lors de l\'envoi du message');
        } finally {
            setLoading(false);
        }
    };

    // Gestion de la frappe
    const handleTyping = () => {
        setIsTyping(true);
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 1000);
    };

    // Formater la date
    const formatMessageTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else {
            return date.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit' 
            });
        }
    };

    // Vérifier si le message est de l'utilisateur actuel
    const isOwnMessage = (message) => {
        return message.expediteur?.id == localStorage.getItem('id');
    };

    if (!isWebSocketConnected) {
        return (
            <div className="chat-loading">
                <div className="loading-spinner"></div>
                <p>Connexion WebSocket en cours...</p>
                <p style={{ fontSize: '12px', color: '#666' }}>Veuillez patienter</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chat-error">
                <div className="error-icon">⚠️</div>
                <p className="error-message">{error}</p>
                <button 
                    className="btn btn-primary" 
                    onClick={() => window.location.reload()}
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="chat-interface">
            {/* En-tête du chat */}
            <div className="chat-header">
                {selectedContact && (
                    <div className="chat-contact-info">
                        <img 
                            src={selectedContact.photoProfil ? 
                                `${API_BASE}/utilisateurs/${selectedContact.id}/photo` : 
                                imgprofilDefault
                            } 
                            alt="Contact" 
                            className="chat-contact-avatar"
                            onError={(e) => {
                                e.target.src = imgprofilDefault;
                            }}
                        />
                        <div className="chat-contact-details">
                            <h4>{selectedContact.prenom} {selectedContact.nom}</h4>
                            <UserStatusIndicator 
                                userId={selectedContact.id} 
                                showText={true}
                                showLastSeen={false}
                                size="small"
                            />
                        </div>
                    </div>
                )}
                
                {selectedGroup && (
                    <div className="chat-group-info">
                        <div className="chat-group-avatar">👥</div>
                        <div className="chat-group-details">
                            <h4>{selectedGroup.nom}</h4>
                            <span className="chat-group-members">
                                {selectedGroup.membres?.length || 0} membres
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Zone des messages */}
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="no-messages">
                        <div className="no-messages-icon">💬</div>
                        <p>Aucun message pour le moment</p>
                        <p className="no-messages-subtitle">
                            Commencez la conversation en envoyant un message !
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div 
                            key={message.id} 
                            className={`message-item ${isOwnMessage(message) ? 'own-message' : 'other-message'}`}
                        >
                            {!isOwnMessage(message) && (
                                <img 
                                    src={message.expediteur?.photoProfil ? 
                                        `${API_BASE}/utilisateurs/${message.expediteur.id}/photo` : 
                                        imgprofilDefault
                                    } 
                                    alt="Avatar" 
                                    className="message-avatar"
                                    onError={(e) => {
                                        e.target.src = imgprofilDefault;
                                    }}
                                />
                            )}
                            
                            <div className="message-content">
                                <div className="message-header">
                                    <span className="message-sender">
                                        {isOwnMessage(message) ? 'Vous' : 
                                         `${message.expediteur?.prenom} ${message.expediteur?.nom}`}
                                    </span>
                                    <span className="message-time">
                                        {formatMessageTime(message.timestamp)}
                                    </span>
                                </div>
                                
                                <div className="message-text">
                                    {message.contenu}
                                </div>
                                
                                {isOwnMessage(message) && (
                                    <div className="message-status">
                                        {message.lu ? '✓✓' : '✓'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                
                {isTyping && (
                    <div className="typing-indicator">
                        <span>En train d'écrire...</span>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <form className="chat-input-form" onSubmit={handleSendMessage}>
                <div className="chat-input-container">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleTyping}
                        placeholder="Tapez votre message..."
                        className="chat-input"
                        disabled={loading}
                        maxLength={1000}
                    />
                    
                    <button 
                        type="submit" 
                        className="chat-send-btn"
                        disabled={loading || !newMessage.trim()}
                    >
                        {loading ? 'Envoi...' : 'Envoyer'}
                    </button>
                </div>
                
                <div className="message-counter">
                    {newMessage.length}/1000 caractères
                </div>
            </form>
        </div>
    );
};

export default ChatInterface; 
