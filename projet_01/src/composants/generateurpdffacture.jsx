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

// (Optionnel) enregistrer une police si besoin
// Font.register({ family: 'Roboto', src: '/fonts/Roboto-Regular.ttf' });

const styles = StyleSheet.create({
  page: { padding: 18, fontFamily: "Helvetica" },
  container: { },
  header: { backgroundColor: "rgba(254, 255, 239, 1)",  flexDirection: "row", alignItems: "center", justifyContent:"center"},
  logo: { width: 180, height: 60, borderRadius: 30, padding: 6 },
  content: { padding: 18, textAlign: "left" },
  title: { fontSize: 18, marginBottom: 4, color: "rgba(159, 159, 255, 1)", textAlign: "center" },
  subtitle: { fontSize: 11, color: "#9b9b9b", marginBottom: 10, textAlign: "center" },
  patientRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  patientLabel: { fontSize: 14, color: "#777" },
  patientValue: { fontSize: 14, color: "#111", fontWeight: "bold" },
  details: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  detailsCol: { width: "25%" },
  detailsTitle: { fontSize: 11, color: "#777", marginBottom: 4 },
  detailsValue: { fontSize: 12, fontWeight: "bold", color: "#333" },
  strong: { fontWeight: "bold", color: "#333" },
  footerText: { fontSize: 9, color: "#777", marginTop: 8, textAlign: "center" }
});

export default function ReceiptPDF({
  patientName,
  amount,
  date,
  paymentMethod,
  serviceMedicalName,
  factureId,
  logo // can be a dataURL or a URL (prefer dataURL)
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.header}>
            {logo ? (
              <Image style={styles.logo} src={logo} />
            ) : (
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "#fff" }} />
            )}
            {/* on peut mettre un petit espace */}
            <View style={{ flex: 1 }} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Facture de consultation</Text>
            <Text style={styles.subtitle}>Numéro #000{factureId || "—"}</Text>

            <View style={[{ marginTop: 8, marginBottom: 6 }, styles.patientRow]}>
              <Text style={styles.patientLabel}>Nom et Prénom du patient</Text>
              <Text style={styles.patientValue}>{patientName}</Text>
            </View>

            <View style={styles.details}>
              <View style={styles.detailsCol}>
                <Text style={styles.detailsTitle}>MONTANT</Text>
                <Text style={styles.detailsValue}>{amount}</Text>
              </View>
              <View style={styles.detailsCol}>
                <Text style={styles.detailsTitle}>DATE EMISSION</Text>
                <Text style={styles.detailsValue}>{date}</Text>
              </View>
              <View style={styles.detailsCol}>
                <Text style={styles.detailsTitle}>MMETHODE DE PAYEMENT</Text>
                <Text style={styles.detailsValue}>{paymentMethod}</Text>
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={styles.detailsTitle}>SERVICE MEDICAL</Text>
              <Text style={styles.detailsValue}>{serviceMedicalName || "—"}</Text>
            </View>


            <Text style={styles.footerText}>
              Si vous avez des questions, contactez-nous à sommetdefo2@gmail.com ou appelez le +237 6 57 05 04 56.
            </Text>
            
          </View>
        </View>
      </Page>
    </Document>
  );
}
