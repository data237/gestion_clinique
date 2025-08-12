import React, { useState } from 'react';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import PrescriptionPDF from './generateurPdfPrescription';

const TestPrescriptionPDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Données d'exemple pour tester
  const samplePrescription = {
    id: "123456",
    medecinNomComplet: "Dr. Jean Dupont",
    patientNomComplet: "Marie Martin",
    typePrescription: "Médicament",
    medicaments: "Paracétamol 500mg",
    quantite: "20 comprimés",
    dureePrescription: "5 jours",
    instructions: "Prendre 1 comprimé toutes les 6 heures en cas de fièvre ou douleur. Ne pas dépasser 4 comprimés par jour.",
    consultationDescription: "Patient présente une fièvre de 38.5°C et des maux de tête. Pas d'autres symptômes.",
    dateConsultation: new Date().toISOString()
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(<PrescriptionPDF prescription={samplePrescription} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription_${samplePrescription.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8fafc', 
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      margin: '20px 0'
    }}>
      <h3 style={{ color: '#059669', marginBottom: '15px' }}>
        Test du Générateur de Prescription PDF
      </h3>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          style={{
            backgroundColor: isGenerating ? '#94a3b8' : '#059669',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          {isGenerating ? 'Génération...' : 'Générer PDF (Téléchargement)'}
        </button>

        <PDFDownloadLink
          document={<PrescriptionPDF prescription={samplePrescription} />}
          fileName={`prescription_${samplePrescription.id}.pdf`}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          {({ loading }) => 
            loading ? 'Préparation...' : 'Télécharger PDF Directement'
          }
        </PDFDownloadLink>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '15px', 
        borderRadius: '6px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ color: '#374151', marginBottom: '10px' }}>
          Données de test utilisées :
        </h4>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          <p><strong>ID:</strong> {samplePrescription.id}</p>
          <p><strong>Médecin:</strong> {samplePrescription.medecinNomComplet}</p>
          <p><strong>Patient:</strong> {samplePrescription.patientNomComplet}</p>
          <p><strong>Médicament:</strong> {samplePrescription.medicaments}</p>
          <p><strong>Quantité:</strong> {samplePrescription.quantite}</p>
          <p><strong>Durée:</strong> {samplePrescription.dureePrescription}</p>
        </div>
      </div>

      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        backgroundColor: '#fef3c7', 
        borderRadius: '6px',
        border: '1px solid #fde68a'
      }}>
        <p style={{ margin: '0', color: '#92400e', fontSize: '12px' }}>
          <strong>Note :</strong> Ce composant de test peut être intégré dans n'importe quelle page 
          pour tester la génération de PDF de prescription.
        </p>
      </div>
    </div>
  );
};

export default TestPrescriptionPDF; 