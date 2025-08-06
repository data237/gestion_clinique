import React from "react";
import { Route } from "react-router-dom";
import PageSecretaire from "./pagesecretaire";
import Rendezvous from "../composants/secretaire/rendezvoussecretaire";
import PatientSecretaire from "../composants/secretaire/patientsecretaire";
import CalendarSecretaire from "../composants/secretaire/calendriersecretaire";
import RendezvousScretaireToday from "../composants/secretaire/rdvsecretaireday";
import FormulaireRendezVous from "../composants/secretaire/formulairerendezvous";
import Facture from "../composants/secretaire/facture";
import FormulairePatientSecretaire from "../composants/secretaire/formulairepatientsecretaire";


const Secretaireroute = ()=>{
    return(
    
        <>
            <Route path="/secretaire" element={<PageSecretaire />}>
            {/* Route par défaut pour /admin */}
                <Route index element={<Rendezvous />} />

                {/* Routes rendez-vous */}
                <Route path="rendezvous" element={<Rendezvous />} />
                {/*<Route path="rendezvous/add" element={<FormulaireUtilisateur />} />
                <Route path="rendezvous/viewrendezvous/:id" element={<DetailsUtilisateur />} />
                <Route path="rendezvous/edit/:id" element={<ModifierUtilisateur />} />

                {/* Routes patients */}
                <Route path="patient" element={<PatientSecretaire />} />
                <Route path="patient/add" element={<FormulairePatientSecretaire/>} />
                <Route path="patient/rendezvous/:nompatient" element={<FormulaireRendezVous/>}/>
                <Route path="calendrier" element={<CalendarSecretaire/>}/>
                <Route path="calendrier/:today" element={<RendezvousScretaireToday/>}/>
                <Route path="facture" element={<Facture/>}/>
                
            </Route>
        </>
      
    )
}

export default Secretaireroute