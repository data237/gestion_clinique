import '../../styles/tableau.css'
import '../../styles/Zonedaffichage.css'
import '../../styles/Barrehorizontal2.css'
import Styled from 'styled-components'
import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import iconrecherche from '../../assets/iconrecherche.png'
import iconburger from '../../assets/iconburger.png'
import { Link, useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../shared/UnifiedModal';

const SousDiv1Style = Styled.div`
  width: 100%;

 padding-right: 32px;
`
const SousDiv2Style = Styled.div`
  width: 100%;
 
  padding-right: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`
const ZonedaffichageStyle = Styled.div`
    height: 70vh;
    display: ${props => props.$zonedaffichagedisplay};
    flex-direction: column;
    gap: 15px;
    background-color: rgba(239, 239, 255, 1);
    border-radius: 10px;
`

const Affichebarh2 = Styled.div`
    display: flex;
    width: 100%;
    height: 89px;
    justify-content: space-between;
`

// affichage bar de recherche et boutton

const RechercheStyle = Styled.div`
   width: 75%;
   height: 56px;
   border-radius: 28px;
   background-color: rgba(239, 239, 255, 1);
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding-left: 20px;
   padding-right: 20px;
`
const IconburgerStyle = Styled.img`
    width: 24px;
    height: 20px;

`
const IconrechercheStyle = Styled.img`
    width: 20px;
    height: 20px;
`
const InputStyle = Styled.input`
    width: 90%;
    height: 56px;
    border: none;
    background-color:  rgba(239, 239, 255, 1);
    font-family: Body/Font Family;
    font-weight: 400;
    font-size: 1em;
     &:focus{
        outline: none;
        border: none;
    }
`

const BouttonStyle = Styled.button`

height: 56px;
border-radius: 28px;
padding-top: 12px;
padding-right: 16px;
padding-bottom: 12px;
padding-left: 16px;
background-color: rgba(65, 65, 255, 1);
font-family: Body/Font Family;
font-weight: 700;
font-size: 1.3em;
color: #fff;
border: none;
&:hover{
    cursor: pointer;
}
`

//

const AfficheTableauStyle = Styled.div`
    display: flex;
    justify-content: center;
`




const Span1= Styled.span`
    cursor: pointer;
`


// Style component du tableau
    const NumeroStyle = Styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
`
const DivbuttonStyle = Styled.div`
    display: flex;
    gap: 15px;
`
const ButtonStyle = Styled.button`
    padding: 5px 5px;
    font-family: Roboto;
    font-weight: 300;
    font-size: 1em;
    background-color: ${props => props.$buttonbackgroundColor};
    color: ${props => props.$buttonColor};
    border-radius: 5px;
    gap: 0px;
     &:hover{
        cursor: pointer;
        background-color: rgba(65, 65, 255, 1);
        border-radius: 5px;
    }
    &:focus{
        cursor: pointer;
        background-color: rgba(65, 65, 255, 1);
        color: white;
        border-radius: 5px;
    }
    
`
const ButtonPSStyle = Styled.button`
    padding: 5px 5px;
    font-family: Roboto;
    font-weight: 300;
    font-size: 1em;
     &:hover{
        cursor: pointer;
    }
`

const NomtableStyle = Styled.p`
    font-family: "Inter", sans-serif;
    font-weight: 700;
    font-size: 1.5em;
`
const BarreStyle = Styled.div`
    width: 100%;
    height: 5px;
    border-radius: 2.5px;
    background-color: rgba(159, 159, 255, 1);
    padding-left:  20px;

`
//

// gerer les popups - Utilisation du système unifié
function RendezvousMedecin(){
    //const [isVisible, setisVisible] = useState(0)
     // const idUser = localStorage.getItem('id');
    //const [nomprofil, setnomprofil]= useState('')

    /*useEffect(() => {
        const token = localStorage.getItem('token');
           const nomutilisateur =  async ()=> {
                try {
                const response = await axios.get(`${API_BASE}/utilisateurs/${idUser}`,
                    {   headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    }},);
                console.log(token);
              if (response) {
                 setnomprofil(response.data.nom)
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                
            } finally {
              console.log('fin')
            }
            }
            nomutilisateur()
    }, [idUser]);*/

    // fonction du tableau
    const [Popup, setPopup] = useState(false)
   
    
    const [rdvaouvrir, setrdvaouvrir] = useState(null)
    const [valeurrecherche, setvaleurrecherche] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isloading, setisloading] = useState(true);
    const [rendezvous, setrendezvous] = useState([]);
    const [rendezvousFiltres, setrendezvousFiltres] = useState([]);
  
    const [erreur, setErreur] = useState(null);


    const rendezvousPerPage = 8;

    
    useEffect(()=>{
         
         const fetchrendezvous = async () => {
            const token = localStorage.getItem('token');
            const id = localStorage.getItem('id');
            try {
                const response = await axios.get(`${API_BASE}/utilisateurs/${id}/confirmed/from-today`,
                    {   headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    }},);
                console.log(token);
              if (response && response.data) {
                setrendezvous(response.data);
               setrendezvousFiltres(response.data);
                } /*else {
                setErreur('Données introuvables');
                }*/
            } catch (error) {
                console.error('Erreur lors de la récupération des rendezvous:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                setisloading(false);
            }
    
        };
            fetchrendezvous();
        },[]);
        
    useEffect(() => {
            if (!valeurrecherche.trim()) {
                setrendezvousFiltres(rendezvous); // Si rien à chercher, on affiche tout
                return;
            }

            const recherche = valeurrecherche.toLowerCase();

            const resultats = rendezvous.filter((u) =>
                u.jour.toLowerCase().includes(recherche) ||
                u.patientNomComplet.toLowerCase().includes(recherche) ||
                u.medecinNomComplet.toLowerCase().includes(recherche) ||
                u.statut.toLowerCase().includes(recherche)
            );

            setrendezvousFiltres(resultats);
    }, [valeurrecherche, rendezvous]);





    const [pagesToShow, setpagesToShow] = useState([]);
    const totalPages = Math.ceil(rendezvous.length / rendezvousPerPage);

    useEffect(() => {
            if (totalPages >= 6) {
            setpagesToShow([1, 2, 3, "...", totalPages - 1, totalPages]);
            } else {
            const fullList = Array.from({ length: totalPages }, (_, i) => i + 1);
            setpagesToShow(fullList);
            }
            }, [rendezvous.length, totalPages]);

            //let pagesToShow = [1, 2, 3, "...", totalPages - 1, totalPages];

            const handleClick = (page) => {
                if (page !== "..." && page !== currentPage) {
                setCurrentPage(page);
                }
            }



    //toggle boutton
    
    
   
                    
    
         
    




    const modification = (numeropage) => {
    let nouvelleListe = [...pagesToShow] // copie de l'ancien tableau

    if (numeropage > 2 && numeropage < totalPages - 2) {
        nouvelleListe[0] = numeropage - 2
        nouvelleListe[1] = numeropage - 1
        nouvelleListe[2] = numeropage
        nouvelleListe[3] = '...'
    } else if (numeropage === totalPages - 2) {
        nouvelleListe[0] = numeropage - 3
        nouvelleListe[1] = numeropage - 2
        nouvelleListe[2] = numeropage - 1
        nouvelleListe[3] = numeropage
    } else {
        // Peut-être une autre logique ici ?
    }
    console.log(pagesToShow)
    setpagesToShow(nouvelleListe)
    }

    const indexOfLastrendezvous = currentPage * rendezvousPerPage;
    const indexOfFirstrendezvous = indexOfLastrendezvous - rendezvousPerPage;
    //const currentrendezvous = rendezvous.slice(indexOfFirstrendezvous, indexOfLastrendezvous);
    const currentrendezvous = rendezvousFiltres.slice(indexOfFirstrendezvous, indexOfLastrendezvous);
    

    //

    //aficher les détails d'un rendezvous
        //const [user, setuser] = useState({})
        
    //
    
    const navigate = useNavigate();

  
    const consultations = (rdv)=>{
            if(!rdv) return;
            setPopup(false)
            navigate(`/medecin/rendezvous/consultation/${rdv.id}`)
        };

  const dossierMedical = (rdv)=>{
    if(!rdv) return;
    setPopup(false)
    navigate(`/medecin/rendezvous/dossiermedical/${rdv.id}`)
  }

  const handleRowClick = (rdv)=>{
        console.log(rdv)
        setPopup(true)
        setrdvaouvrir(rdv)
  }


  if (isloading) return <p>Chargement...</p>;

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
    return(<>
            
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Gestion des rendez-vous" imgprofil1={imgprofil} nomprofil='bahebeck'> 
                    <Span1>Liste des rendez vous</Span1>
                </Barrehorizontal1>
            </SousDiv1Style>
            
            <SousDiv2Style >
                <div className='affichebarh2'>
                    <div className='recherche'>
                        <img className='iconburger' src={iconburger}></img>
                        <input className='inputrecherche' type="text" id="text1" placeholder='Tapez votre recherche ici'  value={valeurrecherche} onChange={(e) => setvaleurrecherche(e.target.value)} required></input>
                        <img className='iconrecherche' src={iconrecherche}></img>
                    </div>
                    
                </div>
                 
                
                
                <div className='zonedaffichage'>
                    <div className='numero'>
                            <div>
                                <h2 className='nomtable'> Utilisateurs </h2>
                            </div>
                            <div className='divbutton'>
                                <button className='buttonPS' onClick={() => {setCurrentPage(currentPage - 1); modification(currentPage - 1 )}} disabled={currentPage === 1}>Précédent</button>
                                <div>
                                        {pagesToShow.map((page, idx) => (
                                            <ButtonStyle
                                            key={idx}
                                            onClick={() => handleClick(page)}
                                            $buttonbackgroundColor = {page === currentPage ? 'rgba(65, 65, 255, 1)' : ''}
                                            $buttonColor = {page === currentPage ? 'white' : ''}
                                            disabled={page === "..."}
                                            >
                                            {page}
                                            </ButtonStyle>
                                        ))}
                                </div>
                                
                                <button className='buttonPS' onClick={() => {setCurrentPage(currentPage + 1 ); modification(currentPage + 1 )}}
                                disabled={currentPage === totalPages}>Suivant</button>
                            </div>
                            
                    </div>
                        <div className='conteneurbarre'>
                            <div className='barre'></div>
                        </div>
                <div className='affichetableau'>
                   
                    <table className='tableau-2'>
                        <thead>
                        <tr>
                            
                            <th className='th'>Jour</th>
                            <th className='th'>Heure</th>
                            <th className='th'>Service medical</th>
                            <th className='th'>Nom du patient</th>
                            <th className='th'>Nom du medecin</th>
                            <th className='th'>Nom de la salle</th>
                            <th className='th'>Statut</th>
                           
                           
                        </tr>
                        </thead>
                        <tbody>
                        {currentrendezvous.map((rendezvous) => (
                           <tr key={rendezvous.id} className='tr'>
    
                            
                            
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.jour}</td>
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.heure}</td>
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.serviceMedical}</td>
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.patientNomComplet}</td>
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.medecinNomComplet}</td>
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.nomSalle}</td>
                            <td onClick={() => {handleRowClick(rendezvous)}} className='td'>{rendezvous.statut ? "actif" : "inactif"}</td>
                            
                            </tr>
                        ))}
                        </tbody>
                    </table>
                   
                    </div>
                </div>

               
                
            </SousDiv2Style>
    </>)   
}
export default RendezvousMedecin