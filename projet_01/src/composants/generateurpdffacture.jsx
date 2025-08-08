// src/components/pdf/ReceiptPDF.jsx
import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  Font
} from "@react-pdf/renderer";

// Enregistrer une police moderne si disponible
// Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' });

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    fontSize: 10
  },
  container: { 
    flex: 1,
    backgroundColor: "#ffffff"
  },
  
  // Header moderne avec logo bien positionné
  header: { 
    backgroundColor: "#f8fafc",
    padding: 20,
    borderBottom: "3px solid #1e40af",
    marginBottom: 35,
    borderRadius: 12,
    position: "relative",
    overflow: "hidden"
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    opacity: 0.05
  },
  headerContent: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "relative",
    zIndex: 2
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20
  },
  logo: { 
    width: 80, 
    height: 80, 
    borderRadius: 12,
    border: "3px solid #1e40af"
  },
  clinicInfo: {
    flex: 1
  },
  clinicName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  clinicDetails: {
    fontSize: 11,
    color: "#64748b",
    lineHeight: 1.5,
    marginBottom: 4
  },
  factureInfo: {
    alignItems: "flex-end",
    textAlign: "right"
  },
  factureTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 2
  },
  factureNumber: {
    fontSize: 14,
    color: "#ffffff",
    backgroundColor: "#1e40af",
    padding: "8px 16px",
    borderRadius: 8,
    marginBottom: 8,
    fontWeight: "bold"
  },
  factureDate: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "medium"
  },
  
  // Section patient avec design amélioré
  patientSection: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 12,
    marginBottom: 30,
    border: "2px solid #e2e8f0",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "2px solid #1e40af",
    paddingBottom: 8
  },
  patientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20
  },
  patientItem: {
    width: "48%",
    marginBottom: 15
  },
  patientLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "medium",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  patientValue: {
    fontSize: 13,
    color: "#1e293b",
    fontWeight: "bold",
    padding: "8px 12px",
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    border: "1px solid #e2e8f0"
  },
  
  // Section services avec design moderne
  servicesSection: {
    marginBottom: 30
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#1e40af",
    borderRadius: 8,
    marginBottom: 15
  },
  serviceHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 10,
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
  },
  serviceName: {
    fontSize: 13,
    color: "#1e293b",
    fontWeight: "medium",
    flex: 1
  },
  serviceAmount: {
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "bold"
  },
  
  // Section paiement avec design professionnel
  paymentSection: {
    backgroundColor: "#f0f9ff",
    padding: 25,
    borderRadius: 12,
    marginBottom: 30,
    border: "2px solid #bae6fd"
  },
  paymentGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  paymentItem: {
    width: "48%"
  },
  paymentLabel: {
    fontSize: 11,
    color: "#0369a1",
    fontWeight: "medium",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  paymentValue: {
    fontSize: 13,
    color: "#1e293b",
    fontWeight: "bold",
    padding: "8px 12px",
    backgroundColor: "#ffffff",
    borderRadius: 6,
    border: "1px solid #bae6fd"
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    borderTop: "3px solid #bae6fd",
    marginTop: 20
  },
  totalLabel: {
    fontSize: 16,
    color: "#1e40af",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  totalAmount: {
    fontSize: 18,
    color: "#1e40af",
    fontWeight: "bold",
    padding: "12px 20px",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    border: "2px solid #1e40af"
  },
  
  // Footer professionnel avec informations complètes
  footer: {
    marginTop: 40,
    paddingTop: 25,
    borderTop: "3px solid #e2e8f0",
    textAlign: "center"
  },
  footerText: {
    fontSize: 10,
    color: "#64748b",
    lineHeight: 1.6,
    marginBottom: 15
  },
  footerContact: {
    fontSize: 11,
    color: "#1e40af",
    fontWeight: "medium",
    marginBottom: 8
  },
  footerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 20,
    borderTop: "1px solid #e2e8f0"
  },
  footerInfoItem: {
    width: "30%",
    textAlign: "center"
  },
  footerInfoTitle: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "medium",
    marginBottom: 4
  },
  footerInfoValue: {
    fontSize: 11,
    color: "#1e293b",
    fontWeight: "bold"
  },
  
  // Éléments décoratifs
  badge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: 6,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  divider: {
    height: 2,
    backgroundColor: "#1e40af",
    marginVertical: 20,
    borderRadius: 1
  }
});

