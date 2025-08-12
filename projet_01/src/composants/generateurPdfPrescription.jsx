import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  doctorInfo: {
    marginBottom: 30,
    fontSize: 12,
  },
  patientInfo: {
    marginBottom: 20,
    fontSize: 12,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 12,
    marginBottom: 10,
  },
  signature: {
    marginTop: 40,
    fontSize: 12,
  },
});

const PrescriptionPDF = ({ prescription }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.hospitalName}>HOSPITAL NAME</Text>
        <Text style={styles.doctorInfo}>
          Dr. {prescription.medecinNomComplet}
        </Text>
      </View>

      <View style={styles.patientInfo}>
        <Text>Patient: {prescription.patientNomComplet}</Text>
        <Text>Type de prescription: {prescription.typePrescription}</Text>
        <Text>Date: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Médicaments:</Text>
        <Text style={styles.content}>{prescription.medicaments}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions:</Text>
        <Text style={styles.content}>{prescription.instructions}</Text>
      </View>

      <View style={styles.section}>
        <Text>Durée: {prescription.dureePrescription}</Text>
        <Text>Quantité: {prescription.quantite}</Text>
      </View>

      {prescription.consultationDescription && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes de consultation:</Text>
          <Text style={styles.content}>{prescription.consultationDescription}</Text>
        </View>
      )}

      <View style={styles.signature}>
        <Text>Signature du médecin: _________________________</Text>
      </View>
    </Page>
  </Document>
);

export default PrescriptionPDF;