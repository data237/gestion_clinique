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
import { Link } from 'react-router-dom';
import FormulaireFacture from './formulairefacture';
import { useLoading } from '../LoadingProvider';
import { useConfirmation } from '../ConfirmationProvider';

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

const ModalOverlay = Styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = Styled.div`
  background: white;
  border-radius: 12px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;


function Facture(){
    const { startLoading, stopLoading, isLoading } = useLoading();
    const { showConfirmation } = useConfirmation();
    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil]= useState('')
    const [idfacture, setidfacture] = useState(0)
    const [showFormulaire, setShowFormulaire] = useState(false)
 
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
    const [factures, setfactures] = useState([]);
    const [facturesFiltres, setfacturesFiltres] = useState([]);
  
    const [erreur, setErreur] = useState(null);

   
    const rendezvousPerPage = 8;
   
    
    useEffect(()=>{
        startLoading('fetchFactures');
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
                stopLoading('fetchFactures');
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
    setShowFormulaire(true)
  };

  const handleCloseFormulaire = () => {
    setShowFormulaire(false)
    setidfacture(0)
  }


  



  if (isLoading('fetchFactures')) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Chargement des factures...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>Veuillez patienter</div>
      </div>
    </div>
  );

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
    return(<>
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Factures" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1>Liste des factures impayées</Span1>
                    
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
                                <h2 className='nomtable'> Facture impayee </h2>
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
                            <th className='th'>Montant</th>
                            <th className='th'>Statut</th>
                           
                           
                        </tr>
                        </thead>
                        <tbody>
                        {currentrendezvous.map((facture) => (
                           <tr key={facture.id} className='tr'>
    
                            
                            
                            <td onClick={() => {handleRowClick(facture)}} className='td'>{facture.dateEmission.split("T")[0]}</td>
                            <td onClick={() => {handleRowClick(facture)}} className='td'>{facture.dateEmission.split("T")[1].split(".")[0]}</td>
                            <td onClick={() => {handleRowClick(facture)}} className='td'>{facture.serviceMedicalNom}</td>
                            <td onClick={() => {handleRowClick(facture)}} className='td'>{facture.patientNomComplet}</td>
                             <td onClick={() => {handleRowClick(facture)}} className='td'>{facture.montant}</td>
                            <td onClick={() => {handleRowClick(facture)}} className='td'>{facture.statutPaiement}</td>
                            
                            </tr>
                        ))}
                        </tbody>
                    </table>
                   
                    </div>
                </div>

               
                
            </SousDiv2Style>
            {showFormulaire && (
              <ModalOverlay onClick={handleCloseFormulaire}>
                <ModalContainer onClick={(e) => e.stopPropagation()}>
                  <FormulaireFacture id={idfacture} onClick1={handleCloseFormulaire} />
                </ModalContainer>
              </ModalOverlay>
            )}
    </>)   
}
export default Facture