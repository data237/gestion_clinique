import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config/apiconfig';
import axios from 'axios';
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofilDefault from '../../assets/photoDoc.png'
import '../../styles/messagerie.css'
import UserPhotoService from '../../services/userPhotoService';

function MessagerieAdmin() {
    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil] = useState('')
    const [imgprofil, setImgprofil] = useState(imgprofilDefault)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [blobUrls, setBlobUrls] = useState([])
    
    // États pour l'interface graphique (statiques)
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [groups, setGroups] = useState([]);
    const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' ou 'groups'
    
    // États pour les modals
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

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

    // Récupération des utilisateurs pour la liste des contacts (affichage uniquement)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_BASE}/utilisateurs`, {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                
                if (response && response.data) {
                    // Filtrer pour exclure l'utilisateur actuel
                    const filteredUsers = response.data.filter(user => user.id !== idUser);
                    setUsers(filteredUsers);
                    setFilteredUsers(filteredUsers);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                setError('Erreur lors du chargement des utilisateurs');
            }
        };
        
        fetchUsers();
    }, [idUser]);

    // Gestion de la recherche de contacts (affichage uniquement)
    const handleSearchContacts = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user => 
                user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    // Gestion de la sélection d'un contact (affichage uniquement)
    const handleContactSelect = (contact) => {
        setSelectedContact(contact);
    };

    // Gestion de l'envoi de message (simulation d'interface)
    const handleSendMessage = async (messageText) => {
        if (!selectedContact || !messageText.trim()) return;
        
        // Simulation d'interface - pas de vraie fonctionnalité
        console.log('Interface de messagerie - Message tapé:', messageText);
        alert('Interface de messagerie - Fonctionnalité non implémentée');
    };

    // Gestion de la création de groupe (simulation d'interface)
    const handleCreateGroup = async (groupData) => {
        // Simulation d'interface - pas de vraie fonctionnalité
        console.log('Interface de messagerie - Création de groupe:', groupData);
        alert('Interface de messagerie - Fonctionnalité non implémentée');
        setShowCreateGroupModal(false);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">Chargement de la messagerie...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button onClick={() => window.location.reload()}>Réessayer</button>
            </div>
        );
    }

    return (
        <>
            <Barrehorizontal1 titrepage="Messagerie" imgprofil1={imgprofil} nomprofil={nomprofil}>
                {/* Main Messagerie Container */}
                <div className="messagerie-wrapper">
                    {/* Messagerie Header */}
                    <div className="messagerie-header">
                        <h2 className='nomtable'>Service de messagerie</h2>
                        <p className="messagerie-subtitle">
                            Interface de messagerie pour la communication interne de la clinique
                        </p>
                    </div>

                    {/* Interface de messagerie */}
                    <div className="messagerie-container">
                        <div className="messagerie-header">
                            <h2 className="messagerie-title">Clinique D'AfriK <span className='span1' style={{fontSize: '14px'}}>messagerie</span></h2>
                            <div className="messagerie-actions">
                                <button 
                                    className="messagerie-btn"
                                    onClick={() => setShowNewMessageModal(true)}
                                >
                                    Nouveau message
                                </button>
                                <button 
                                    className="messagerie-btn"
                                    onClick={() => setShowCreateGroupModal(true)}
                                >
                                    Créer un groupe
                                </button>
                            </div>
                        </div>

                        <div className="messagerie-content">
                            <div className="messagerie-sidebar">
                                <div className="messagerie-tabs">
                                    <button 
                                        className={`messagerie-tab ${activeTab === 'contacts' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('contacts')}
                                    >
                                        Contacts
                                    </button>
                                    <button 
                                        className={`messagerie-tab ${activeTab === 'groups' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('groups')}
                                    >
                                        Groupes
                                    </button>
                                </div>

                                {activeTab === 'contacts' && (
                                    <div className="messagerie-contacts">
                                        <div className="search-container">
                                            <input 
                                                type="text" 
                                                placeholder="Rechercher un contact..."
                                                onChange={(e) => handleSearchContacts(e.target.value)}
                                                className="search-input"
                                            />
                                        </div>
                                        <div className="contacts-list">
                                            {filteredUsers.map(user => (
                                                <div 
                                                    key={user.id}
                                                    className={`contact-item ${selectedContact?.id === user.id ? 'selected' : ''}`}
                                                    onClick={() => handleContactSelect(user)}
                                                >
                                                    <div className="contact-avatar">
                                                        <img 
                                                            src={user.photoProfil || imgprofilDefault} 
                                                            alt={`${user.nom} ${user.prenom}`}
                                                            onError={(e) => e.target.src = imgprofilDefault}
                                                        />
                                                    </div>
                                                    <div className="contact-info">
                                                        <div className="contact-name">{user.nom} {user.prenom}</div>
                                                        <div className="contact-role">{user.role}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'groups' && (
                                    <div className="messagerie-groups">
                                        <div className="groups-list">
                                            {groups.length === 0 ? (
                                                <div className="no-groups">
                                                    <p>Aucun groupe créé</p>
                                                    <button 
                                                        className="create-group-btn"
                                                        onClick={() => setShowCreateGroupModal(true)}
                                                    >
                                                        Créer le premier groupe
                                                    </button>
                                                </div>
                                            ) : (
                                                groups.map(group => (
                                                    <div key={group.id} className="group-item">
                                                        <div className="group-name">{group.nom}</div>
                                                        <div className="group-members">{group.membres?.length || 0} membres</div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="messagerie-main">
                                <div className="messagerie-chat-header">
                                    {selectedContact ? (
                                        <div className="chat-contact-info">
                                            <div className="contact-avatar">
                                                <img 
                                                    src={selectedContact.photoProfil || imgprofilDefault} 
                                                    alt={`${selectedContact.nom} ${selectedContact.prenom}`}
                                                    onError={(e) => e.target.src = imgprofilDefault}
                                                />
                                            </div>
                                            <div className="contact-details">
                                                <div className="contact-name">{selectedContact.nom} {selectedContact.prenom}</div>
                                                <div className="contact-role">{selectedContact.role}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="no-contact-selected">
                                            <p>Sélectionnez un contact pour commencer une conversation</p>
                                        </div>
                                    )}
                                </div>

                                <div className="messagerie-chat-area">
                                    {selectedContact ? (
                                        <div className="chat-messages">
                                            <div className="message-list">
                                                <div className="no-messages">
                                                    <p>Aucun message dans cette conversation</p>
                                                    <p>Commencez à discuter avec {selectedContact.nom} !</p>
                                                </div>
                                            </div>
                                            <div className="message-input-container">
                                                <input 
                                                    type="text" 
                                                    placeholder="Tapez votre message..."
                                                    className="message-input"
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                                            handleSendMessage(e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    className="send-button"
                                                    onClick={() => {
                                                        const input = document.querySelector('.message-input');
                                                        if (input && input.value.trim()) {
                                                            handleSendMessage(input.value);
                                                            input.value = '';
                                                        }
                                                    }}
                                                >
                                                    Envoyer
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="welcome-message">
                                            <h3>Bienvenue dans la messagerie</h3>
                                            <p>Sélectionnez un contact dans la liste pour commencer une conversation</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Barrehorizontal1>
        </>
    );
}

export default MessagerieAdmin; 
