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
  > * { position: relative; z-index: 1; }
`;
const Title = Styled.div`display: flex; justify-content: space-between;`;
const Title1 = Styled.h2`margin-bottom: 0px; font-size: 24px; font-weight: 400; color: rgba(102, 102, 102, 1); padding-bottom: 10px; font-family: Roboto;`;
const Title2 = Styled.h2`margin-bottom: 0px; font-size: 24px; font-weight: 400; color: rgba(159, 159, 255, 1); padding-bottom: 10px; font-family: Roboto; cursor: pointer;`;
const TraitHorizontal = Styled.div`width: 718px; height: 5px; border-radius: 2.5px; background-color: rgba(159, 159, 255, 1); margin-bottom: 20px;`;
const FormRow = Styled.div`display: flex; gap: 10px; margin-bottom: 15px;`;
const FormGroup = Styled.div`flex: 1; display: flex; flex-direction: column;`;
const FormGroupvisible = Styled.div`flex: 1; display: ${props => props.$formgroupdisplay || "none"}; flex-direction: column;`;
const Form = Styled.form`margin: 0; padding-left:0; width: 766px;`;
const Label = Styled.label`font-size: 14px; margin-bottom: 5px; color: rgba(51, 51, 51, 1);`;
const Input = Styled.input`padding: 10px; border: 1px solid rgba(217, 217, 217, 1); border-radius: 8px; width: 351px; color: rgba(30, 30, 30, 1); &:focus{ border: 1px solid rgba(217, 217, 217, 1); }`;
const Select = Styled.select`min-width: 351px; padding: 10px; border: 1px solid #ddd; border-radius: 8px;`;
const ButtonRow = Styled.div`display: flex; justify-content: space-between; gap: 10px; margin-top: 20px;`;
const Button = Styled.button`
  padding: 12px 20px;
  border-radius: 20px;
  border: 1px solid rgba(159, 159, 255, 1);
  background: ${props => props.primary ? 'rgba(159, 159, 255, 1)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'rgba(159, 159, 255, 1)'};
  font-weight: 500;
  font-size: 20px;
  font-familly: Roboto;
  width:375px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: ${props => props.primary ? 'rgba(239, 239, 255, 1)' : '#f2f2ff'};
    color: ${props => props.primary ? 'rgba(159, 159, 255, 1)' : 'rgba(159, 159, 255, 1)'};
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
            <Title1>Détail facture</Title1>
          </Title>

          <TraitHorizontal />
          <FormRow>
            <FormGroup>
              <Label htmlFor="nom">Nom patient</Label>
              <Input id="nom" value={facture.patientNomComplet} readOnly />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="date">Date Emission</Label>
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
              <Label htmlFor="montant">Montant</Label>
              <Input id="montant" name="montant" value={facture.montant} readOnly />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="modepaiement">Mode paiement</Label>
              <Select id="modepaiement" name="modePaiement" value={facture.modePaiement} onChange={handleChange}>
                <option value="ESPECES">ESPECES</option>
                <option value="CARTE_BANCAIRE">CARTE BANCAIRE</option>
                <option value="VIREMENT">VIREMENT</option>
                <option value="CHEQUE">CHEQUE</option>
                <option value="MOBILE_MONEY">MOBILE MONEY</option>
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
