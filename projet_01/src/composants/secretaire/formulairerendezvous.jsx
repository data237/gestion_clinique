import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import FormulaireFacture from './formulairefacture';
import '../../styles/add-buttons.css'


const SousDiv1Style = Styled.div`
 width: 99%;

`
const Span2= Styled.span`
    display: ${props => props.$Spandisplay2};
`
const Span1= Styled.span`
    cursor: pointer;
`
const Span3 = Styled.span`
    display: ${props => props.$Spandisplay3};
`
const Afficheformulaireadd = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const FormContainer = Styled.div`

  position: relative;
  overflow: hidden;
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  font-family: sans-serif;
  border: 1px solid rgba(217, 217, 217, 1);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${fondImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.1; /* ⬅️ Réduit l’opacité de l’image seulement */
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const Title = Styled.h2`
  margin-bottom: 0px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  padding-bottom: 10px;
  font-family: Roboto;
`;

const TraitHorizontal = Styled.div`
  width: 718px;
  height: 5px;
  angle: 0 deg;
  opacity: 1;
  border-radius: 2.5px;
  background-color: rgba(159, 159, 255, 1);
  margin-bottom: 20px;
`

const FormRow = Styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const FormGroup = Styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const FormGroupvisible = Styled.div`
  flex: 1;
  display: ${props => props.$formgroupdisplay || "flex"};
  flex-direction: column;
`;
const Form = Styled.form`

  margin: 0;
  padding-left:0;
  width: 766px;
`
const Label = Styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: rgba(51, 51, 51, 1);
`;

const Input = Styled.input`
  padding: 10px;
  border: 1px solid rgba(217, 217, 217, 1);
  border-radius: 8px;
  width: 351px;
  color: rgba(30, 30, 30, 1);
  &:focus{
    border: 1px solid rgba(217, 217, 217, 1);
  }
`;

const Select = Styled.select`
  min-width: 351px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;
const TextArea = Styled.textarea`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
`;
const ButtonRow = Styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
`;