export default function ReceiptPDF({
  patientName,
  amount,
  date,
  paymentMethod,
  serviceMedicalName,
  factureId,
  logo
}) {
  // Formater la date
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formater l'heure
  const formatTime = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formater le montant
  const formatAmount = (amount) => {
    if (!amount) return "0,00 XAF";
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `${num.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} XAF`;
  };

  // Traduire le mode de paiement
  const translatePaymentMethod = (method) => {
    const methods = {
      'ESPECES': 'Espèces',
      'CARTE_BANCAIRE': 'Carte Bancaire',
      'VIREMENT': 'Virement',
      'CHEQUE': 'Chèque',
      'MOBILE_MONEY': 'Mobile Money'
    };
    return methods[method] || method;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header moderne avec logo bien positionné */}
          <View style={styles.header}>
            <View style={styles.headerBackground} />
            <View style={styles.headerContent}>
              <View style={styles.logoSection}>
                {logo ? (
                  <Image style={styles.logo} src={logo} />
                ) : (
                  <View style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    backgroundColor: "#1e40af",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "3px solid #1e40af"
                  }}>
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>CLINIQUE</Text>
                  </View>
                )}
                <View style={styles.clinicInfo}>
                  <Text style={styles.clinicName}>CLINIQUE D'AFRIK</Text>
                  <Text style={styles.clinicDetails}>
                    123 Avenue de la Santé, Douala{'\n'}
                    Cameroun • Tél: +237 677 850 000{'\n'}
                    Email: admin@gmail.com
                  </Text>
                </View>
              </View>
              
              <View style={styles.factureInfo}>
                <Text style={styles.factureTitle}>FACTURE</Text>
                <Text style={styles.factureNumber}>
                  N° {factureId ? factureId.toString().padStart(6, '0') : '000000'}
                </Text>
                <Text style={styles.factureDate}>
                  {date}
                </Text>
              </View>
            </View>
          </View>

          {/* Informations patient avec design amélioré */}
          <View style={styles.patientSection}>
            <Text style={styles.sectionTitle}>Informations Patient</Text>
            <View style={styles.patientGrid}>
              <View style={styles.patientItem}>
                <Text style={styles.patientLabel}>Nom et Prénom</Text>
                <Text style={styles.patientValue}>{patientName || "—"}</Text>
              </View>

              <View style={styles.patientItem}>
                <Text style={styles.patientLabel}>Numéro de facture</Text>
                <Text style={styles.patientValue}>
                  {factureId ? factureId.toString().padStart(6, '0') : '000000'}
                </Text>
              </View>
            </View>
          </View>

          {/* Services médicaux avec design moderne */}
          <View style={styles.servicesSection}>
            <View style={styles.serviceHeader}>
              <Text style={styles.serviceHeaderText}>Services Médicaux</Text>
              <Text style={styles.serviceHeaderText}>Montant</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>{serviceMedicalName || "Consultation médicale générale"}</Text>
              <Text style={styles.serviceAmount}>{amount}</Text>
            </View>
          </View>

          {/* Section paiement avec design professionnel */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Détails du Paiement</Text>
            <View style={styles.paymentGrid}>
              <View style={styles.paymentItem}>
                <Text style={styles.paymentLabel}>Mode de paiement</Text>
                <Text style={styles.paymentValue}>{paymentMethod}</Text>
              </View>
              <View style={styles.paymentItem}>
                <Text style={styles.paymentLabel}>Statut du paiement</Text>
                <Text style={[styles.badge, { marginTop: 8 }]}>
                  PAYÉ
                </Text>
              </View>
            </View>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total à Payer</Text>
              <Text style={styles.totalAmount}>{amount}</Text>
            </View>
          </View>

          {/* Footer professionnel avec informations complètes */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Merci de votre confiance. Cette facture est un document officiel.{'\n'}
              Pour toute question concernant cette facture, veuillez nous contacter.
            </Text>
            <Text style={styles.footerContact}>
              📧 admin@gmail.com • 📞 +237 677 850 000
            </Text>
            
            <View style={styles.footerInfo}>
              <View style={styles.footerInfoItem}>
                <Text style={styles.footerInfoTitle}>Horaires</Text>
                <Text style={styles.footerInfoValue}>7j/7, 8h-18h</Text>
              </View>
              <View style={styles.footerInfoItem}>
                <Text style={styles.footerInfoTitle}>Adresse</Text>
                <Text style={styles.footerInfoValue}>123 Avenue de la Santé</Text>
              </View>
              <View style={styles.footerInfoItem}>
                <Text style={styles.footerInfoTitle}>Ville</Text>
                <Text style={styles.footerInfoValue}>Douala, Cameroun</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

