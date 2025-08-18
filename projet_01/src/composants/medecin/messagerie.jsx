import React, { useEffect, useState, useRef } from 'react';
import { API_BASE, WEBSOCKET_CONFIG } from '../config/apiconfig';
import axios from 'axios';
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofilDefault from '../../assets/photoDoc.png'
import '../../styles/messagerie.css'
import UserSelectionModal from '../messagerie/UserSelectionModal';
import CreateGroupModal from '../messagerie/CreateGroupModal';
import NewMessageModal from '../messagerie/NewMessageModal';
import ChatInterface from '../messagerie/ChatInterface';
import UserPhotoService from '../../services/userPhotoService';
import UserStatusIndicator from '../shared/UserStatusIndicator';
import messagingService from '../../services/messagingService';

function MessagerieMedecin() {
    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil] = useState('')
    const [imgprofil, setImgprofil] = useState(imgprofilDefault)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [blobUrls, setBlobUrls] = useState([])
    
    // États pour la messagerie
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [groups, setGroups] = useState([]);
    const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' ou 'groups'
    
    // États pour les modals
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    
    // États pour la connexion WebSocket
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const [webSocketError, setWebSocketError] = useState(null);
    const [messages, setMessages] = useState([]);
    
    // Références pour la gestion WebSocket
    const messageHandlerId = useRef(null);
    const userSubscription = useRef(null);
    const groupSubscriptions = useRef(new Map());

    // Récupération du nom et de la photo de profil de l'utilisateur connecté
    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${API_BASE}/utilisateurs/${idUser}`,
                    {
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                if (response && response.data) {
                    setnomprofil(response.data.nom || '')
                    // Utiliser le service amélioré pour récupérer la photo
                    if (response.data.id && response.data.photoProfil) {
                        try {
                            const photoUrl = await UserPhotoService.getUserPhotoBlob(response.data.id, response.data.photoProfil);
                            setImgprofil(photoUrl);
                            if (photoUrl !== imgprofilDefault) {
                                setBlobUrls(prev => [...prev, photoUrl]);
                            }
                        } catch (photoError) {
                            console.warn('Erreur lors de la récupération de la photo:', photoError);
                            setImgprofil(imgprofilDefault);
                        }
                    } else {
                        setImgprofil(imgprofilDefault);
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                setImgprofil(imgprofilDefault);
                setError('Erreur lors du chargement du profil utilisateur');
            } finally {
                setLoading(false);
            }
        }
        fetchUserProfile()
    }, [idUser]);

    // Nettoyage des blobs lors du démontage du composant
    useEffect(() => {
        return () => {
            UserPhotoService.revokeBlobUrls(blobUrls);
        };
    }, [blobUrls]);

    // Connexion WebSocket et gestion des messages
    useEffect(() => {
        const initializeWebSocket = async () => {
            try {
                console.log('Initialisation de la connexion WebSocket...');
                setWebSocketError(null);
                
                // Se connecter au service de messagerie
                await messagingService.connect();
                setIsWebSocketConnected(true);
                console.log('✅ Connexion WebSocket établie');
                
                // S'abonner à la queue personnelle de l'utilisateur
                const userId = localStorage.getItem('id');
                if (userId) {
                    userSubscription.current = messagingService.stompClient.subscribe(
                        WEBSOCKET_CONFIG.TOPICS.USER_QUEUE(userId),
                        (message) => {
                            try {
                                const messageEvent = JSON.parse(message.body);
                                console.log('📨 Message reçu:', messageEvent);
                                handleIncomingMessage(messageEvent);
                            } catch (parseError) {
                                console.error('Erreur parsing message:', parseError);
                            }
                        }
                    );
                    console.log(`🔔 Abonnement à la queue utilisateur ${userId}`);
                }
                
                // Enregistrer le handler de messages
                messageHandlerId.current = messagingService.addMessageHandler((messageEvent) => {
                    console.log('📨 Message via handler:', messageEvent);
                    handleIncomingMessage(messageEvent);
                });
                
            } catch (error) {
                console.error('❌ Erreur lors de l\'initialisation WebSocket:', error);
                setWebSocketError(error.message);
                setIsWebSocketConnected(false);
            }
        };

        if (!loading) {
            initializeWebSocket();
        }

        // Nettoyage lors du démontage
        return () => {
            console.log('🧹 Nettoyage des connexions WebSocket...');
            
            // Supprimer le handler de messages
            if (messageHandlerId.current) {
                messagingService.removeMessageHandler(messageHandlerId.current);
            }
            
            // Se désabonner de la queue utilisateur
            if (userSubscription.current) {
                userSubscription.current.unsubscribe();
            }
            
            // Se désabonner des groupes
            groupSubscriptions.current.forEach((subscription) => {
                subscription.unsubscribe();
            });
            
            // Déconnecter le service
            messagingService.disconnect();
        };
    }, [loading]);

    // Récupération de tous les utilisateurs pour les contacts
    useEffect(() => {
        if (!loading) {
            fetchUsers();
            fetchContactsWithConversations();
        }
    }, [loading]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
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
                    photoUrl: UserPhotoService.getUserPhotoUrl(user.id, user.photoProfil)
                }));
                
                setUsers(usersWithPhotos);
                setFilteredUsers(usersWithPhotos);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    // Nouvelle fonction pour récupérer les contacts avec des conversations existantes
    const fetchContactsWithConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // TODO: Remplacer par l'endpoint réel une fois disponible
            // Pour l'instant, on utilise un placeholder qui simule des conversations existantes
            // Endpoint suggéré: GET /Api/V1/clinique/messagerie/conversations/{userId}
            
            // Simulation: on considère qu'il y a des conversations avec les 3 premiers utilisateurs
            // En production, cela devrait être remplacé par un vrai appel API
            if (users.length > 0) {
                const usersWithConversations = users.slice(0, 3); // Simulation
                setFilteredUsers(usersWithConversations);
            }
            
            // Code pour l'endpoint réel (à décommenter une fois disponible):
            /*
            const response = await axios.get(`${API_BASE}/messagerie/conversations/${idUser}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.data) {
                // Filtrer pour ne montrer que les utilisateurs avec des conversations
                const contactsWithConversations = response.data.map(conversation => 
                    users.find(user => user.id === conversation.otherUserId)
                ).filter(Boolean);
                
                setFilteredUsers(contactsWithConversations);
            }
            */
            
        } catch (error) {
            console.error('Erreur lors de la récupération des conversations:', error);
            // En cas d'erreur, on affiche tous les utilisateurs comme fallback
            setFilteredUsers(users);
        }
    };

    const handleContactSearch = (searchTerm) => {
        if (!searchTerm.trim()) {
            // Si on est dans l'onglet contacts, on affiche seulement ceux avec des conversations
            if (activeTab === 'contacts') {
                fetchContactsWithConversations();
            } else {
                setFilteredUsers(users);
            }
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

    // Gérer les messages entrants
    const handleIncomingMessage = (messageEvent) => {
        console.log('📨 Traitement message entrant:', messageEvent);
        
        const { type, data } = messageEvent;
        
        if (type === 'CREATE') {
            // Nouveau message
            setMessages(prev => [...prev, data]);
            
            // Si le message est pour l'utilisateur actuel, l'ajouter à la conversation
            if (data.destinataireId === parseInt(localStorage.getItem('id'))) {
                console.log('📨 Message reçu pour cet utilisateur');
                // Ici vous pouvez ajouter la logique pour afficher le message
            }
        } else if (type === 'UPDATE') {
            // Message modifié
            setMessages(prev => prev.map(msg => 
                msg.id === data.id ? data : msg
            ));
        } else if (type === 'DELETE') {
            // Message supprimé
            setMessages(prev => prev.filter(msg => msg.id !== data.id));
        }
    };

    const handleNewMessage = async (messageData) => {
        console.log('📤 Nouveau message à envoyer:', messageData);
        
        try {
            if (!isWebSocketConnected) {
                throw new Error('WebSocket non connecté');
            }
            
            let sentMessage;
            
            if (selectedContact) {
                // Message individuel
                sentMessage = await messagingService.sendIndividualMessage(
                    selectedContact.id,
                    messageData.contenu
                );
                console.log('✅ Message individuel envoyé:', sentMessage);
            } else if (messageData.groupeId) {
                // Message de groupe
                sentMessage = await messagingService.sendGroupMessage(
                    messageData.groupeId,
                    messageData.contenu
                );
                console.log('✅ Message de groupe envoyé:', sentMessage);
            }
            
            // Ajouter le message localement
            if (sentMessage) {
                const localMessage = {
                    id: Date.now(),
                    contenu: messageData.contenu,
                    expediteur: {
                        id: localStorage.getItem('id'),
                        prenom: 'Vous',
                        nom: ''
                    },
                    timestamp: new Date().toISOString(),
                    lu: false
                };
                
                setMessages(prev => [...prev, localMessage]);
            }
            
            // Si c'est le démarrage d'une conversation, sélectionner le contact
            if (messageData.action === 'start_conversation' && messageData.recipients?.length > 0) {
                setSelectedContact(messageData.recipients[0]);
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi du message:', error);
            setWebSocketError(`Erreur d'envoi: ${error.message}`);
        }
    };

    const handleGroupCreated = (groupData) => {
        console.log('Groupe créé:', groupData);
        // Ici vous pouvez ajouter la logique pour ajouter le groupe à la liste
        setGroups(prev => [...prev, groupData]);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'contacts') {
            // Onglet Contacts: afficher seulement les utilisateurs avec des conversations
            fetchContactsWithConversations();
        } else {
            // Onglet Groupes: afficher tous les utilisateurs pour la création de groupes
            setFilteredUsers(users);
        }
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
                        <h2 className="messagerie-title">Clinique D'AfriK <span className='span1' style={{fontSize: '14px'}}>messagerie médicale</span></h2>
                        <div className="messagerie-actions">
                            {/* Indicateur de statut WebSocket */}
                            <div className="websocket-status" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                backgroundColor: isWebSocketConnected ? '#d4edda' : '#f8d7da',
                                color: isWebSocketConnected ? '#155724' : '#721c24',
                                border: '1px solid',
                                borderColor: isWebSocketConnected ? '#c3e6cb' : '#f5c6cb'
                            }}>
                                <span>{isWebSocketConnected ? '🔌' : '❌'}</span>
                                <span>{isWebSocketConnected ? 'Connecté' : 'Déconnecté'}</span>
                            </div>
                            
                            <button 
                                className="messagerie-btn" 
                                onClick={() => setShowNewMessageModal(true)}
                                disabled={!isWebSocketConnected}
                            >
                                Nouveau message
                            </button>
                            <button 
                                className="messagerie-btn" 
                                onClick={() => setShowCreateGroupModal(true)}
                                disabled={!isWebSocketConnected}
                            >
                                Créer un groupe
                            </button>
                        </div>
                    </div>
                    
                    <div className="messagerie-content">
                        <div className="messagerie-sidebar">
                            {/* Onglets Contacts/Groups */}
                            <div className="messagerie-tabs">
                                <button 
                                    className={`messagerie-tab ${activeTab === 'contacts' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('contacts')}
                                >
                                    Contacts
                                </button>
                                <button 
                                    className={`messagerie-tab ${activeTab === 'groups' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('groups')}
                                >
                                    Groupes
                                </button>
                            </div>

                            {activeTab === 'contacts' ? (
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
                                                        onError={(e) => {
                                                            UserPhotoService.handleImageError(e, imgprofilDefault);
                                                        }}
                                                    />
                                                                                                            <div className="contact-info">
                                                            <div className="contact-name">{user.prenom} {user.nom}</div>
                                                            <UserStatusIndicator 
                                                                userId={user.id} 
                                                                showText={true}
                                                                showLastSeen={false}
                                                                size="small"
                                                            />
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
                            ) : (
                                <div className="messagerie-groups">
                                    <h3 className="contacts-title">Groupes</h3>
                                    <div className="group-list">
                                        {groups.length > 0 ? (
                                            groups.map((group) => (
                                                <div key={group.id} className="group-item">
                                                    <div className="group-info">
                                                        <div className="group-name">{group.nom}</div>
                                                        <div className="group-description">{group.description}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-groups">
                                                Aucun groupe créé
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="messagerie-main">
                            <div className="messagerie-chat-header">
                                {selectedContact ? (
                                    <div className="chat-contact">
                                        <img 
                                            src={selectedContact.photoUrl || imgprofilDefault} 
                                            alt="Contact" 
                                            className="chat-contact-avatar"
                                            onError={(e) => {
                                                UserPhotoService.handleImageError(e, imgprofilDefault);
                                            }}
                                        />
                                        <div className="chat-contact-info">
                                            <h4>{selectedContact.prenom} {selectedContact.nom}</h4>
                                            <UserStatusIndicator 
                                                userId={selectedContact.id} 
                                                showText={true}
                                                showLastSeen={true}
                                                size="medium"
                                            />
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
                                <>
                                    {webSocketError && (
                                        <div className="websocket-error" style={{
                                            padding: '10px',
                                            margin: '10px',
                                            backgroundColor: '#f8d7da',
                                            border: '1px solid #f5c6cb',
                                            borderRadius: '4px',
                                            color: '#721c24'
                                        }}>
                                            <strong>Erreur WebSocket:</strong> {webSocketError}
                                            <button 
                                                onClick={() => setWebSocketError(null)}
                                                style={{
                                                    marginLeft: '10px',
                                                    padding: '4px 8px',
                                                    backgroundColor: '#721c24',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                    
                                    <ChatInterface 
                                        selectedContact={selectedContact}
                                        onMessageSent={handleNewMessage}
                                        messages={messages}
                                        isWebSocketConnected={isWebSocketConnected}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <NewMessageModal
                isOpen={showNewMessageModal}
                onClose={() => setShowNewMessageModal(false)}
                onMessageSent={handleNewMessage}
            />

            <CreateGroupModal
                isOpen={showCreateGroupModal}
                onClose={() => setShowCreateGroupModal(false)}
                onGroupCreated={handleGroupCreated}
            />
        </>
    );
}

export default MessagerieMedecin; 
