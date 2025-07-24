import '../../composants/tableau.css'
import Styled from 'styled-components'
import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import iconrecherche from '../../assets/iconrecherche.png'
import iconburger from '../../assets/iconburger.png'
import { Link, useNavigate } from 'react-router-dom';

const SousDiv1Style = Styled.div`
 width: 99%;
 padding-left: 1%;
`
const SousDiv2Style = Styled.div`
  width: 99%;
 padding-left: 1%;
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

// gerer les popups

const Popupsuppr= Styled.div`

    display: ${props => props.$Popupsupprdisplay};
    flex-direction: column;
    justify-content:center;
    align-items: center;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 1em;
    color: white;
    width: 350px;
    height: 100px;
    border-radius: 10px;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 10000;
    gap: 20px;
    background-color: rgba(159, 159, 255, 1);
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
  background-color: rgba(0,0,0,0.5);
  z-index: 998;
`
function Rendezvous(){
    //const [isVisible, setisVisible] = useState(0)
    const nomprofil = localStorage.getItem('username');

    // fonction du tableau
    const [Popupsupprime, setPopupsupprime] = useState(false)
    const [rendezvousASupprimer, setrendezvousASupprimer] = useState(null);
    const [statutAmodifier, setstatutAmodifier] = useState(null);
    const [Popupstatut, setPopupstatut] = useState(false)
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
            try {
                const response = await axios.get('http://localhost:8081/Api/V1/clinique/rendezvous',
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
    
    
    const toggleStatus = () => {
        if(!statutAmodifier) return;
           const toggle = async () => {
                const token2 = localStorage.getItem('token');
                try {
                    const response = await axios.patch(`http://localhost:8081/Api/V1/clinique/rendezvous/${statutAmodifier[0]}/status/${!statutAmodifier[1]}`,{rendezvous}, {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${token2}`,
                        'Content-Type': 'application/json',
                    },
                    });
                    const user = response.data
                     setrendezvous((prevData) =>
                        prevData.map((item) =>
                        item.id === statutAmodifier[0] ?  user : item
                        )
                    )
                    
                    setPopupstatut(false)
                    setstatutAmodifier(null)
                    console.log(response.data) ;
                } catch (error) {
                    console.log(error)
                }
                };
                toggle()
                //console.log(`http://localhost:8081/Api/V1/clinique/rendezvous/${id}/status/${!status}`)
        }
                    
    
         
    




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

  const handleRowClick = (rendezvous) => {
    navigate(`/secretaire/rendezvous/viewrendezvous/${rendezvous.id}`);
  };



  const supprimerrendezvous = async () => {
        if (!rendezvousASupprimer) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8081/Api/V1/clinique/rendezvous/${rendezvousASupprimer}`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            });

            setrendezvous((prevrendezvous) =>
            prevrendezvous.filter((u) => u.id !== rendezvousASupprimer)
            );

            setPopupsupprime(false);
            setrendezvousASupprimer(null);
            console.log(`rendezvous ${rendezvousASupprimer} supprimé`);
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
        }
    };



  if (isloading) return <p>Chargement...</p>;

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
    return(<>
            <Overlay onClick={() => setPopupsupprime(false)} $Overlaydisplay = {Popupsupprime || Popupstatut ? 'block' : 'none'}/>
                <Popupsuppr $Popupsupprdisplay = {Popupsupprime ? 'flex' : 'none'}>
                    <p>voulez-vous supprimer cet rendezvous ?</p>
                    <Containbouttonpopup>
                        <Bouttonpopup onClick={supprimerrendezvous}> oui </Bouttonpopup>
                        <Bouttonpopup onClick={()=> setPopupsupprime(false)}> non </Bouttonpopup>
                    </Containbouttonpopup>
                                    
                </Popupsuppr>
                <Popupstat $Popupstatutdisplay = {Popupstatut ? 'flex' : 'none'}>
                    <p>voulez-vous changez le statut de cet rendezvous ?</p>
                    <Containbouttonpopup>
                        <Bouttonpopup onClick={toggleStatus}> oui </Bouttonpopup>
                        <Bouttonpopup onClick={()=> setPopupstatut(false)}> non </Bouttonpopup>
                    </Containbouttonpopup>
                                    
                </Popupstat>
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Gestion des rendez-vous" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1>Liste des rendez vous</Span1>
                </Barrehorizontal1>
            </SousDiv1Style>
            
            <SousDiv2Style >
                
                  <Affichebarh2 >
                        <RechercheStyle>
                            <IconburgerStyle src={iconburger}></IconburgerStyle>
                            <InputStyle type="text" id="text1" placeholder='Hinted search text'  value={valeurrecherche} onChange={(e) => setvaleurrecherche(e.target.value)} required></InputStyle>
                            <IconrechercheStyle src={iconrecherche} ></IconrechercheStyle>
                        </RechercheStyle>
                        <Link to="/secretaire/rendezvous/add"><BouttonStyle>Ajouter un rendez vous</BouttonStyle></Link>
                </Affichebarh2>
                
                
                <ZonedaffichageStyle >
                    <NumeroStyle style={{ marginTop: '10px' }}>
                            <div>
                                <NomtableStyle> Rendez vous </NomtableStyle>
                            </div>
                            <DivbuttonStyle >
                                <ButtonPSStyle onClick={() => {setCurrentPage(currentPage - 1)
                                    modification(currentPage - 1 )
                                }}
                                        disabled={currentPage === 1}>Précédent</ButtonPSStyle>
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
                                
                                <ButtonPSStyle onClick={() => {setCurrentPage(currentPage + 1 )
                                    modification(currentPage + 1 )
                                }}
                                disabled={currentPage === totalPages}>Suivant</ButtonPSStyle>
                            </DivbuttonStyle >
                            
                        </NumeroStyle>
                        <div style={{ margin: '20px 20px' }}>
                            <BarreStyle></BarreStyle>
                        </div>
                <AfficheTableauStyle>
                   
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
                            <th className='th'>Action</th>
                           
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
                             <td className='bouttons'>
                                <button
                                    onClick={() => {setstatutAmodifier([rendezvous.id,rendezvous.statut]);
                                        setPopupstatut(true)
                                    }}
                                    className={`toggle-button ${rendezvous.actif ? "" : "on"}`}
                                    >
                                <div className={ `circle  ${rendezvous.actif  ? "" : "active"}`} ></div></button>
                                <button onClick={()=> {setrendezvousASupprimer(rendezvous.id);
                                                        setPopupsupprime(true);}}>🗑️</button>  
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                   
                    </AfficheTableauStyle>
                </ZonedaffichageStyle>

               
                
            </SousDiv2Style>
    </>)   
}
export default Rendezvous