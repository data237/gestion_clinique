import '../../styles/Zonedaffichage.css'
import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import axios from 'axios';
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofilDefault from '../../assets/photoDoc.png'
import '../../styles/dashboard.css'
import '../../styles/messagerie.css'

function MessagerieSecretaire() {
    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil] = useState('')
    const [imgprofil, setImgprofil] = useState(imgprofilDefault)
    const [loading, setLoading] = useState(true)
    const [blobUrls, setBlobUrls] = useState([])

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
                    // Utiliser l'API de récupération des images par ID
                    if (response.data.id) {
                        try {
                            const photoResponse = await axios.get(`${API_BASE}/utilisateurs/${response.data.id}/photo`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                                responseType: 'blob'
                            });
                            const imageUrl = URL.createObjectURL(photoResponse.data);
                            setImgprofil(imageUrl);
                            setBlobUrls(prev => [...prev, imageUrl]);
                        } catch (photoError) {
                            // Si pas de photo, utiliser l'image par défaut
                            setImgprofil(imgprofilDefault);
                        }
                    } else {
                        setImgprofil(imgprofilDefault);
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                setImgprofil(imgprofilDefault);
            } finally {
                setLoading(false);
            }
        }
        fetchUserProfile()
    }, [idUser]);

    // Nettoyage des blobs lors du démontage du composant
    useEffect(() => {
        return () => {
            blobUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [blobUrls]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">Chargement de la messagerie...</div>
                <div className="loading-subtitle">Veuillez patienter pendant que nous préparons votre interface</div>
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
                    <h2 className='nomtable'>Messagerie secrétariat</h2>
                </div>

                {/* Divider Bar */}
                <div className='conteneurbarre'>
                    <div className='barre'></div>
                </div>

                {/* Interface de messagerie */}
                <div className="messagerie-container">
                    <div className="messagerie-header">
                        <h2 className="messagerie-title">Messagerie secrétariat</h2>
                        <div className="messagerie-actions">
                            <button className="messagerie-btn">Nouveau message</button>
                            <button className="messagerie-btn">Paramètres</button>
                        </div>
                    </div>
                    
                    <div className="messagerie-content">
                        <div className="messagerie-sidebar">
                            <div className="messagerie-contacts">
                                <h3 className="contacts-title">Contacts</h3>
                                <input 
                                    type="text" 
                                    className="contact-search" 
                                    placeholder="Rechercher un contact..."
                                />
                                <div className="contact-list">
                                    <div className="contact-item active">
                                        <img src={imgprofilDefault} alt="Contact" className="contact-avatar" />
                                        <div className="contact-info">
                                            <div className="contact-name">Dr. Martin</div>
                                            <div className="contact-status online">En ligne</div>
                                        </div>
                                    </div>
                                    <div className="contact-item">
                                        <img src={imgprofilDefault} alt="Contact" className="contact-avatar" />
                                        <div className="contact-info">
                                            <div className="contact-name">Dr. Dubois</div>
                                            <div className="contact-status offline">Hors ligne</div>
                                        </div>
                                    </div>
                                    <div className="contact-item">
                                        <img src={imgprofilDefault} alt="Contact" className="contact-avatar" />
                                        <div className="contact-info">
                                            <div className="contact-name">Admin</div>
                                            <div className="contact-status online">En ligne</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="messagerie-main">
                            <div className="messagerie-chat-header">
                                <div className="chat-contact">
                                    <img src={imgprofilDefault} alt="Contact" className="chat-contact-avatar" />
                                    <div className="chat-contact-info">
                                        <h4>Dr. Martin</h4>
                                        <div className="chat-contact-status">En ligne</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="messagerie-messages">
                                <div className="message received">
                                    <div className="message-content">
                                        Bonjour ! Pouvez-vous me confirmer le rendez-vous de 14h ?
                                    </div>
                                    <div className="message-time">09:15</div>
                                </div>
                                
                                <div className="message sent">
                                    <div className="message-content">
                                        Oui, c'est confirmé pour 14h avec Mme Dupont
                                    </div>
                                    <div className="message-time">09:17</div>
                                </div>
                                
                                <div className="message received">
                                    <div className="message-content">
                                        Parfait, merci beaucoup !
                                    </div>
                                    <div className="message-time">09:18</div>
                                </div>
                            </div>
                            
                            <div className="messagerie-input">
                                <div className="input-container">
                                    <textarea 
                                        className="message-input" 
                                        placeholder="Tapez votre message..."
                                        rows="1"
                                    />
                                    <button className="send-btn">Envoyer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MessagerieSecretaire; 