import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageMedecin from "./pagemedecin";
import RendezvousMedecin from "../composants/medecin/rendezvousmedecin";
import Calendar from "../composants/medecin/calendriermedecin";
import RendezvousMedecinToday from "../composants/medecin/rdvday";
import FormulaireConsultation from "../composants/medecin/formulaireconsultation";
import DossierMedical from "../composants/medecin/dossiermedical";
import AfficherDetailRendezvous from "../composants/medecin/afficherdetailrendezvous";
const Medecinroute = () => {
    return (
        <Routes>
            <Route path="/" element={<PageMedecin />}>
                {/* Route par défaut pour /medecin */}
                <Route index element={<RendezvousMedecin />} />

                {/* Routes rendez-vous */}
                <Route path="rendezvous" element={<RendezvousMedecin />} />
                <Route path="rendezvous/viewrendezvous/:id" element={<AfficherDetailRendezvous />} />
                <Route path="rendezvous/consultation/:idrendezvous" element={<FormulaireConsultation />} />
                <Route path="rendezvous/dossiermedical/:patientId" element={<DossierMedical />} />

                {/* Routes calendrier */}
                <Route path="calendrier" element={<Calendar />} />
                <Route path="calendrier/:today" element={<RendezvousMedecinToday />} />

                {/* Redirection par défaut */}
                <Route path="*" element={<Navigate to="rendezvous" replace />} />
            </Route>
        </Routes>
    );
};

export default Medecinroute;