const Button = Styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  border: 2px solid #1e40af;
  background: ${props => props.$primary ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' : 'transparent'};
  color: ${props => props.$primary ? '#ffffff' : '#1e40af'};
  font-weight: 600;
  font-size: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  width: 375px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: ${props => props.$primary ? '0 4px 6px rgba(0, 0, 0, 0.07)' : 'none'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    background: ${props => props.$primary ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' : '#f0f9ff'};
    color: ${props => props.$primary ? '#ffffff' : '#1e40af'};
    transform: translateY(-1px);
    box-shadow: ${props => props.$primary ? '0 10px 15px rgba(0, 0, 0, 0.1), 0 0 20px rgba(30, 64, 175, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.07)'};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
`;


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
const Popupsuppr= Styled.div`

    display: ${props => props.$Popupsupprdisplay};
    position: fixed;
    top: 20%;
    left: 40%;
    z-index: 10000;
   
`
const FormulaireRendezVous = () => {

    const idUser = localStorage.getItem('id');
    const { nompatient } = useParams();
    const [nomprofil, setnomprofil]= useState('')
    const [idfacture, setidfacture] = useState(0)
    const [Popup, setPopup] = useState(false)

    const [patient, setpatient] = useState(null);
    //const [nommedecin, setnommedecin] = useState('mabou')
    const [medecinsdisponible, setmedecindisponible] = useState([])
    //const [medecinid, setmedecinid] = useState(null)
    const [erreur, setErreur] = useState(null);
    const [isloading, setisloading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
           const nompatient =  async ()=> {
                try {
                const response = await axios.get(`${API_BASE}/utilisateurs/${idUser}`,
                    {   headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    }},);
                
              if (response) {
                 setnomprofil(response.data.nom)
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des patients:', error);
                
            } finally {
              console.log('fin')
            }
            }
            nompatient()
    }, [idUser]);


    const [formData, setFormData] = useState({
        patientId: "",
        heure: "00:00:00",
        jour: "2025-07-03",
        note: "",
        serviceMedical: "CARDIOLOGIE",
        medecinId: 2,
        });

   
        
      useEffect(()=>{
         
         const fetchpatients = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${API_BASE}/patients/nom/${nompatient}`,
                    {   headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    }});
                
               const patientTrouve = response.data[0];

                if (patientTrouve) {
                  setpatient(patientTrouve);
                  setFormData((prev) => ({
                    ...prev,
                    patientId: patientTrouve.id,
                  }));
                } else {
                  setErreur('Aucun patient trouvé');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des patients:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                setisloading(false);
            }
    
        };
            fetchpatients();
        },[nompatient]);


         useEffect(()=>{
         
         const fetchmedecins = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${API_BASE}/utilisateurs/available/${formData.serviceMedical}?jour=${formData.jour}&heure=${formData.heure}`,
                    {   headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    }});
                    const medecins = response.data
                    setmedecindisponible(medecins)
              console.log(response)
            } catch (error) {
                console.error('Erreur lors de la récupération des medecins disponibles:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                setisloading(false);
            }
    
        };
            fetchmedecins();
        },[formData]);
  
 
    
  

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async(e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();
    try {
        const response = await axios.post(`${API_BASE}/rendezvous/createRendezVous`, formData,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data);
    setidfacture(response.data.factureId)
    setPopup(true)
      } catch (error) {
      console.error('Erreur de connexion :', error);
      console.log(token)
    } finally{
     /*setFormData({
          nom: "",
          prenom: "",
          email: "",
          dateNaissance: "",
          telephone: "",
          adresse: "",
          genre: "m",
          password: "",
          serviceMedicalName: "",
          actif: true,
          role: ""
        });*/
    };
    console.log(formData)
  };
  let navigate = useNavigate();

  const handleClick = () => {
    // Redirige vers /patient
    navigate("/secretaire/patient");
  };

   if (!patient) {
  return <p style={{ textAlign: 'center' }}>Chargement...</p>;
  }
  if (isloading) return <p>Chargement...</p>;

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
  return (
    <>
          <Overlay onClick={() => setPopup(false)} $Overlaydisplay = { Popup ? 'block' : 'none'}/>
          <Popupsuppr $Popupsupprdisplay = {Popup ? 'block' : 'none'}>
            <FormulaireFacture id={idfacture} onClick1={()=> setPopup(false)}/>
          </Popupsuppr>
        <SousDiv1Style>
        <Barrehorizontal1 titrepage="Gestion des patients" imgprofil1={imgprofil} nomprofil={nomprofil}> 
            <Span1 onClick={handleClick}>Liste des patients</Span1>
            <Span2 > {">"} Creer un rendez-vous </Span2>
        </Barrehorizontal1>
        </SousDiv1Style>
        <Afficheformulaireadd>
            <Form onSubmit={handleSubmit}>
                <FormContainer>
                    <Title>Info du patient</Title>
                    <TraitHorizontal></TraitHorizontal>
                    <FormRow>
                        <FormGroup>
                            <Label htmlFor="nom">Nom</Label>
                            <Input id="nom" name="nom" value={patient.nom} readOnly/>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="prenom">Prénom</Label>
                            <Input id="prenom" name="prenom" value={patient.prenom} readOnly/>
                        </FormGroup>
                    </FormRow>

                    <FormRow>
                    <FormGroup>
                        <Label htmlFor="adresse">Adresse</Label>
                        <Input id="adresse" name="adresse" value={patient.adresse} readOnly/>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={patient.email} readOnly/>
                    </FormGroup>
                    </FormRow>

                    <FormRow>
                        <FormGroup>
                            <Label htmlFor="genre">Genre</Label>
                            <Input id="genre" name="genre" value={patient.genre}  readOnly>
                        </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="dateNaissance">Date de naissance</Label>
                            <Input id="dateNaissance" name="dateNaissance" type="date" value={patient.dateNaissance} readOnly/>
                        </FormGroup>
                    </FormRow>
                    <FormRow>
                    <FormGroup>
                        <Label htmlFor="telephone">telephone</Label>
                        <Input id="telephone" name="telephone" value={patient.telephone} readOnly />
                    </FormGroup>
                    </FormRow>
            
                    <Title>Info du rendez-vous</Title>
                    <TraitHorizontal></TraitHorizontal>
                    <FormRow>
                        <FormGroup>
                            <Label htmlFor="jour">Date</Label>
                            <Input id="jour" name="jour"  type='date' value={formData.jour}  onChange={handleChange}>
                        </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="heure">Heure</Label>
                            <Input id="heure" name="heure" type="time" value={formData.heure}  onChange={handleChange} step={1}/>
                        </FormGroup>
                    </FormRow>

                    <FormRow>
                        
                        <FormGroupvisible >
                            <Label htmlFor="servicemedical">Service médical</Label>
                            <Select id="servicemedical" name="serviceMedical" value={formData.serviceMedical} onChange={handleChange} >
                                <option value="CARDIOLOGIE">CARDIOLOGIE</option>
                                <option value="MEDECINE_GENERALE">MEDECINE_GENERALE</option>
                                <option value="PEDIATRIE">PEDIATRIE</option>
                                <option value="GYNECOLOGIE">GYNECOLOGIE</option>
                                <option value="DERMATOLOGIE">DERMATOLOGIE</option>
                                <option value="OPHTAMOLOGIE">OPHTAMOLOGIE</option>
                                <option value="ORTHOPEDIE">ORTHOPEDIE</option>
                                <option value="RADIOLOGIE">RADIOLOGIE</option>
                                <option value="LABORATOIRE_ANALYSES">LABORATOIRE_ANALYSES</option>
                                <option value="URGENCES">URGENCES</option>
                                <option value="KINESITHERAPIE">KINESITHERAPIE</option>
                                
                            </Select>
                        </FormGroupvisible>
                        <FormGroup>
                            <Label htmlFor="medecin">Medecin</Label>
                            <Select id="medecin" name="medecinId" value={formData.medecinId} onChange={handleChange}>
                              <option value="">Sélectionnez un medecin</option>
                              {medecinsdisponible.map((medecin)=>(<option key={medecin.id} value={parseInt(medecin.id)}>{medecin.nom} {medecin.prenom}</option>))}
                            </Select>
                        </FormGroup>
                    </FormRow>
                    <FormRow>
                        <FormGroup>
                          <Label htmlFor="note">Note</Label>
                          <TextArea id='note' name="note" value={formData.note} onChange={handleChange} />
                        </FormGroup>
                    </FormRow>
                </FormContainer>
                <ButtonRow>
                    <Button type="button" onClick={()=> setFormData({ nom: '', prenom: '', adresse: '', email: '', genre: '', password: " ",dateNaissance: '',telephone: "", role: '',serviceMedicalName:'' })}>
                        Annuler
                    </Button>
                    <Button type="submit" $primary>
                        Créer un rendez-vous
                    </Button>
                </ButtonRow>
            </Form>
        </Afficheformulaireadd>
    </>
  );
};

export default FormulaireRendezVous;
