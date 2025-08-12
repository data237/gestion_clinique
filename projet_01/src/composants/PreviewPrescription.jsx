import React, { useState } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import PrescriptionPDF from './generateurPdfPrescription';

const PreviewPrescription = () => {
  const [showPreview, setShowPreview] = useState(false);

  // Données d'exemple pour la prévisualisation
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

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#059669', marginBottom: '20px' }}>
        Prévisualisation de la Prescription PDF
      </h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setShowPreview(!showPreview)}
          style={{
            backgroundColor: showPreview ? '#dc2626' : '#059669',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {showPreview ? 'Masquer la prévisualisation' : 'Afficher la prévisualisation'}
        </button>
      </div>

      {showPreview && (
        <div style={{ 
          border: '2px solid #059669', 
          borderRadius: '8px', 
          overflow: 'hidden',
          height: '80vh'
        }}>
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <PrescriptionPDF prescription={samplePrescription} />
          </PDFViewer>
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ color: '#059669', marginBottom: '15px' }}>
          Données d'exemple utilisées :
        </h3>
        <pre style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '6px',
          overflow: 'auto',
          fontSize: '14px'
        }}>
          {JSON.stringify(samplePrescription, null, 2)}
        </pre>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fef3c7', 
        borderRadius: '6px',
        border: '1px solid #fde68a'
      }}>
        <p style={{ margin: '0', color: '#92400e' }}>
          <strong>Note :</strong> Cette prévisualisation utilise des données d'exemple. 
          Dans votre application réelle, ces données proviendront de votre base de données.
        </p>
      </div>
    </div>
  );
};

export default PreviewPrescription; 