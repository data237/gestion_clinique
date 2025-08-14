import Styled from 'styled-components'
import React, { useEffect, useState } from 'react';
import { API_BASE } from './config/apiconfig'
import axios from 'axios';
import Cloche from './cloche'
import Photoprofil from './photoprofil'

const Barrehorizontal1Style = Styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: -30px;
`
const DivStyle = Styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`
const TitreStyle = Styled.h1`
    font-family: Roboto;
    font-weight: 700;
    font-size: 40px;
    color: rgba(102, 102, 102, 1);
`
const NomDocStyle = Styled.p`
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    font-size: 1em;
`
const Contenu = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const Chemin = Styled.div`
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 1.2em;
    display: flex;
`

function Barrehorizontal1({titrepage, imgprofil1, nomprofil, children}){
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState(imgprofil1);
    const userId = localStorage.getItem('id');

    // Récupérer la photo de profil actuelle
    useEffect(() => {
        const fetchCurrentPhoto = async () => {
            const token = localStorage.getItem('token');
            
            if (userId && token) {
                try {
                    const response = await axios.get(`${API_BASE}/utilisateurs/${userId}/photo`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    
                    if (response.data) {
                        setCurrentPhotoUrl(response.data);
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération de la photo:', error);
                    // Garder la photo par défaut en cas d'erreur
                }
            }
        };

        fetchCurrentPhoto();
    }, [userId]);

    const handlePhotoUpload = async (file) => {
        try {
            // Validation du fichier
            const maxSize = 15 * 1024 * 1024; // 15MB
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            
            if (file.size > maxSize) {
                if (window.showNotification) {
                    window.showNotification('Le fichier est trop volumineux (max 15MB)', 'error');
                }
                return;
            }
            
            if (!allowedTypes.includes(file.type)) {
                if (window.showNotification) {
                    window.showNotification('Format de fichier non supporté (JPG, PNG, GIF uniquement)', 'error');
                }
                return;
            }

            if (!userId) {
                if (window.showNotification) {
                    window.showNotification('Erreur: ID utilisateur non trouvé. Veuillez vous reconnecter.', 'error');
                }
                return;
            }

            // Créer FormData pour l'upload
            const formData = new FormData();
            formData.append('photo', file);

            // Appel API pour uploader la photo
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_BASE}/utilisateurs/${userId}/photo`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                // Récupérer la nouvelle photo de profil
                try {
                    const photoResponse = await axios.get(`${API_BASE}/utilisateurs/${userId}/photo`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    
                    if (photoResponse.data) {
                        // Mettre à jour la photo dans le localStorage et l'état local
                        localStorage.setItem('photoUrl', photoResponse.data);
                        setCurrentPhotoUrl(photoResponse.data);
                    }
                } catch (photoError) {
                    console.error('Erreur lors de la récupération de la photo:', photoError);
                }

                if (window.showNotification) {
                    window.showNotification('Photo de profil mise à jour avec succès !', 'success');
                }
            }
            
        } catch (error) {
            console.error('Erreur lors de l\'upload de la photo:', error);
            let errorMessage = 'Erreur lors de l\'upload de la photo. Veuillez réessayer.';
            
            if (error.response?.status === 401) {
                errorMessage = 'Session expirée. Veuillez vous reconnecter.';
            } else if (error.response?.status === 403) {
                errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
            } else if (error.response?.status === 413) {
                errorMessage = 'Fichier trop volumineux.';
            }
            
            if (window.showNotification) {
                window.showNotification(errorMessage, 'error');
            }
        }
    };

    const handlePasswordChange = async ({ newPassword, confirmPassword }) => {
        try {
            if (!userId) {
                throw new Error('ID utilisateur non trouvé');
            }

            // Appel API pour changer le mot de passe
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_BASE}/utilisateurs/${userId}/password`, {
                newPassword: newPassword,
                confirmPassword: confirmPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Déconnexion automatique après changement de mot de passe
                if (window.showNotification) {
                    window.showNotification('Mot de passe modifié avec succès ! Vous allez être déconnecté.', 'success');
                }
                
                // Attendre un peu pour que l'utilisateur voie le message
                setTimeout(() => {
                    // Vider le localStorage
                    localStorage.clear();
                    // Rediriger vers la page de login
                    window.location.href = '/';
                }, 2000);
            }
            
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            let errorMessage = 'Erreur lors du changement de mot de passe. Veuillez réessayer.';
            
            if (error.response?.status === 401) {
                errorMessage = 'Session expirée. Veuillez vous reconnecter.';
            } else if (error.response?.status === 403) {
                errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
            } else if (error.response?.status === 400) {
                errorMessage = error.response.data?.message || 'Données invalides.';
            }
            
            throw new Error(errorMessage);
        }
    };

    return(<>
        <Barrehorizontal1Style>
            <Contenu>
                <TitreStyle>
                    {titrepage}
                </TitreStyle>
                <DivStyle>
                    <Cloche/>
                    <Photoprofil 
                        imgprofil={currentPhotoUrl}
                        onPhotoUpload={handlePhotoUpload}
                        onChangePassword={handlePasswordChange}
                        userId={userId}
                    />
                    <NomDocStyle> {nomprofil} </NomDocStyle>
                </DivStyle> 
            </Contenu>
           <Chemin>
                {children}
           </Chemin>
            
        </Barrehorizontal1Style>
            
    </>)
}

export default Barrehorizontal1