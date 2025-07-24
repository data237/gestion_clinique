import React from "react";
import { Route } from "react-router-dom";
import PageMedecin from "./pagemedecin";
import RendezvousMedecin from "../composants/medecin/rendezvousmedecin";
import Calendar from "../composants/medecin/calendriermedecin";
import RendezvousMedecinToday from "../composants/medecin/rdvday";



const Medecinroute = ()=>{
    return(
    
        <>
            <Route path="/medecin" element={<PageMedecin />}>
            {/* Route par défaut pour /admin */}
                <Route index element={<RendezvousMedecin />} />

                {/* Routes rendez-vous */}
                <Route path="rendezvous" element={<RendezvousMedecin />} />
                <Route path="calendrier" element={<Calendar/>} />
                <Route path="calendrier/:today" element={<RendezvousMedecinToday/>}/>
              

                {/* Routes consultations */}

                {/* Routes calendrier */}
                
            </Route>
        </>
      
    )
}

export default Medecinroute