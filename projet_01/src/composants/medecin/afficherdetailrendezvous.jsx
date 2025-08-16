import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../composants/config/apiconfig';
import axiosInstance from '../config/axiosConfig';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import { useParams, useNavigate } from 'react-router-dom';
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png';

const SousDiv1Style = Styled.div`
  width: 99%;
  padding-left: 1%;
`;

const Span2 = Styled.span``;

const Span1 = Styled.span`
  cursor: pointer;
`;

const Affichedetailuser = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = Styled.div`
  position: relative;
  overflow: hidden;
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  font-family: sans-serif;
  border: 1px solid rgba(217, 217, 217, 1);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${fondImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.1;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const Title = Styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title1 = Styled.h2`
  margin-bottom: 0px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  padding-bottom: 10px;
  font-family: Roboto;
`;

const Title2 = Styled.h2`
  margin-bottom: 0px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(159, 159, 255, 1);
  padding-bottom: 10px;
  font-family: Roboto;
  cursor: pointer;
`;

const TraitHorizontal = Styled.div`
  width: 718px;
  height: 5px;
  border-radius: 2.5px;
  background-color: rgba(159, 159, 255, 1);
  margin-bottom: 20px;
`;

const FormRow = Styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const FormGroup = Styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Form = Styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = Styled.label`
  font-size: 14px;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
  margin-bottom: 5px;
  font-family: Roboto;
`;

const Input = Styled.input`
  padding: 12px;
  border: 1px solid rgba(217, 217, 217, 1);
  border-radius: 8px;
  font-size: 14px;
  font-family: Roboto;
  
  &:focus {
    outline: none;
    border-color: rgba(159, 159, 255, 1);
  }
`;

const ButtonContainer = Styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = Styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: Roboto;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const PrimaryButton = Styled(Button)`
  background-color: rgba(65, 65, 255, 1);
  color: white;
  border: 1px solid rgba(65, 65, 255, 1);
  
  &:hover {
    background-color: rgba(45, 45, 235, 1);
  }
`;

const SecondaryButton = Styled(Button)`
  background-color: rgba(159, 159, 255, 1);
  color: white;
  border: 1px solid rgba(159, 159, 255, 1);
  
  &:hover {
    background-color: rgba(139, 139, 235, 1);
  }
`;

const ReturnButton = Styled(Button)`
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  
  &:hover {
    background-color: #f5f5f5;
    border-color: #999;
  }
`;

const DisabledButton = Styled(Button)`
  background-color: #cccccc;
  color: #666666;
  border: 1px solid #cccccc;
  cursor: not-allowed;
  opacity: 0.6;
  
  &:hover {
    background-color: #cccccc;
    color: #666666;
    transform: none;
    box-shadow: none;
  }
