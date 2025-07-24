import './pageadmin.css'
import Styled from 'styled-components'
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Barrelatteral from '../composants/barrelatteral';
import Utilisateur from '../composants/utilisateurs';
import Patient from '../composants/patients';
import Eltmenu from '../composants/eltmenu'
//import mail from '../assets/mail.png'
import imgutilisateur from '../assets/IconUtilisateursblack.png'
import imgpatient from '../assets/IconPatient.png'
import { Link, Outlet } from 'react-router-dom';

const PageStyle = Styled.div`
    display: flex;
`
const DivStyle = Styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-left: 1%;
    padding-top: 2%;
`

function PageAdmin(){
    const [contenuActif, setContenuActif] = useState('utilisateur');
    
   


 
    const changerContenu = (contenu) => {
        console.log(contenu)
       setContenuActif(contenu)
    };
    
    return(<>
    <PageStyle>
        <Barrelatteral> 
            <Link to="/admin/utilisateur" className={contenuActif === 'utilisateur' ? 'eltmenu' : 'lienadmin'} onClick={() => {changerContenu('utilisateur')}}><Eltmenu nommenu='utilisateurs' img={imgutilisateur} /></Link>
            <Link to="/admin/patient" className={contenuActif === 'patient' ? 'eltmenu' : 'lienadmin'} onClick={() => {changerContenu('patient')}}><Eltmenu nommenu='Patients' img={imgpatient} className={contenuActif === 'patient' ? 'eltmenu' : ''} onClick={() => {changerContenu('patient')}}/></Link>
            {/*<button className={contenuActif === 'utilisateur' ? 'eltmenu' : ''} onClick={changerContenu('utilisateur')}> <Eltmenu nommenu='utilisateurs' img={imgutilisateur}/> </button>*/}
            {/*<button className={contenuActif === 'patient' ? 'eltmenu' : ''} onClick={() => changerContenu('patient')}> <Eltmenu nommenu='Patients' img={imgpatient}/> </button>*/}
            {/*<button className={contenuActif === 'messagerie' ? 'eltmenu' : ''} onClick={() => changerContenu('messagerie')}> <Eltmenu nommenu='Messagerie' img={mail}/> </button>*/}
        </Barrelatteral>
        <DivStyle>
            <Outlet/>   
        </DivStyle>
        
    </PageStyle>
        
    </>)
}
export default PageAdmin