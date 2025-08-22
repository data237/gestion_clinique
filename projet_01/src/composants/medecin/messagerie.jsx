import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config/apiconfig';
import axios from 'axios';
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofilDefault from '../../assets/photoDoc.png'
import '../../styles/messagerie.css'
import { connectWebSocket, sendMessage, deleteMessage } from '../../services/messagerieService';

function MessagerieMedecin() {
    const idUser = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    const [nomprofil, setnomprofil] = useState('')
    const [imgprofil, setImgprofil] = useState(imgprofilDefault)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [wsStatus, setWsStatus] = useState('connecting'); // 'connecting', 'connected', 'disconnected', 'error'

    // Fonction pour vérifier si un utilisateur est l'utilisateur connecté
    const isCurrentUser = (userId) => {
        return parseInt(userId) === parseInt(idUser);
    };

    // Fonction pour obtenir le nom d'affichage d'un utilisateur
    const getUserDisplayName = (user) => {
        if (isCurrentUser(user.id)) {
            return `${user.prenom} ${user.nom} (Vous)`;
        }
        return `${user.prenom} ${user.nom}`;
    };

    // Connexion WS avec gestion du statut
    useEffect(() => {
        setWsStatus('connecting');
        console.log("🔌 Tentative de connexion WebSocket pour l'utilisateur:", idUser);
        
        connectWebSocket(idUser,
            (event) => {
                console.log("📩 Message reçu via WebSocket:", event);
                setWsStatus('connected');
                handleIncomingMessage(event);
            },
            () => {
                console.log("✅ WebSocket connecté et abonné avec succès");
                setWsStatus('connected');
            }
        );
        
        return () => {
            setWsStatus('disconnected');
            console.log("🔌 Déconnexion WebSocket");
        };
    }, [idUser]);

    const handleIncomingMessage = (event) => {
        console.log("📨 Traitement du message reçu:", event);
        const { type, message } = event;
        
        if (type === "CREATE") {
            console.log("➕ Ajout du nouveau message:", message);
            setMessages(prev => {
                const newMessages = [...prev, message];
                console.log("📝 Messages mis à jour:", newMessages);
                return newMessages;
            });
        } else if (type === "UPDATE") {
            console.log("✏️ Mise à jour du message:", message);
            setMessages(prev => prev.map(m => m.id === message.id ? message : m));
        } else if (type === "DELETE") {
            console.log("🗑️ Suppression du message:", message);
            setMessages(prev => prev.filter(m => m.id !== message.id));
        } else {
            console.log("❓ Type de message non reconnu:", type, event);
        }
    };

    // Fonction pour ajouter un message de test
    const addTestMessage = () => {
        const testMessage = {
            id: Date.now(),
            contenu: `Message de test à ${new Date().toLocaleTimeString()}`,
            expediteur: {
                id: parseInt(idUser),
                prenom: nomprofil,
                nom: ''
            },
            destinataire: {
                id: selectedContact?.id || 1,
                prenom: selectedContact?.prenom || 'Test',
                nom: selectedContact?.nom || 'User'
            },
            timestamp: new Date().toISOString(),
            lu: false
        };
        
        console.log("🧪 Ajout du message de test:", testMessage);
        setMessages(prev => [...prev, testMessage]);
    };

    // Fonction pour simuler la réception d'un message
    const simulateIncomingMessage = () => {
        const simulatedMessage = {
            id: Date.now() + 1,
            contenu: `Message simulé reçu à ${new Date().toLocaleTimeString()}`,
            expediteur: {
                id: selectedContact?.id || 1,
                prenom: selectedContact?.prenom || 'Test',
                nom: selectedContact?.nom || 'User'
            },
            destinataire: {
                id: parseInt(idUser),
                prenom: nomprofil,
                nom: ''
            },
            timestamp: new Date().toISOString(),
            lu: false
        };
        
        console.log("🎭 Simulation d'un message reçu:", simulatedMessage);
        handleIncomingMessage({ type: "CREATE", message: simulatedMessage });
    };

    // Fetch profil utilisateur connecté
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${API_BASE}/utilisateurs/${idUser}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setnomprofil(response.data.nom || '');
            } catch (error) {
                console.error(error);
                setError("Erreur lors du chargement du profil");
            } finally {
                setLoading(false);
            }
        }
        fetchUserProfile();
    }, [idUser, token]);

    // Récupération de tous les utilisateurs pour les contacts
    useEffect(() => {
        if (!loading) {
            fetchUsers();
        }
    }, [loading]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE}/utilisateurs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.data) {
                // Exclure l'utilisateur connecté de la liste des contacts
                const otherUsers = response.data.filter(user => user.id != idUser);
                
                // Ajouter les URLs des photos aux utilisateurs
                const usersWithPhotos = otherUsers.map(user => ({
                    ...user,
                    photoUrl: imgprofilDefault
                }));
                
                setUsers(usersWithPhotos);
                setFilteredUsers(usersWithPhotos);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    const handleContactSearch = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredUsers(users);
            return;
        }
        
        const filtered = users.filter(user => 
            user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleContactClick = (user) => {
        setSelectedContact(user);
    };

    const handleSendMessage = (contenu) => {
        if (!selectedContact) return;
        const message = {
            contenu,
            lu: false,
            expediteurId: parseInt(idUser),
            destinataireId: selectedContact.id
        };
        sendMessage(message);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">Chargement de la messagerie...</div>
                <div className="loading-subtitle">Veuillez patienter pendant que nous préparons votre interface</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <div className="error-title">Erreur de chargement</div>
                <div className="error-message">{error}</div>
                <button 
                    className="error-retry-btn" 
                    onClick={() => window.location.reload()}
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Header Section */}
            <div className="sous-div1">
                <Barrehorizontal1 titrepage="Messagerie" imgprofil1={imgprofil} nomprofil={nomprofil}>
                    <span className="span1">Communication</span>
                </Barrehorizontal1>
            </div>

            {/* Main Messagerie Container */}
            <div className='zonedaffichage-dashboad'>
                {/* Messagerie Header */}
                <div className='numero'>
                    <h2 className='nomtable'>Service de messagerie</h2>
                </div>

                {/* Divider Bar */}
                <div className='conteneurbarre'>
                    <div className='barre'></div>
                </div>

                {/* Interface de messagerie */}
                <div className="messagerie-container">
                    <div className="messagerie-header">
                        <h2 className="messagerie-title">
                            Messagerie - {nomprofil}
                            <span className="user-role">(Médecin)</span>
                        </h2>
                        
                        {/* Indicateur de statut WebSocket */}
                        <div className={`ws-status ${wsStatus}`}>
                            {wsStatus === 'connecting' && '🔄 Connexion...'}
                            {wsStatus === 'connected' && '✅ Connecté'}
                            {wsStatus === 'disconnected' && '❌ Déconnecté'}
                            {wsStatus === 'error' && '⚠️ Erreur de connexion'}
                        </div>
                    </div>
                    
                    {/* Boutons de test */}
                    <div className="test-buttons">
                        <button 
                            className="test-btn"
                            onClick={addTestMessage}
                            title="Ajouter un message de test"
                        >
                            🧪 Test Local
                        </button>
                        <button 
                            className="test-btn"
                            onClick={simulateIncomingMessage}
                            title="Simuler un message reçu"
                        >
                            🎭 Simuler Réception
                        </button>
                    </div>

                    <div className="messagerie-content">
                        <div className="messagerie-sidebar">
                            <div className="messagerie-contacts">
                                <h3 className="contacts-title">Contacts</h3>
                                
                                {/* Indicateur de l'utilisateur connecté */}
                                <div className="current-user-info">
                                    <img 
                                        src={imgprofil} 
                                        alt="Vous" 
                                        className="current-user-avatar"
                                    />
                                    <div className="current-user-details">
                                        <div className="current-user-name">Vous</div>
                                        <div className="current-user-email">{nomprofil}</div>
                                    </div>
                                </div>
                                
                                <input 
                                    type="text" 
                                    className="contact-search" 
                                    placeholder="Rechercher un contact..."
                                    onChange={(e) => handleContactSearch(e.target.value)}
                                />
                                
                                <div className="contact-list">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <div 
                                                key={user.id}
                                                className={`contact-item ${selectedContact?.id === user.id ? 'active' : ''}`}
                                                onClick={() => handleContactClick(user)}
                                            >
                                                <img 
                                                    src={user.photoUrl || imgprofilDefault} 
                                                    alt="Contact" 
                                                    className="contact-avatar"
                                                />
                                                <div className="contact-info">
                                                    <div className="contact-name">
                                                        {getUserDisplayName(user)}
                                                    </div>
                                                    <div className="contact-role">
                                                        {user.role || 'Utilisateur'}
                                                    </div>
                                                    <div className="contact-status">En ligne</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-contacts">
                                            Aucun contact trouvé
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="messagerie-main">
                            <div className="messagerie-chat-header">
                                {selectedContact ? (
                                    <div className="chat-contact">
                                        <img 
                                            src={selectedContact.photoUrl || imgprofilDefault} 
                                            alt="Contact" 
                                            className="chat-contact-avatar"
                                        />
                                        <div className="chat-contact-info">
                                            <h4>{getUserDisplayName(selectedContact)}</h4>
                                            <div className="contact-role">
                                                {selectedContact.role || 'Utilisateur'}
                                            </div>
                                            <div className="contact-status">En ligne</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="chat-placeholder">
                                        <div className="placeholder-icon">💬</div>
                                        <div className="placeholder-text">
                                            Sélectionnez un contact pour commencer la conversation
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {selectedContact && (
                                <div className="chat-interface">
                                    <div className="chat-messages">
                                        {messages.length > 0 ? (
                                            messages.map((msg) => (
                                                <div 
                                                    key={msg.id} 
                                                    className={`message ${isCurrentUser(msg.expediteur?.id) ? "sent" : "received"}`}
                                                >
                                                    <div className="message-header">
                                                        <span className="message-sender">
                                                            {isCurrentUser(msg.expediteur?.id) 
                                                                ? "Vous" 
                                                                : `${msg.expediteur?.prenom || 'Utilisateur'} ${msg.expediteur?.nom || ''}`
                                                            }
                                                        </span>
                                                        <span className="message-time">
                                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    <div className="message-content">
                                                        {msg.contenu}
                                                    </div>
                                                    {isCurrentUser(msg.expediteur?.id) && (
                                                        <div className="message-status">
                                                            <span className="message-status-indicator">
                                                                {msg.lu ? "✓✓ Lu" : "✓ Envoyé"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-messages">
                                                <div className="no-messages-icon">💬</div>
                                                <div className="no-messages-text">
                                                    Aucun message dans cette conversation
                                                </div>
                                                <div className="no-messages-subtext">
                                                    Commencez la conversation en envoyant un message
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="chat-input">
                                        <input 
                                            type="text" 
                                            placeholder="Écrire un message..."
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter" && e.target.value.trim()) {
                                                    handleSendMessage(e.target.value.trim());
                                                    e.target.value = "";
                                                }
                                            }}
                                        />
                                        <button 
                                            className="send-button"
                                            onClick={() => {
                                                const input = document.querySelector('.chat-input input');
                                                if (input && input.value.trim()) {
                                                    handleSendMessage(input.value.trim());
                                                    input.value = "";
                                                }
                                            }}
                                        >
                                            Envoyer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MessagerieMedecin;