import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config/apiconfig';
import axios from 'axios';
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofilDefault from '../../assets/photoDoc.png'
import '../../styles/messagerie.css'
import { connectWebSocket, sendMessage, deleteMessage } from '../../services/messagerieService';

function MessagerieSecretaire() {
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

    // Connexion WS
    useEffect(() => {
        connectWebSocket(idUser,
            (event) => {
                console.log("📩 Message reçu:", event);
                handleIncomingMessage(event);
            },
            () => console.log("Connecté et abonné")
        );
        return () => {
            // Déconnexion auto si besoin
        };
    }, [idUser]);

    const handleIncomingMessage = (event) => {
        const { type, message } = event;
        if (type === "CREATE") {
            setMessages(prev => [...prev, message]);
        } else if (type === "UPDATE") {
            setMessages(prev => prev.map(m => m.id === message.id ? message : m));
        } else if (type === "DELETE") {
            setMessages(prev => prev.filter(m => m.id !== message.id));
        }
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
                        <h2 className="messagerie-title">Clinique D'AfriK <span className='span1' style={{fontSize: '14px'}}>messagerie</span></h2>
                    </div>
                    
                    <div className="messagerie-content">
                        <div className="messagerie-sidebar">
                            <div className="messagerie-contacts">
                                <h3 className="contacts-title">Contacts</h3>
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
                                                    <div className="contact-name">{user.prenom} {user.nom}</div>
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
                                            <h4>{selectedContact.prenom} {selectedContact.nom}</h4>
                                            <div className="contact-status">En ligne</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="chat-placeholder">
                                        <div className="placeholder-icon">💬</div>
                                        <div className="placeholder-text">Sélectionnez un contact pour commencer la conversation</div>
                                    </div>
                                )}
                            </div>
                            
                            {selectedContact && (
                                <div className="chat-interface">
                                    <div className="chat-messages">
                                        {messages.map((msg) => (
                                            <div key={msg.id} className={`message ${msg.expediteur?.id == idUser ? "sent" : "received"}`}>
                                                <p>{msg.contenu}</p>
                                            </div>
                                        ))}
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

export default MessagerieSecretaire;