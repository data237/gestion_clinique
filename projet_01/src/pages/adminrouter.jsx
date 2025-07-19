import React from "react";
import { Route } from "react-router-dom";
import PageAdmin from "./pageadmin";
import Utilisateur from "../composants/utilisateurs";
import ModifierUtilisateur from "../composants/modifierutilisateur";
import FormulaireUtilisateur from "../composants/formulaireutilisateur";
import DetailsUtilisateur from "../composants/affichedetailutilisateur";
import Patient from "../composants/patients";
import FormulairePatient from "../composants/formulairepatient"; 
import DetailsPatient from "../composants/afficherdetailpatient";
import ModifierPatient from "../composants/modifierpatient";

const Adminroute = ()=>{
    return(
    
        <>
            <Route path="/admin" element={<PageAdmin />}>
            {/* Route par défaut pour /admin */}
                <Route index element={<Utilisateur />} />

                {/* Routes utilisateurs */}
                <Route path="utilisateur" element={<Utilisateur />} />
                <Route path="utilisateur/add" element={<FormulaireUtilisateur />} />
                <Route path="utilisateur/viewuser/:id" element={<DetailsUtilisateur />} />
                <Route path="utilisateur/edit/:id" element={<ModifierUtilisateur />} />

                {/* Routes patients */}
                <Route path="patient" element={<Patient />} />
                <Route path="patient/add" element={<FormulairePatient />} />
                <Route path="patient/viewpatient/:id" element={<DetailsPatient />} />
                <Route path="patient/edit/:id" element={<ModifierPatient />} />
            </Route>
        </>
      
    )
}

export default Adminroute