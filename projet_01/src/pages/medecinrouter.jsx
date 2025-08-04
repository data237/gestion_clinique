import React from "react";
import { Route } from "react-router-dom";
import PageMedecin from "./pagemedecin";
import RendezvousMedecin from "../composants/medecin/rendezvousmedecin";
import Calendar from "../composants/medecin/calendriermedecin";
import RendezvousMedecinToday from "../composants/medecin/rdvday";
import FormulaireConsultation from "../composants/medecin/formulaireconsultation";
import DossierMedical from "../composants/medecin/dossiermedical";



const Medecinroute = ()=>{
    return(
    
        <>
            <Route path="/medecin" element={<PageMedecin />}>
            {/* Route par défaut pour /admin */}
                <Route index element={<RendezvousMedecin />} />

                {/* Routes rendez-vous */}
                <Route path="rendezvous" element={<RendezvousMedecin />}/>
                <Route path="rendezvous/consultation/:idrendezvous" element={<FormulaireConsultation/>}/>
                <Route path="rendezvous/dossiermedical/:idrendezvous" element={<DossierMedical/>}/>

                <Route path="calendrier" element={<Calendar/>} />
                <Route path="calendrier/:today" element={<RendezvousMedecinToday/>}/>
              

                {/* Routes consultations */}

                {/* Routes calendrier */}
                
            </Route>
        </>
      
    )
}

export default Medecinroute