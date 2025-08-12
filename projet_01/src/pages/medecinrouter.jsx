import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageMedecin from "./pagemedecin";
import RendezvousMedecin from "../composants/medecin/rendezvousmedecin";
import Calendar from "../composants/medecin/calendriermedecin";
import RendezvousMedecinToday from "../composants/medecin/rdvday";
import FormulaireConsultation from "../composants/medecin/formulaireconsultation";
import DossierMedical from "../composants/medecin/dossiermedical";
import TestPrescriptionPDF from "../composants/TestPrescriptionPDF";

const Medecinroute = () => {
    return (
        <Routes>
            <Route path="/" element={<PageMedecin />}>
                {/* Route par défaut pour /medecin */}
                <Route index element={<RendezvousMedecin />} />

                {/* Routes rendez-vous */}
                <Route path="rendezvous" element={<RendezvousMedecin />} />
                <Route path="rendezvous/consultation/:idrendezvous" element={<FormulaireConsultation />} />
                <Route path="rendezvous/dossiermedical/:idrendezvous" element={<DossierMedical />} />

                {/* Routes calendrier */}
                <Route path="calendrier" element={<Calendar />} />
                <Route path="calendrier/:today" element={<RendezvousMedecinToday />} />

                {/* Route de test pour la prescription PDF */}
                <Route path="test-prescription" element={<TestPrescriptionPDF />} />

                {/* Redirection par défaut */}
                <Route path="*" element={<Navigate to="rendezvous" replace />} />
            </Route>
        </Routes>
    );
};

export default Medecinroute;