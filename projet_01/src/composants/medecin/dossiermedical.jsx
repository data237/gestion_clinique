import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_BASE } from '../config/apiconfig';
import '../../styles/Zonedaffichage.css';
import '../../styles/buttons.css';
import '../../styles/dossiermedical.css';




const DossierMedical = () => {
    console.log('Composant DossierMedical chargé');
    const { patientId } = useParams();
    const navigate = useNavigate();
    console.log('ID patient depuis useParams:', patientId);
    
    const [dossierMedical, setDossierMedical] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const [consultationDetails, setConsultationDetails] = useState(null);
    const [consultationLoading, setConsultationLoading] = useState(false);

    useEffect(() => {
        const fetchDossierMedical = async () => {
            try {
                console.log('Début du chargement du dossier médical');
                console.log('ID reçu depuis useParams:', patientId);
                setLoading(true);
                const token = localStorage.getItem('token');
                console.log('Token:', token ? 'Présent' : 'Absent');
                
                // L'ID reçu peut être soit un patientId valide, soit un idrendezvous
                // Nous allons essayer de l'utiliser directement comme ID de patient
                const idToUse = patientId;
                console.log('Utilisation de l\'ID pour récupérer le dossier médical:', idToUse);
                
                // Récupérer le dossier médical avec l'ID
                console.log('URL API dossier médical:', `${API_BASE}/dossierMedical/patient/${idToUse}`);
                
                const dossierResponse = await axios.get(`${API_BASE}/dossierMedical/patient/${idToUse}`, {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                
                console.log('Réponse API dossier médical:', dossierResponse);
                
                if (dossierResponse.data) {
                    console.log('Données du dossier médical reçues:', dossierResponse.data);
                    setDossierMedical(dossierResponse.data);
                } else {
                    console.log('Aucune donnée de dossier médical reçue');
                    setError('Aucun dossier médical trouvé');
                }
                setLoading(false);
            } catch (err) {
                console.error('Erreur lors du chargement du dossier médical:', err);
                console.error('Détails de l\'erreur:', err.response?.data || err.message);
                setError("Erreur lors du chargement du dossier médical");
                setLoading(false);
            }
        };

        fetchDossierMedical();
    }, [patientId]);

    // Fonction pour récupérer les détails d'une consultation
    const fetchConsultationDetails = async (consultationId) => {
        try {
            setConsultationLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.get(`${API_BASE}/consultations/${consultationId}`, {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.data) {
                setConsultationDetails(response.data);
                setSelectedConsultation(consultationId);
                setPopupOpen(true);
            }
        } catch (err) {
            console.error('Erreur lors du chargement des détails de la consultation:', err);
            alert('Erreur lors du chargement des détails de la consultation');
        } finally {
            setConsultationLoading(false);
        }
    };

    const closePopup = () => {
        setPopupOpen(false);
        setSelectedConsultation(null);
        setConsultationDetails(null);
    };

    console.log('Rendu du composant - Loading:', loading, 'Error:', error, 'DossierMedical:', dossierMedical);
    
    if (loading) {
        return (
            <div className="zone-affichage">
                <div className="loading-container">
                    Chargement du dossier médical...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="zone-affichage">
                <div className="error-container">
                    {error}
                </div>
            </div>
        );
    }



    if (!dossierMedical) {
        return (
            <div className="zone-affichage">
                <div className="no-data-container">
                    Aucun dossier médical trouvé
                </div>
            </div>
        );
    }

    return (
        <div className="zone-affichage">
            <div className="dossier-medical-container">
                {/* En-tête */}
                <div className="dossier-medical-header">
                    <h1 className="dossier-medical-title">
                        Dossier médical de <span className="name-patient"> {dossierMedical.patient?.nom + " " + dossierMedical.patient?.prenom || 'Patient'}</span>
                    </h1>
                </div>

                {/* Informations personnelles */}
                <div className="dossier-medical-section">
                    <h2>Informations personnelles</h2>
                    <div className="info-grid box-shadow">
                        <div className="info-item">
                            <span className="info-label">Nom et prénom:</span>
                            <span className="info-value">{dossierMedical.patient?.nom +" "+ dossierMedical.patient?.prenom || 'Non spécifié'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Date de naissance:</span>
                            <span className="info-value">{dossierMedical.patient?.dateNaissance || 'Non spécifié'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Age:</span>
                            <span className="info-value">{dossierMedical.patient?.age || 'Non spécifié'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Sexe:</span>
                            <span className="info-value">{dossierMedical.patient?.genre || 'Non spécifié'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Adresse:</span>
                            <span className="info-value">{dossierMedical.patient?.adresse || 'Non spécifié'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{dossierMedical.patient?.email || 'Non spécifié'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Groupe sanguin:</span>
                            <span className="info-value">{dossierMedical.patient?.groupeSanguin || 'Non spécifié'}</span>
                        </div>
                    </div>
                </div>

                                {/* Allergies et antécédents médicaux */}
                <div className="dossier-medical-section">
                    <h2>Allergies et antécédents médicaux</h2>
                    
                    <div className="box-shadow allergie-antecedent">
                    <div>
                        <h3>Allergies:</h3>
                        <ul className="info-list box">
                            {dossierMedical?.allergies ? (
                                <li className="no-data">{dossierMedical.allergies}</li>
                            ) : (
                                <li className="no-data">Aucune allergie connue</li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h3>Antécédents médicaux:</h3>
                        <ul className="info-list box">
                            {dossierMedical?.antecedents ? (
                                <li>{dossierMedical.antecedents}</li>
                            ) : (
                                <li className="no-data">Aucun antécédent médical</li>
                            )}
                        </ul>
                    </div>
                    </div>
                </div>

                                {/* Traitement */}
                <div className="dossier-medical-section">
                    <h2>Traitement</h2>

                    <div className="box-shadow">
                        <h3>Dernier traitement:</h3>
                        <ul className="info-list box">
                            {dossierMedical?.dernierTraitement ? (
                                <li>{dossierMedical.dernierTraitement}</li>
                            ) : (
                                <li className="no-data">Aucun traitement récent</li>
                            )}
                        </ul>
                    </div>

                    <div className="box-shadow">
                        <h3>Anciennes consultations:</h3>
                        <div className="consultations-grid">
                            {dossierMedical?.consultations && dossierMedical.consultations.length > 0 ? (
                                dossierMedical.consultations.map((consultation, index) => (
                                    <div 
                                        key={index} 
                                        className="consultation-card"
                                        onClick={() => fetchConsultationDetails(consultation.id)}
                                    >
                                        <div className="consultation-date">
                                            {new Date(consultation.dateConsultation).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="consultation-info">
                                            <strong>Motifs:</strong>
                                            <span> {consultation.motifs || 'Non spécifié'}</span>
                                        </div>
                                        <div className="consultation-info">
                                            <strong>Diagnostic:</strong>
                                            <span> {consultation.diagnostic || 'Non spécifié'}</span>
                                        </div>
                                        <div className="consultation-hint">
                                            Cliquez pour voir les détails complets
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-consultations">
                                    Aucune consultation précédente trouvée
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="action-buttons">
                    <button
                        className="btn-primary"
                        onClick={() => navigate(`/medecin/rendezvous/consultation/${patientId}`)}
                    >
                        Créer une consultation
                    </button>
                    
                    <button
                        className="btn-secondary"
                        onClick={() => navigate('/medecin/rendezvous')}
                    >
                        Retour aux rendez-vous
                    </button>
                </div>
            </div>

            {/* Popup pour afficher les détails de la consultation */}
            <div className={`popup-overlay ${popupOpen ? '' : 'hidden'}`} onClick={closePopup}>
                <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                    <button className="popup-close-btn" onClick={closePopup}>&times;</button>
                    
                    {consultationLoading ? (
                        <div className="loading-container">
                            Chargement des détails...
                        </div>
                    ) : consultationDetails ? (
                        <div>
                            <h2 className="popup-title">
                                Détails de la consultation
                            </h2>
                            
                            {/* Informations de base */}
                            <div className="popup-section">
                                <h3>Informations générales</h3>
                                <div className="popup-info-grid">
                                    <div>
                                        <strong>Date:</strong>
                                        <span> {new Date(consultationDetails.dateConsultation).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </div>
                                    {consultationDetails.motifs && (
                                        <div>
                                            <strong>Motifs:</strong>
                                            <span> {consultationDetails.motifs}</span>
                                        </div>
                                    )}
                                    {consultationDetails.diagnostic && (
                                        <div>
                                            <strong>Diagnostic:</strong>
                                            <span> {consultationDetails.diagnostic}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Observations et examens */}
                            {consultationDetails.observations && (
                                <div className="popup-section">
                                    <h3>Observations et examens</h3>
                                    <div className="popup-text">
                                        {consultationDetails.observations}
                                    </div>
                                </div>
                            )}

                            {/* Prescriptions */}
                            {consultationDetails.prescriptions && consultationDetails.prescriptions.length > 0 && (
                                <div className="popup-section">
                                    <h3>Prescriptions</h3>
                                    <ul className="popup-list">
                                        {consultationDetails.prescriptions.map((prescription, index) => (
                                            <li key={index}>
                                                <strong>{prescription.medicament}</strong>
                                                {prescription.posologie && (
                                                    <span> - {prescription.posologie}</span>
                                                )}
                                                {prescription.duree && (
                                                    <span> ({prescription.duree})</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Recommandations */}
                            {consultationDetails.recommandations && (
                                <div className="popup-section">
                                    <h3>Recommandations</h3>
                                    <div className="popup-text">
                                        {consultationDetails.recommandations}
                                    </div>
                                </div>
                            )}

                            {/* Bouton de fermeture */}
                            <div className="popup-close-container">
                                <button className="btn-primary" onClick={closePopup}>
                                    Fermer
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="error-container">
                            Erreur lors du chargement des détails
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DossierMedical;