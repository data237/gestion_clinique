import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import axios from 'axios';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import { useParams, useNavigate } from 'react-router-dom';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import FormulairePrescription from './formulaireprescription';



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
const SousDiv1Style = Styled.div`
 width: 99%;
 
`
const Span2= Styled.span`
    
`
const Span1= Styled.span`
    cursor: pointer;
`
const Afficheformulaireadd = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
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
const TraitHorizontal2 = Styled.div`
  width: 718px;
  height: 5px;
  angle: 0 deg;
  opacity: 1;
  border-radius: 2.5px;
  background-color: rgba(217, 217, 217, 1);
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

const Form = Styled.form`
  margin: 0;
  padding-left:0;
  width: 766px;
`
const Label = Styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: #333333;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
`;

const Input = Styled.input`
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 351px;
  color: #333333;
  background-color: #ffffff;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  
  &:focus{
    border: 1px solid #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = Styled.select`
  min-width: 351px;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333333;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  
  &:focus {
    border: 1px solid #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
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
  padding: 12px 20px;
  border-radius: 20px;
  border: 1px solid rgba(159, 159, 255, 1);
  background: ${props => props.primary ? 'rgba(159, 159, 255, 1)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'rgba(159, 159, 255, 1)'};
  font-weight: 500;
  font-size: 20px;
  font-familly: Roboto;
  width:375px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: ${props => props.primary ? 'rgba(239, 239, 255, 1)' : '#f2f2ff'};
    color: ${props => props.primary ? 'rgba(159, 159, 255, 1)' : 'rgba(159, 159, 255, 1)'};
  }
`;
//gestion popup
const Popupsuppr= Styled.div`

    display: ${props => props.$Popupsupprdisplay};
    position: fixed;
    top: 20%;
    left: 40%;
    z-index: 10000;
   
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

const FormulaireConsultation = () => {

    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil]= useState('')
   // const [idprescription, setidprescription] = useState(null)
    //const [Popup, setPopup] = useState(false)
    const idrendezvous = useParams()
    const idrdv = parseInt(idrendezvous.idrendezvous)

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
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                
            } finally {
              console.log('fin')
            }
            }
            nomutilisateur()
    }, [idUser]);

  
  const [formData, setFormData] = useState({
    motifs: "",
    tensionArterielle: "",
    temperature: 0.1,
    poids: 0.1,
    taille: 0.1,
    compteRendu: "",
    diagnostic: "",
    rendezVousId: idrdv,
    prescriptions: [
        {
        typePrescription: "",
        medicaments: "",
        instructions: "",
        dureePrescription: "",
        quantite: 9007199254740991
        }
    ]

    });
  
  

const handleChange = e => {
  e.preventDefault
  const { name, value } = e.target;

  // Champs numériques à convertir
  const champsNumeriques = ["temperature", "poids", "taille", "quantite"];

  // Si le champ est dans prescriptions[0]
  if (name.startsWith("prescriptions[0].")) {
    const field = name.split(".")[1];
    setFormData(prev => ({
      ...prev,
      prescriptions: [
        {
          ...prev.prescriptions[0],
          [field]: champsNumeriques.includes(field)
            ? parseFloat(value) || 0
            : value
        }
      ]
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: champsNumeriques.includes(name)
        ? parseFloat(value) || 0
        : value
    }));
  }
};

 
  const token = localStorage.getItem('token');

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
          const response = await axios.post(`${API_BASE}/consultations/start/${idrdv}`, formData,
          {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        console.log(response.data.prescriptions[0].id)
        //setidprescription(id)
        //setPopup(true);
    } catch (error) {
      console.error('Erreur de connexion :', error);
    } finally{
     /*setFormData({
          nom: "",
          prenom: "",
          email: "",
          dateNaissance: "",
          telephone: "",
          adresse: "",
          genre: "",
          dossierMedical: {
            groupeSanguin: "",
            antecedentsMedicaux: "",
            allergies: "",
            traitementsEnCours: "",
            observations: "",
            }
        });*/
    };
  };