`;












const AfficherDetailRendezvous = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rendezvous, setRendezvous] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fonction pour vérifier si le rendez-vous est dans le futur
  const isRendezvousFutur = () => {
    if (!rendezvous || !rendezvous.jour) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure à 00:00:00
    
    const rdvDate = new Date(rendezvous.jour);
    rdvDate.setHours(0, 0, 0, 0); // Réinitialiser l'heure à 00:00:00
    
    return rdvDate > today;
  };
  
  // Fonction pour vérifier si le rendez-vous est aujourd'hui mais dans le futur
  const isRendezvousAujourdhuiFutur = () => {
    if (!rendezvous || !rendezvous.jour || !rendezvous.heure) return false;
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    if (rendezvous.jour !== todayString) return false;
    
    const now = new Date();
    const rdvTime = new Date(`${rendezvous.jour}T${rendezvous.heure}`);
    
    return rdvTime > now;
  };
  
  // État pour suivre si le bouton a été cliqué et doit être désactivé
  const [buttonClicked, setButtonClicked] = useState(false);
  
  // Fonction pour vérifier si le bouton consultation doit être désactivé
  const isConsultationDisabled = () => {
    return buttonClicked && (isRendezvousFutur() || isRendezvousAujourdhuiFutur());
  };



  useEffect(() => {
    const fetchRendezvous = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${API_BASE}/rendezvous/${id}`);
        setRendezvous(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération du rendez-vous:', err);
        setError('Erreur lors du chargement du rendez-vous');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRendezvous();
    }
  }, [id]);

  const handleRetour = () => {
    // Utiliser la date du rendez-vous affiché au lieu de la date d'aujourd'hui
    if (rendezvous && rendezvous.jour) {
      navigate(`/medecin/calendrier/${rendezvous.jour}`);
    } else {
      // Fallback vers la date d'aujourd'hui si pas de date de rendez-vous
      const today = new Date().toISOString().split('T')[0];
      navigate(`/medecin/calendrier/${today}`);
    }
  };

  const handleConsultations = () => {
    if (!rendezvous) return;

    // Vérifier si le rendez-vous est dans le futur
    if (isRendezvousFutur()) {
      if (window.showNotification) {
        window.showNotification("Consultation disponible à la date du rendez-vous. Veuillez s'il vous plaît contacter une secrétaire pour modifier la date du rendez-vous.", "warning");
      }
      setButtonClicked(true); // Désactiver le bouton après le clic
      return;
    }

    // Vérifier si le rendez-vous est aujourd'hui mais dans le futur
    if (isRendezvousAujourdhuiFutur()) {
      if (window.showNotification) {
        window.showNotification("Le rendez-vous n'a pas encore commencé. Veuillez attendre l'heure du rendez-vous.", "warning");
      }
      setButtonClicked(true); // Désactiver le bouton après le clic
      return;
    }

    // Si toutes les vérifications sont passées, naviguer vers la consultation
    navigate(`/medecin/rendezvous/consultation/${id}`);
  };

  const handleDossierMedical = () => {
    if (rendezvous && rendezvous.patientId) {
      navigate(`/medecin/rendezvous/dossiermedical/${rendezvous.patientId}`);
    }
  };

  if (loading) {
    return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><p>Chargement...</p></div>;
  }

  if (error) {
    return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><p style={{ color:'red' }}>{error}</p></div>;
  }

  if (!rendezvous) {
    return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><p>Rendez-vous non trouvé</p></div>;
  }

  return (
    <>
      <SousDiv1Style>
        <Barrehorizontal1 titrepage="Détails du rendez-vous" imgprofil1={imgprofil} nomprofil='Médecin'>
          <Span1 onClick={() => navigate("/medecin/calendrier")}>Calendrier</Span1>
          <Span2> {">"} Détails du rendez-vous </Span2>
        </Barrehorizontal1>
      </SousDiv1Style>

      <Affichedetailuser>
        <FormContainer>
          <Title>
            <Title1>Détails du rendez-vous</Title1>
            <Title2>#{rendezvous.id}</Title2>
          </Title>
          <TraitHorizontal />

          <Form>
            <FormRow>
              <FormGroup>
                <Label>Jour</Label>
                <Input type="text" value={rendezvous.jour || ''} readOnly />
              </FormGroup>
              <FormGroup>
                <Label>Heure</Label>
                <Input type="text" value={rendezvous.heure || ''} readOnly />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Service médical</Label>
                <Input type="text" value={rendezvous.serviceMedical || ''} readOnly />
              </FormGroup>
              <FormGroup>
                <Label>Nom de la salle</Label>
                <Input type="text" value={rendezvous.nomSalle || ''} readOnly />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Nom du patient</Label>
                <Input type="text" value={rendezvous.patientNomComplet || ''} readOnly />
              </FormGroup>
              <FormGroup>
                <Label>Nom du médecin</Label>
                <Input type="text" value={rendezvous.medecinNomComplet || ''} readOnly />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Statut</Label>
                <Input type="text" value={rendezvous.statut || ''} readOnly />
              </FormGroup>
              <FormGroup>
                <Label>Notes</Label>
                <Input type="text" value={rendezvous.notes || 'Aucune note'} readOnly />
              </FormGroup>
            </FormRow>

            <ButtonContainer>
              <ReturnButton onClick={handleRetour}>
                Retour
              </ReturnButton>
              {isConsultationDisabled() ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <DisabledButton disabled>
                    Créer une consultation
                  </DisabledButton>
                  <small style={{ 
                    color: '#666', 
                    fontSize: '12px', 
                    textAlign: 'center',
                    fontStyle: 'italic'
                  }}>
                    {isRendezvousFutur() 
                      ? "Contactez une secrétaire pour modifier la date" 
                      : "Attendez l'heure du rendez-vous"
                    }
                  </small>
                </div>
              ) : (
                <PrimaryButton onClick={handleConsultations}>
                  Créer une consultation
                </PrimaryButton>
              )}
              <SecondaryButton onClick={handleDossierMedical}>
                Voir le dossier médical
              </SecondaryButton>
            </ButtonContainer>
          </Form>
        </FormContainer>
      </Affichedetailuser>




    </>
  );
};

export default AfficherDetailRendezvous;
