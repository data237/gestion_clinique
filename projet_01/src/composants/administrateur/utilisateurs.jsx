import '../../styles/tableau.css'
import '../../styles/Zonedaffichage.css'
import '../../styles/Barrehorizontal2.css'
import '../../styles/add-buttons.css'
import Styled from 'styled-components'
import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import iconrecherche from '../../assets/iconrecherche.png'
import iconsupprime from '../../assets/Iconsupprime.svg'
import iconburger from '../../assets/iconburger.png'
import { Link, useNavigate } from 'react-router-dom';

const SousDiv1Style = Styled.div`
    padding-right: 32px;
`
const SousDiv2Style = Styled.div`
   width: 100%;
  padding-right: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`





const Span1= Styled.span`
    cursor: pointer;
`



const ButtonStyle = Styled.button`
    width: 25px;
    height: 25px;
    
    font-family: Roboto;
    font-weight: 300;
    font-size: 0.8em;
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
    padding: 32px;
    border-radius: 16px;
    gap: 30px;
    background-color: white;
`
const Bouttonpopup =Styled.button`
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 1em;
    min-width: 150px;
    padding: 16px;
    border-radius: 16px;
    border: 1px solid rgba(159, 159, 255, 1);
    color: rgba(159, 159, 255, 1);
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
function Utilisateur(){
    //const [isVisible, setisVisible] = useState(0)
    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil]= useState('')

    useEffect(() => {
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
                } else {
                setErreur('Données introuvables');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                setisloading(false);
            }
            }
            nomutilisateur()
    }, [idUser]);

    // fonction du tableau
    const [Popupsupprime, setPopupsupprime] = useState(false)
    const [utilisateurASupprimer, setUtilisateurASupprimer] = useState(null);
    const [statutAmodifier, setstatutAmodifier] = useState(null);
    const [Popupstatut, setPopupstatut] = useState(false)
    const [valeurrecherche, setvaleurrecherche] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isloading, setisloading] = useState(true);
    const [utilisateurs, setutilisateurs] = useState([]);
    const [utilisateursFiltres, setUtilisateursFiltres] = useState([]);
    const [erreur, setErreur] = useState(null);


    const utilisateursPerPage = 8;

    

    useEffect(()=>{
         
         const fetchUtilisateurs = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${API_BASE}/utilisateurs`,
                    {   headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    }},);
                console.log(token);
              if (response && response.data) {
                setutilisateurs(response.data);
               setUtilisateursFiltres(response.data);
                } else {
                setErreur('Données introuvables');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                setisloading(false);
            }
    
        };
            fetchUtilisateurs();
        },[]);
        
    useEffect(() => {
            if (!valeurrecherche.trim()) {
                setUtilisateursFiltres(utilisateurs); // Si rien à chercher, on affiche tout
                return;
            }

            const recherche = valeurrecherche.toLowerCase();

            const resultats = utilisateurs.filter((u) =>
                u.nom.toLowerCase().includes(recherche) ||
                u.prenom.toLowerCase().includes(recherche) ||
                u.email.toLowerCase().includes(recherche) ||
                u.role.roleType.toLowerCase().includes(recherche)
            );

            setUtilisateursFiltres(resultats);
    }, [valeurrecherche, utilisateurs]);





    const [pagesToShow, setpagesToShow] = useState([]);
    const totalPages = Math.ceil(utilisateurs.length / utilisateursPerPage);

    useEffect(() => {
            if (totalPages >= 6) {
            setpagesToShow([1, 2, 3, "...", totalPages - 1, totalPages]);
            } else {
            const fullList = Array.from({ length: totalPages }, (_, i) => i + 1);
            setpagesToShow(fullList);
            }
            }, [utilisateurs.length, totalPages]);

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
                    const response = await axios.patch(`${API_BASE}/utilisateurs/${statutAmodifier[0]}/status/${!statutAmodifier[1]}`,{utilisateurs}, {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${token2}`,
                        'Content-Type': 'application/json',
                    },
                    });
                    const user = response.data
                     setutilisateurs((prevData) =>
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
                //console.log(`http://localhost:8081/Api/V1/clinique/utilisateurs/${id}/status/${!status}`)
        }
                    
    
    /*
    const supprimerUtilisateur = async (id) => {
        const token2 = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8081/Api/V1/clinique/utilisateurs/${id}`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token2}`,
                'Content-Type': 'application/json',
            },
            });

            // Supprime l'utilisateur localement du tableau
            setutilisateurs((prevData) =>
                prevData.filter((item) => item.id !== id)
            );

            console.log(`Utilisateur ${id} supprimé`);
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
        }
        };
      */      
    




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

    const indexOfLastutilisateur = currentPage * utilisateursPerPage;
    const indexOfFirstutilisateur = indexOfLastutilisateur - utilisateursPerPage;
    //const currentutilisateurs = utilisateurs.slice(indexOfFirstutilisateur, indexOfLastutilisateur);
    const currentutilisateurs = utilisateursFiltres.slice(indexOfFirstutilisateur, indexOfLastutilisateur);
    

    //

    //aficher les détails d'un utilisateur
        //const [user, setuser] = useState({})
        
    //
     const navigate = useNavigate();

  const handleRowClick = (utilisateur) => {
    navigate(`/admin/utilisateur/viewuser/${utilisateur.id}`);
  };



  const supprimerUtilisateur = async () => {
    console.log('mabou')
        if (!utilisateurASupprimer) return;

        const token2 = localStorage.getItem('token');
        try {
            await axios.delete(`${API_BASE}/utilisateurs/${utilisateurASupprimer}`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token2}`,
                'Content-Type': 'application/json',
            },
            });

            setutilisateurs((prevUtilisateurs) =>
            prevUtilisateurs.filter((u) => u.id !== utilisateurASupprimer)
            );

            setPopupsupprime(false);
            setUtilisateurASupprimer(null);
            console.log(`Utilisateur ${utilisateurASupprimer} supprimé`);
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
        }
    };



  if (isloading) return <p>Chargement...</p>;

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
    return(<>
            <Overlay onClick={() => setPopupsupprime(false)} $Overlaydisplay = {Popupsupprime || Popupstatut ? 'block' : 'none'}/>
                <Popupsuppr $Popupsupprdisplay = {Popupsupprime ? 'flex' : 'none'}>
                    <p>voulez-vous supprimer cet utilisateur ?</p>
                    <Containbouttonpopup>
                        <Bouttonpopup onClick={supprimerUtilisateur}> oui </Bouttonpopup>
                        <Bouttonpopup onClick={()=> setPopupsupprime(false)}> non </Bouttonpopup>
                    </Containbouttonpopup>
                                    
                </Popupsuppr>
                <Popupstat $Popupstatutdisplay = {Popupstatut ? 'flex' : 'none'}>
                    <p>voulez-vous changez le statut de cet utilisateurs ?</p>
                    <Containbouttonpopup>
                        <Bouttonpopup onClick={toggleStatus}> oui </Bouttonpopup>
                        <Bouttonpopup onClick={()=> setPopupstatut(false)}> non </Bouttonpopup>
                    </Containbouttonpopup>
                                    
                </Popupstat>
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Gestion des utilisateurs" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1>Liste des utilisateurs</Span1>
                </Barrehorizontal1>
            </SousDiv1Style>
            
            <SousDiv2Style >
               <div className='affichebarh2'>
                    <div className='recherche'>
                        <img className='iconburger' src={iconburger}></img>
                        <input className='inputrecherche' type="text" id="text1" placeholder='Tapez votre recherche ici'  value={valeurrecherche} onChange={(e) => setvaleurrecherche(e.target.value)} required></input>
                        <img className='iconrecherche' src={iconrecherche}></img>
                    </div>
                    <Link to="/admin/utilisateur/add"><button className='boutton'>Ajouter un utilisateur</button></Link>
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
                                <th className='th'>Nom</th>
                                <th className='th'>Prénom</th>
                                <th className='th'>Email</th>
                                <th className='th'>Rôle</th>
                                <th className='th'>Statut</th>
                                <th className='action th'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentutilisateurs.map((utilisateur) => (
                           <tr key={utilisateur.id} className='tr'>
                            <td className={`${utilisateur.actif ? "" : "off"} td`} onClick={() => {handleRowClick(utilisateur)}}>{utilisateur.nom}</td>
                            <td className={`${utilisateur.actif ? "" : "off"} td`} onClick={() => {handleRowClick(utilisateur)}}>{utilisateur.prenom}</td>
                            <td className={`${utilisateur.actif ? "" : "off"} td`} onClick={() => {handleRowClick(utilisateur)}}>{utilisateur.email}</td>
                            <td className={`${utilisateur.actif ? "" : "off"} td`} onClick={() => {handleRowClick(utilisateur)}}>{utilisateur.role.roleType}</td>
                            <td className={`${utilisateur.actif ? "" : "off"} td`} onClick={() => {handleRowClick(utilisateur)}}>{utilisateur.actif ? "actif" : "inactif"}</td>
                            <td className='td bouttons'>
                                <button onClick={() => {setstatutAmodifier([utilisateur.id,utilisateur.actif]);setPopupstatut(true)}} className={`toggle-button ${utilisateur.actif ? "" : "on"}`}>
                                    <div className={ `circle  ${utilisateur.actif  ? "" : "active"}`} ></div>
                                </button>
                                <button onClick={()=> {setUtilisateurASupprimer(utilisateur.id); setPopupsupprime(true)}}><img src={iconsupprime} className='iconsupprime'></img></button>    
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    
                    </div>
                </div>

               
                
            </SousDiv2Style>
    </>)   
}
export default Utilisateur