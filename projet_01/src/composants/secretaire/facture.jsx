import '../../styles/tableau.css'
import '../../styles/Zonedaffichage.css'
import '../../styles/Barrehorizontal2.css'
import '../../styles/facture.css'
import Styled from 'styled-components'
import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import iconrecherche from '../../assets/iconrecherche.png'
import iconburger from '../../assets/iconburger.png'
import { Link } from 'react-router-dom';
import FormulaireFacture from './formulairefacture';

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
const Span2= Styled.span`
  
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

// gerer les popups

const Popupsuppr= Styled.div`

    display: ${props => props.$Popupsupprdisplay};
    position: fixed;
    top: 20%;
    left: 40%;
    z-index: 10000;
   
`
const Popupstat= Styled.div`

    display: ${props => props.$Popupstatutdisplay};
    flex-direction: column;
    justify-content:center;
    align-items: center;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 1em;
    color: white;
    width: 450px;
    height: 100px;
    border-radius: 10px;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 10000;
    gap: 20px;
    background-color: rgba(159, 159, 255, 1);
`

const Containbouttonpopup = Styled.div`

    display: flex;
    
    gap: 30px;
    background-color: rgba(159, 159, 255, 1);
`
const Bouttonpopup =Styled.button`
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 1em;
    width: 80px;
    height: 30px;
    border-radius: 10px;
    background-color: white;
`
const Overlay = Styled.div`
  display: ${props => props.$Overlaydisplay};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.8);
  z-index: 998;
`
function Facture(){
    //const [isVisible, setisVisible] = useState(0)
      const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil]= useState('')
    const [idfacture, setidfacture] = useState(0)
     const [Popup, setPopup] = useState(false)
 
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token);
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
    }, [idUser]);

    const [valeurrecherche, setvaleurrecherche] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isloading, setisloading] = useState(true);
    const [factures, setfactures] = useState([]);
    const [facturesFiltres, setfacturesFiltres] = useState([]);
  
    const [erreur, setErreur] = useState(null);

   
    const rendezvousPerPage = 8;
   
    
    useEffect(()=>{
         
         const fetchfactures = async () => {
            const token = localStorage.getItem('token');
              console.log(token);
            try {
                const response = await axios.get(`${API_BASE}/factures/statut/impayee`,
                    {   headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    }},);
                console.log(token);
              if (response && response.data) {
                setfactures(response.data);
                setfacturesFiltres(response.data);
                } else {
                //setErreur('Données introuvables');
                }
            } catch (error) {
                console.log('Erreur lors de la récupération des rendezvous:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                setisloading(false);
            }
    
        };
            fetchfactures();
        },[]);
        
    useEffect(() => {
            if (!valeurrecherche.trim()) {
                setfactures(factures); // Si rien à chercher, on affiche tout
                return;
            }

            const recherche = valeurrecherche.toLowerCase();

            const resultats = factures.filter((u) =>
                u.dateEmission.toLowerCase().includes(recherche) ||
                u.patientNomComplet.toLowerCase().includes(recherche) ||
                u.serviceMedicalNom.toLowerCase().includes(recherche) 
            );

            setfactures(resultats);
    }, [valeurrecherche, factures]);





    const [pagesToShow, setpagesToShow] = useState([]);
    const totalPages = Math.ceil(factures.length / rendezvousPerPage);

    useEffect(() => {
            if (totalPages >= 6) {
            setpagesToShow([1, 2, 3, "...", totalPages - 1, totalPages]);
            } else {
            const fullList = Array.from({ length: totalPages }, (_, i) => i + 1);
            setpagesToShow(fullList);
            }
            }, [factures.length, totalPages]);

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
    const currentrendezvous = facturesFiltres.slice(indexOfFirstrendezvous, indexOfLastrendezvous);
    

    //

    //aficher les détails d'un rendezvous
        //const [user, setuser] = useState({})
        
    //
   

  const handleRowClick = (facture) => {
    setidfacture(facture.id)
    setPopup(true)
  };



  



  if (isloading) return <p>Chargement...</p>;

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
    return(<>
            <Overlay onClick={() => setPopup(false)} $Overlaydisplay = { Popup ? 'block' : 'none'}/>
                <Popupsuppr $Popupsupprdisplay = {Popup ? 'block' : 'none'}>
                   <FormulaireFacture id={idfacture} onClick1={()=> setPopup(false)} />                 
                </Popupsuppr>
                            
            <div className="facture-container">
                <div className="facture-header">
                    <Barrehorizontal1 titrepage="Factures" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                        <Span1>Liste des factures impayées</Span1>
                    </Barrehorizontal1>
                </div>
                
                <div className="search-container">
                    <div className="search-bar">
                        <img className="search-icon" src={iconburger} alt="Menu" />
                        <input 
                            className="search-input" 
                            type="text" 
                            placeholder="Rechercher une facture..."  
                            value={valeurrecherche} 
                            onChange={(e) => setvaleurrecherche(e.target.value)} 
                            required
                        />
                        <img className="search-icon" src={iconrecherche} alt="Rechercher" />
                    </div>
                </div>
                
                <div className="table-container">
                    <div className="table-header">
                        <div className="table-title">
                            Factures impayées
                        </div>
                        <div className="pagination-controls">
                            <button 
                                className="pagination-button" 
                                onClick={() => {setCurrentPage(currentPage - 1); modification(currentPage - 1 )}} 
                                disabled={currentPage === 1}
                            >
                                ← Précédent
                            </button>
                            <div className="page-numbers">
                                {pagesToShow.map((page, idx) => (
                                    <button
                                        key={idx}
                                        className={`page-number ${page === currentPage ? 'active' : ''}`}
                                        onClick={() => handleClick(page)}
                                        disabled={page === "..."}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button 
                                className="pagination-button" 
                                onClick={() => {setCurrentPage(currentPage + 1 ); modification(currentPage + 1 )}}
                                disabled={currentPage === totalPages}
                            >
                                Suivant →
                            </button>
                        </div>
                    </div>
                    
                    <div className="table-content">
                        <table className="medical-table">
                            <thead>
                                <tr>
                                    <th>📅 Date</th>
                                    <th>🕐 Heure</th>
                                    <th>🏥 Service médical</th>
                                    <th>👤 Patient</th>
                                    <th>💰 Montant</th>
                                    <th>📊 Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentrendezvous.map((facture) => (
                                    <tr key={facture.id} onClick={() => {handleRowClick(facture)}}>
                                        <td className="date-cell">{facture.dateEmission.split("T")[0]}</td>
                                        <td className="time-cell">{facture.dateEmission.split("T")[1].split(".")[0]}</td>
                                        <td className="service-medical">{facture.serviceMedicalNom}</td>
                                        <td className="patient-name">{facture.patientNomComplet}</td>
                                        <td className="amount">{facture.montant} FCFA</td>
                                        <td>
                                            <span className={`status-badge status-${facture.statutPaiement.toLowerCase()}`}>
                                                {facture.statutPaiement}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    </>)   
}
export default Facture