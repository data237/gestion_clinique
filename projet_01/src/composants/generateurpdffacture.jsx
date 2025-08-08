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
    padding: 30, 
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff"
  },
  container: { 
    flex: 1,
    backgroundColor: "#ffffff",
    border: "3px solid #4ade80", // Bordure verte comme l'exemple
    borderRadius: 8
  },
  
  // Header moderne avec logo et titre
  header: { 
    padding: 25,
    borderBottom: "2px solid #e5e7eb",
    marginBottom: 25
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  clinicSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15
  },
  logo: { 
    width: 60, 
    height: 60, 
    borderRadius: 8,
    border: "2px solid #4ade80"
  },
  clinicInfo: {
    flex: 1
  },
  clinicName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4
  },
  clinicSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic"
  },
  clinicDetails: {
    fontSize: 10,
    color: "#6b7280",
    lineHeight: 1.4,
    marginTop: 8
  },
  factureInfo: {
    alignItems: "flex-end",
    textAlign: "right"
  },
  factureTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    textTransform: "uppercase"
  },
  factureNumber: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4
  },
  factureDate: {
    fontSize: 11,
    color: "#6b7280"
  },
  
  // Section client et facture
  clientSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    paddingBottom: 20,
    borderBottom: "1px solid #e5e7eb"
  },
  clientInfo: {
    flex: 1
  },
  clientTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase"
  },
  clientName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4
  },
  clientAddress: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 4
  },
  clientDate: {
    fontSize: 11,
    color: "#6b7280"
  },
  invoiceInfo: {
    alignItems: "flex-end"
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4
  },
  
  // Section services avec design moderne
  servicesSection: {
    marginBottom: 25
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: 8
  },
  serviceHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    textTransform: "uppercase"
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottom: "1px solid #f3f4f6"
  },
  serviceName: {
    fontSize: 12,
    color: "#1f2937",
    fontWeight: "medium",
    flex: 1
  },
  serviceAmount: {
    fontSize: 12,
    color: "#1f2937",
    fontWeight: "bold"
  },
  
  // Section total avec design professionnel
  totalSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: "2px solid #e5e7eb"
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    textTransform: "uppercase"
  },
  totalAmount: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "bold",
    padding: "8px 16px",
    backgroundColor: "#f0f9ff",
    borderRadius: 4,
    border: "1px solid #bae6fd"
  },
  
  // Footer avec informations complètes
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: "2px solid #e5e7eb"
  },
  footerText: {
    fontSize: 10,
    color: "#6b7280",
    lineHeight: 1.5,
    marginBottom: 15,
    textAlign: "center"
  },
  footerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 15,
    borderTop: "1px solid #f3f4f6"
  },
  footerInfoItem: {
    width: "30%",
    textAlign: "center"
  },
  footerInfoTitle: {
    fontSize: 9,
    color: "#6b7280",
    fontWeight: "medium",
    marginBottom: 4,
    textTransform: "uppercase"
  },
  footerInfoValue: {
    fontSize: 10,
    color: "#374151",
    fontWeight: "bold"
  },
  footerContact: {
    fontSize: 10,
    color: "#4ade80",
    fontWeight: "medium",
    textAlign: "center",
    marginTop: 10
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
      month: '2-digit',
      day: '2-digit'
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
          {/* Header moderne avec logo et informations */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.clinicSection}>
                {logo ? (
                  <Image style={styles.logo} src={logo} />
                ) : (
                  <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    backgroundColor: "#4ade80",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "2px solid #4ade80"
                  }}>
                    <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>CLINIQUE</Text>
                  </View>
                )}
                <View style={styles.clinicInfo}>
                  <Text style={styles.clinicName}>Clinique d'Afrik</Text>
                  <Text style={styles.clinicSubtitle}>Afrikan clinic</Text>
                  <Text style={styles.clinicDetails}>
                    123 Avenue de la Santé, Douala{'\n'}
                    Cameroun • Tél: +237 677 850 000
                  </Text>
                </View>
              </View>
              
              <View style={styles.factureInfo}>
                <Text style={styles.factureTitle}>Facture de consultation</Text>
                <Text style={styles.factureNumber}>
                  Numéro #{factureId ? factureId.toString().padStart(5, '0') : '00000'}
                </Text>
                <Text style={styles.factureDate}>
                  {formatDate(date)}
                </Text>
              </View>
            </View>
          </View>

          {/* Section client et facture */}
          <View style={styles.clientSection}>
            <View style={styles.clientInfo}>
              <Text style={styles.clientTitle}>Patient</Text>
              <Text style={styles.clientName}>{patientName || "—"}</Text>
              <Text style={styles.clientAddress}>Adresse du patient</Text>
              <Text style={styles.clientDate}>Date: {formatDate(date)}</Text>
            </View>
            
            <View style={styles.invoiceInfo}>
              <Text style={styles.invoiceTitle}>Facture</Text>
              <Text style={styles.invoiceNumber}>
                #{factureId ? factureId.toString().padStart(5, '0') : '00000'}
              </Text>
            </View>
          </View>

          {/* Section services avec design moderne */}
          <View style={styles.servicesSection}>
            <View style={styles.serviceHeader}>
              <Text style={styles.serviceHeaderText}>Description du service</Text>
              <Text style={styles.serviceHeaderText}>Montant</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>{serviceMedicalName || "Consultation médicale"}</Text>
              <Text style={styles.serviceAmount}>{formatAmount(amount)}</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>Mode de paiement</Text>
              <Text style={styles.serviceAmount}>{translatePaymentMethod(paymentMethod)}</Text>
            </View>
          </View>

          {/* Section total avec design professionnel */}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{formatAmount(amount)}</Text>
            </View>
          </View>

          {/* Footer avec informations complètes */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Merci de votre confiance. Cette facture est un document officiel.{'\n'}
              Pour toute question, veuillez nous contacter.
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
                <Text style={styles.footerInfoTitle}>Contact</Text>
                <Text style={styles.footerInfoValue}>+237 677 850 000</Text>
              </View>
            </View>
            
            <Text style={styles.footerContact}>
              📧 admin@gmail.com • 📞 +237 677 850 000
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
