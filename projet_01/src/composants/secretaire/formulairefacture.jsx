// src/components/forms/FormulaireFacture.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig';
import axios from 'axios';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';

// IMPORTS pour la génération PDF
import { pdf } from '@react-pdf/renderer';
import ReceiptPDF from '../../composants/generateurpdffacture'; // chemin selon ta structure
import logoPath from '../../assets/logo.png'; // met ton logo ici (optionnel, local)

// === styled-components (copie de ton code) ===
// ... (Garde tout ton styled-components tel quel)
// Pour la clarté je réutilise tes définitions ci-dessous — colle les tiennes exactement
const Affichedetailuser = Styled.div`display: flex; justify-content: center; align-items: center;`;
const FormContainer = Styled.div`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 40px;
  border-radius: 20px;
  font-family: 'Inter', sans-serif;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${fondImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.05;
    z-index: 0;
  }
  > * { position: relative; z-index: 1; }
`;
const Title = Styled.div`display: flex; justify-content: space-between;`;
const Title1 = Styled.h2`margin-bottom: 0px; font-size: 28px; font-weight: 600; color: #1e40af; padding-bottom: 15px; font-family: 'Inter', sans-serif;`;
const Title2 = Styled.h2`margin-bottom: 0px; font-size: 24px; font-weight: 500; color: #1e40af; padding-bottom: 10px; font-family: 'Inter', sans-serif; cursor: pointer;`;
const TraitHorizontal = Styled.div`width: 100%; height: 4px; border-radius: 2px; background: linear-gradient(90deg, #1e40af, #3b82f6); margin-bottom: 25px; box-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);`;
const FormRow = Styled.div`display: flex; gap: 10px; margin-bottom: 15px;`;
const FormGroup = Styled.div`flex: 1; display: flex; flex-direction: column;`;
const FormGroupvisible = Styled.div`flex: 1; display: ${props => props.$formgroupdisplay || "none"}; flex-direction: column;`;
const Form = Styled.form`margin: 0; padding-left:0; width: 766px;`;
const Label = Styled.label`font-size: 14px; margin-bottom: 8px; color: #374151; font-weight: 500; font-family: 'Inter', sans-serif;`;
const Input = Styled.input`
  padding: 12px 16px; 
  border: 2px solid #e5e7eb; 
  border-radius: 10px; 
  width: 100%; 
  color: #1f2937; 
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  background: #ffffff;
  
  &:focus{ 
    border: 2px solid #1e40af; 
    outline: none;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
  
  &:disabled {
    background: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
`;
const Select = Styled.select`
  min-width: 100%; 
  padding: 12px 16px; 
  border: 2px solid #e5e7eb; 
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  background: #ffffff;
  color: #1f2937;
  transition: all 0.3s ease;
  
  &:focus {
    border: 2px solid #1e40af;
    outline: none;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
`;
const ButtonRow = Styled.div`display: flex; justify-content: space-between; gap: 10px; margin-top: 20px;`;
const Button = Styled.button`
  padding: 14px 24px;
  border-radius: 12px;
  border: 2px solid ${props => props.primary ? '#1e40af' : '#e5e7eb'};
  background: ${props => props.primary ? '#1e40af' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#1e40af'};
  font-weight: 600;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.primary ? '#1d4ed8' : '#f8fafc'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  &:active {
    transform: translateY(0);
  }
`;
// === fin styled-components ===

