import './pageadmin.css'
import Styled from 'styled-components'
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Barrelatteral from '../composants/barrelatteral';
import Barrehorizontal1 from '../composants/barrehorizontal1';
import Barrehorizontal2 from "../composants/barrehorizontal2";
import imgmedecin from '../assets/imagemedecin.jpg'
import Eltmenu from '../composants/eltmenu'
import mail from '../assets/mail.png'
import iconcalendrier from '../assets/IconCalendrier.png'
import iconconsultation from '../assets/IconConsultation.png'
import iconRendezvous from '../assets/IconRendezvous.png'
import PatientsTable from '../composants/tableaupatient';
import UtilisateurTable from '../composants/tableauutilisateur';

const PageStyle = Styled.div`
    display: flex;
`
const DivStyle = Styled.div`
  width: 100%;
 display: flex;
 flex-direction: column;
 gap: 15px;
 padding-left: 1%;
 padding-top: 2%;
`
const SousDiv1Style = Styled.div`
 width: 99%;
 padding-left: 1%;
`
const SousDiv2Style = Styled.div`
  width: 99%;
 padding-left: 1%;
`
const ZonedaffichageStyle = Styled.div`
    height: 75vh;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: rgba(239, 239, 255, 1);

    border-radius: 10px;
`


function PageMedecin(){
    const [contenuActif, setContenuActif] = useState('utilisateur');
    const [titrepage, settitrepage] = useState('Gestion des utilisateurs')
    const [nomboutton, setnomboutton] = useState('Ajouter un utilisateur') // Initialisation avec useState

    const nomprofil = 'Pr. Bahebeck J'
    let contenu;

        if (contenuActif === 'rendezvous') {
            contenu = 'Rendez-vous';
        } else if (contenuActif === 'consultation') {
            contenu = 'Rendez-vous';
        } else if (contenuActif === 'messagerie') {
            contenu = 'mesagerie';
        }
        else if (contenuActif === 'calendrier') {
            contenu = 'calendrier';
        }

    const changerContenu = (contenu,titrepage,nomboutton) => {
       setContenuActif(contenu)
       settitrepage(titrepage)
       setnomboutton(nomboutton) // Met à jour l'état
    };
    
    return(<>
    <PageStyle>
        <Barrelatteral> 
           <button className={contenuActif === 'rendezvous' ? 'eltmenu' : ''} onClick={() => changerContenu('rendezvous', 'Mes rendez-vous', 'Ajouter un element')}><Eltmenu nommenu='Rendez-vous' img={iconRendezvous}/></button>
            <button className={contenuActif === 'consultation' ? 'eltmenu' : ''} onClick={() => changerContenu('consultation','Consultation et dossiers médicaux','Ajouter un element')}> <Eltmenu nommenu='Consultation' img={iconconsultation}/> </button>
            <button className={contenuActif === 'messagerie' ? 'eltmenu' : ''} onClick={() => changerContenu('messagerie','Messagerie','Nouveau message')}> <Eltmenu nommenu='Messagerie' img={mail}/> </button>
            <button className={contenuActif === 'calendrier' ? 'eltmenu' : ''} onClick={() => changerContenu('calendrier','Calendrier', 'Ajouter un element')}> <Eltmenu nommenu='Calendrier' img={iconcalendrier}/> </button>
           
        </Barrelatteral>
        <DivStyle>
            <SousDiv1Style>
                <Barrehorizontal1 titrepage={titrepage} imgprofil1={imgmedecin} nomprofil={nomprofil}/>
                
            </SousDiv1Style>
            
            <SousDiv2Style>
                <Barrehorizontal2 nomboutton={nomboutton}/>
                <ZonedaffichageStyle>
                    {contenu}
                </ZonedaffichageStyle>
            </SousDiv2Style>
                
        </DivStyle>
        
    </PageStyle>
        
    </>)
}
export default PageMedecin