import '../../composants/tableau.css'
import Styled from 'styled-components'
import { useState, useEffect} from 'react';
import axios from 'axios';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import Barrehorizontal2 from "../../composants/barrehorizontal2";
import Boutton from '../../composants/boutton'
import imgmedecin from '../../assets/imagemedecin.jpg'
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
    height: 65vh;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: rgba(239, 239, 255, 1);
    border-radius: 10px;
`
const AfficheTableauStyle = Styled.div`
   display: flex;
   justify-content: center;
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

const Span1= Styled.span`
    cursor: pointer;
`

// tableau patient
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

    display: ${props => props.$Popupdisplay};
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
function PatientSecretaire(){
        
        const [Popupsupprime, setPopupsupprime] = useState(false)
        const [patientASupprimer, setpatientASupprimer] = useState(null);
        const [valeurrecherche, setvaleurrecherche] = useState('');
        const [currentPage, setCurrentPage] = useState(1);
        const [patients, setPatients] = useState([]);
        const [patientsFiltres, setpatientsFiltres] = useState([]);
        const [erreur, setErreur] = useState(null);
        const [isloading, setisloading] = useState(true);

    const nomprofil = localStorage.getItem('username');

      const patientsPerPage = 7;
    
      
    useEffect(()=>{
         
         const fetchPatients = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8081/Api/V1/clinique/patients',
                    {   headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    }},);
                //console.log(response.data);
              if (response && response.data) {
                setPatients(response.data);
                setpatientsFiltres(response.data);
               } 
            } catch (error) {
                console.error('Erreur lors de la récupération des patients:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                setisloading(false);
            }
    
        };
            fetchPatients();
        },[]);

        useEffect(() => {
                    if (!valeurrecherche.trim()) {
                        setpatientsFiltres(patients); // Si rien à chercher, on affiche tout
                        return;
                    }
        
                    const recherche = valeurrecherche.toLowerCase();
        
                    const resultats = patients.filter((u) =>
                        u.nom.toLowerCase().includes(recherche) ||
                        u.prenom.toLowerCase().includes(recherche) ||
                        u.email.toLowerCase().includes(recherche) 
                        
                    );
        
                    setpatientsFiltres(resultats);
            }, [valeurrecherche, patients]);
    
    const [pagesToShow, setpagesToShow] = useState([]);
    const totalPages = Math.ceil(patients.length / patientsPerPage);
    
    useEffect(() => {
      if (totalPages >= 6) {
        setpagesToShow([1, 2, 3, "...", totalPages - 1, totalPages]);
      } else {
        const fullList = Array.from({ length: totalPages }, (_, i) => i + 1);
        setpagesToShow(fullList);
      }
    }, [patients.length, totalPages]);
    
      //let pagesToShow = [1, 2, 3, "...", totalPages - 1, totalPages];
    
      const handleClick = (page) => {
            if (page !== "..." && page !== currentPage) {
            setCurrentPage(page);
            }
        }
    
  
    
    const supprimerPatient = async () => {
        if (!patientASupprimer) return;

        const token2 = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8081/Api/V1/clinique/patients/${patientASupprimer}`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token2}`,
                'Content-Type': 'application/json',
            },
            });

            // Supprime l'patient localement du tableau
            setPatients((prevData) =>
                prevData.filter((item) => item.id !== patientASupprimer)
            );
            setPopupsupprime(false);
            setpatientASupprimer(null);
            console.log(`patient ${patientASupprimer} supprimé`);
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
        }
        };
    
    
   
    
    
    
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
 const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  //const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);
  const currentPatients = patientsFiltres.slice(indexOfFirstPatient, indexOfLastPatient);


   const navigate = useNavigate();

  const handleRowClick = (patient) => {
    navigate(`/admin/patient/viewpatient/${patient.id}`);
  };

  // gestion popup
 
 
   if (isloading) return <p>Chargement...</p>;

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
    return(<>
            <Overlay onClick={() => setPopupsupprime(false)} $Overlaydisplay = {Popupsupprime ? 'block' : 'none'}/>
            
            <Popupsuppr $Popupdisplay = {Popupsupprime ? 'flex' : 'none'}>
                <p>voulez-vous supprimer ce patient ?</p>
                <Containbouttonpopup>
                    <Bouttonpopup onClick={supprimerPatient}> oui </Bouttonpopup>
                    <Bouttonpopup onClick={()=> setPopupsupprime(false)}> non </Bouttonpopup>
                </Containbouttonpopup>
                                    
            </Popupsuppr>
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Gestion des patients" imgprofil1={imgmedecin} nomprofil={nomprofil}>
                    <Span1>Liste des patients</Span1>
                </Barrehorizontal1> 

            </SousDiv1Style>
            
            <SousDiv2Style >
               
                <Affichebarh2 >
                    <RechercheStyle>
                        <IconburgerStyle src={iconburger}></IconburgerStyle>
                        <InputStyle type="text" id="text1" placeholder='Hinted search text' value={valeurrecherche} onChange={(e) => setvaleurrecherche(e.target.value)} required></InputStyle>
                        <IconrechercheStyle src={iconrecherche}></IconrechercheStyle>
                    </RechercheStyle>
                    <Link to="/admin/patient/add"><BouttonStyle>Ajouter un patient</BouttonStyle></Link>
                </Affichebarh2>
               
                {/*<Affichebarh2 >
                  <Barrehorizontal2><Link to="/admin/patient/add"><Boutton nomboutton="Ajouter un patient"/></Link></Barrehorizontal2>  
                </Affichebarh2>*/}
                
                <ZonedaffichageStyle>
                    <NumeroStyle style={{ marginTop: '10px' }}>
                            <div>
                                <NomtableStyle> Patients </NomtableStyle>
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
                                   
                                <th className='th'>Nom</th>
                                <th className='th'>Prénom</th>
                                <th className='th'>Email</th>
                                <th className='th'>Téléphone</th>
                                <th className='th'>Date_naissance</th>
                                <th className='th'>Adresse</th>
                                <th className='th'>Sexe</th>
                                <th className='action th'>Action</th>
                        
                            </tr>
                            </thead>
                            <tbody>
                            {currentPatients.map((patient) => (
                            <tr key={patient.id} className='tr'>
        
                                
                                <td /*className={`${patient.isActive ? "off" : ""}`}*/ onClick={() => handleRowClick(patient)}>{patient.nom}</td>
                                <td onClick={() => handleRowClick(patient)} className='td'>{patient.prenom}</td>
                                <td onClick={() => handleRowClick(patient)} className='td'>{patient.email}</td>
                                <td onClick={() => handleRowClick(patient)} className='td'>{patient.telephone}</td>
                                <td onClick={() => handleRowClick(patient)} className='td'>{patient.dateNaissance}</td>
                                <td onClick={() => handleRowClick(patient)} className='td'>{patient.adresse}</td>
                                <td onClick={() => handleRowClick(patient)} className='td'>{patient.genre}</td>
                                <td className='bouttons td'>
                                {/*<button
                                    onClick={() => toggleStatus(patient.id)}
                                    className={`toggle-button ${patient.isActive ? "on" : ""}`}
                                    >
                                <div className={ `circle  ${patient.isActive  ? "active" : ""}`} ></div></button>*/}
                                <button onClick={()=> {setpatientASupprimer(patient.id);
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
export default PatientSecretaire