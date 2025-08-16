import '../styles/pageadmin.css'
import Styled from 'styled-components'
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Barrelatteral from '../composants/barrelatteral';
//import Utilisateur from '../composants/utilisateurs';
//import Patient from '../composants/patients';
import Eltmenu from '../composants/eltmenu'
//import mail from '../assets/mail.png'
import imgrendezvous from '../assets/IconRendezvous.png'
import imgpatient from '../assets/IconPatient.png'
import imgcalendrier from '../assets/IconCalendrier.png'
import iconEnvelope from '../assets/icon-envelope.svg'
import { Link, Outlet, useLocation } from 'react-router-dom';

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

function PageSecretaire(){
    const [contenuActif, setContenuActif] = useState('rendez-vous');
    const location = useLocation();
    
    // Détecter les changements d'URL et le paramètre focus
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const focusParam = urlParams.get('focus');
        if (focusParam === 'patient') {
            setContenuActif('patient');
            // Nettoyer l'URL
            window.history.replaceState({}, document.title, location.pathname);
        }
    }, [location]); // Déclencher à chaque changement de location
   


 
    const changerContenu = (contenu) => {
        console.log(contenu)
       setContenuActif(contenu)
    };
    
    return(<>
    <PageStyle>
        <Barrelatteral> 
            <Link to="/secretaire/rendezvous" className={contenuActif === 'rendez-vous' ? 'eltmenu' : 'lienadmin'} onClick={() => {changerContenu('rendez-vous')}}><Eltmenu nommenu='rendez-vous' img={imgrendezvous} /></Link>
            <Link to="/secretaire/patient" className={contenuActif === 'patient' ? 'eltmenu' : 'lienadmin'} onClick={() => {changerContenu('patient')}}><Eltmenu nommenu='Patients' img={imgpatient} /></Link>
            <Link to="/secretaire/calendrier" className={contenuActif === 'calendrier' ? 'eltmenu' : 'lienadmin'} onClick={() => {changerContenu('calendrier')}}><Eltmenu nommenu='Calendrier' img={imgcalendrier} /></Link>
            <Link to="/secretaire/facture" className={contenuActif === 'facture' ? 'eltmenu' : 'lienadmin'} onClick={() => {changerContenu('facture')}}><Eltmenu nommenu='Facture' img={imgcalendrier} /></Link>
            <Link to="/secretaire/messagerie" className={contenuActif === 'messagerie' ? 'eltmenu' : 'lienadmin'} onClick={() => {changerContenu('messagerie')}}><Eltmenu nommenu='Messagerie' img={iconEnvelope} /></Link>
            {/*<button className={contenuActif === 'utilisateur' ? 'eltmenu' : ''} onClick={changerContenu('utilisateur')}> <Eltmenu nommenu='utilisateurs' img={imgutilisateur}/> </button>*/}
            {/*<button className={contenuActif === 'patient' ? 'eltmenu' : ''} onClick={() => changerContenu('patient')}> <Eltmenu nommenu='Patients' img={imgpatient}/> </button>*/}
            {/*<button className={contenuActif === 'messagerie' ? 'eltmenu' : ''} onClick={() => changerContenu('messagerie')}> <Eltmenu nommenu='Messagerie' img={mail}/> </button>*/}
        </Barrelatteral>
         <div className='divstyle'>
            <Outlet/>   
        </div>
        
    </PageStyle>
        
    </>)
}
export default PageSecretaire