const FormulaireFacture = ({ id, onClick1 }) => {
  const [facture, setfacture] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const fetchfactures = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${API_BASE}/factures/recherche/${id}`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        setfacture(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des factures:', error);
      }
    };
    if (id) fetchfactures();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setfacture(prev => ({ ...prev, [name]: value }));
  };

  // helper: convert an image URL to data url (to avoid CORS issues with react-pdf)
  const imageUrlToDataUrl = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn("Impossible de convertir l'image en dataURL:", err);
      return null;
    }
  };

  // === SUBMIT: PATCH payer + generer PDF ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      // 1) patch paiement (si tu veux d'abord marquer payé)
      await axios.patch(`${API_BASE}/factures/payer/${id}/${facture.modePaiement}`, {}, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      // 2) préparer les données pour le PDF
      const amountFormatted = typeof facture.montant === 'number'
        ? `XAF${facture.montant.toFixed(2)}`
        : `XAF${parseFloat(facture.montant).toFixed(2)}`;

      const dateStr = facture.dateEmission?.split?.("T")?.[0] || "";

      // 3) récupérer logo en dataURL pour éviter CORS (optionnel)
      let logoDataUrl = null;
      try {
        // si logoPath est local dans /src/assets/logo.png, ce fetch fonctionne dans dev build
        logoDataUrl = await imageUrlToDataUrl(logoPath);
      } catch (err) {
        console.warn("logo non converti, génération sans logo :", err);
      }

      // 4) créer le Document react-pdf
      const doc = (
        <ReceiptPDF
          patientName={facture.patientNomComplet}
          amount={amountFormatted}
          date={dateStr}
          paymentMethod={facture.modePaiement}
          serviceMedicalName={facture.serviceMedicalNom}
          factureId={facture.id || facture.factureNumero || id}
          logo={logoDataUrl} // peut être null
        />
      );

      // 5) générer blob PDF et forcer le téléchargement
      const asBlob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(asBlob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (facture.patientNomComplet || 'facture').replace(/\s+/g, "_");
      a.download = `facture_${safeName}_${dateStr || ''}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de la soumission / génération PDF :', error);
      alert('Une erreur est survenue. Voir la console.');
    } finally {
      setLoading(false);
    }
  };

  if (!facture) {
    return (
      <Affichedetailuser>
        <FormContainer>
          <p>Chargement...</p>
        </FormContainer>
      </Affichedetailuser>
    );
  }

  return (
    <Affichedetailuser>
      <Form onSubmit={handleSubmit}>
        <FormContainer>
          <Title>
            <Title1>🏥 Détail de la Facture</Title1>
          </Title>

          <TraitHorizontal />
                      <FormRow>
              <FormGroup>
                <Label htmlFor="nom">👤 Nom du Patient</Label>
                <Input id="nom" value={facture.patientNomComplet} readOnly />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="date">📅 Date d'Émission</Label>
                <Input id="date" value={facture.dateEmission.split("T")[0]} readOnly />
              </FormGroup>
            </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="heure">Heure Emission</Label>
              <Input id="heure" value={facture.dateEmission.split("T")[1].split(".")[0]} readOnly />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="servicemedicalnom">Service medical</Label>
              <Input id="servicemedicalnom" name="serviceMedicalNom" value={facture.serviceMedicalNom} readOnly />
            </FormGroup>
          </FormRow>

                      <FormRow>
              <FormGroup>
                <Label htmlFor="montant">💰 Montant (XAF)</Label>
                <Input id="montant" name="montant" value={facture.montant} readOnly />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="modepaiement">💳 Mode de Paiement</Label>
                <Select id="modepaiement" name="modePaiement" value={facture.modePaiement} onChange={handleChange}>
                  <option value="ESPECES">💵 Espèces</option>
                  <option value="CARTE_BANCAIRE">💳 Carte Bancaire</option>
                  <option value="VIREMENT">🏦 Virement</option>
                  <option value="CHEQUE">📄 Chèque</option>
                  <option value="MOBILE_MONEY">📱 Mobile Money</option>
                </Select>
              </FormGroup>
            </FormRow>
        </FormContainer>

        <ButtonRow>
          <Button type="button" onClick={onClick1}>Annuler</Button>
          <Button type="submit" primary disabled={loading} onClick={onClick1}>
            {loading ? "Génération..." : "Generer la facture"}
          </Button>
        </ButtonRow>
      </Form>
    </Affichedetailuser>
  );
};

export default FormulaireFacture;