/* const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };*/

  let navigate = useNavigate();

  const handleClick = () => {
    // Redirige vers /utilisateur
    navigate("/medecin/rendezvous");
  };
  return (
    
      <>

            {/*<Overlay onClick={() => setPopup(false)} $Overlaydisplay = { Popup ? 'block' : 'none'}/>
            <Popupsuppr $Popupsupprdisplay = {Popup ? 'block' : 'none'}>
                {<FormulairePrescription id={idprescription}/>}                
            </Popupsuppr>*/}
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Gestion des patients" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1 onClick={handleClick}>Liste des rendez vous</Span1>
                    <Span2 > {">"} Créer une consultation </Span2>
                </Barrehorizontal1>
            </SousDiv1Style>
            <Afficheformulaireadd>
              <Form onSubmit={handleSubmit}>
                <FormContainer>
                <Title>Créer une consultation</Title>
                <TraitHorizontal></TraitHorizontal>
                
                <FormRow>
                    <FormGroup>
                        <Label htmlFor="motifs">Motifs</Label>
                        <TextArea id='motifs' name="motifs" value={formData.motifs} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="tensionArterielle">Traitements en cours</Label>
                        <TextArea id='tensionArterielle' name="tensionArterielle" value={formData.tensionArterielle} onChange={handleChange} />
                    </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input id="temperature" name="temperature" type='number' step="0.01" value={formData.temperature} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="poids">Poids</Label>
                    <Input id="poids" name="poids" type='number' step="0.01" value={formData.poids} onChange={handleChange} />
                  </FormGroup>
                </FormRow>

                <FormRow>
                     <FormGroup>
                        <Label htmlFor="compteRendu">Compte rendu</Label>
                        <TextArea id='compteRendu' name="compteRendu" value={formData.compteRendu} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="diagnostic">Diagnostic</Label>
                        <TextArea id='diagnostic' name="diagnostic" value={formData.diagnostic} onChange={handleChange} />
                    </FormGroup>
                </FormRow>
                <FormRow>
                    <FormGroup>
                        <Label htmlFor="taille">Taille</Label>
                        <Input id="taille" name="taille" type='number' step="0.01" value={formData.taille} onChange={handleChange} />
                    </FormGroup>
                </FormRow>
                
                <Title>Prescription</Title>
                <TraitHorizontal2></TraitHorizontal2>
                <FormRow>
                    <FormGroup>
                        <Label htmlFor="typePrescription">Type prescription</Label>
                        <TextArea id='typePrescription' name="prescriptions[0].typePrescription" value={formData.prescriptions[0].typePrescription} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="medicaments">Medicaments</Label>
                        <TextArea id='medicaments' name="prescriptions[0].medicaments" value={formData.prescriptions[0].medicaments} onChange={handleChange} />
                    </FormGroup>        
                </FormRow>

              <FormRow>
                <FormGroup>
                    <Label htmlFor="instructions">Instructions</Label>
                    <TextArea id='instructions' name="prescriptions[0].instructions" value={formData.prescriptions[0].instructions} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="dureePrescription">Duree prescription</Label>
                    <TextArea id='dureePrescription' name="prescriptions[0].dureePrescription" value={formData.prescriptions[0].dureePrescription} onChange={handleChange} />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                    <Label htmlFor="quantite">Quantite</Label>
                    <Input id="quantite" name="prescriptions[0].quantite" type='number' step="0.01" value={formData.prescriptions[0].quantite} onChange={handleChange} />
                </FormGroup>
              </FormRow>
                
            </FormContainer>
                <ButtonRow>
                  <Button type="button" onClick={handleClick}>
                    Annuler
                  </Button>
                  <Button type="submit" primary>
                    Créer la consultation
                  </Button>
                </ButtonRow>
            </Form>
            </Afficheformulaireadd>
    </>
  );
};

export default FormulaireConsultation;
