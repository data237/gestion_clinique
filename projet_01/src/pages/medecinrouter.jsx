import React from "react";
import { Route } from "react-router-dom";
import PageMedecin from "./pagemedecin";



const Medecinroute = ()=>{
    return(
    
        <>
            <Route path="/medecin" element={<PageMedecin />}>
            {/* Route par défaut pour /admin */}
                <Route index element={<PageMedecin />} />

                {/* Routes utilisateurs */}
                

                {/* Routes patients */}
                
            </Route>
        </>
      
    )
}

export default Medecinroute