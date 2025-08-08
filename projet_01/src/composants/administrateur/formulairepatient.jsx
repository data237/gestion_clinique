import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import axios from 'axios';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import { useNavigate } from 'react-router-dom';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import '../../styles/add-buttons.css'



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

const FormulairePatient = () => {

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

  });
  
  

const handleChange = e => {
  const { name, value } = e.target;

  if (name.startsWith("dossierMedical.")) {
    const field = name.split(".")[1];
    setFormData(prev => ({
      ...prev,
      dossierMedical: {
        ...prev.dossierMedical,
        [field]: value
      }
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};
  
  const token = localStorage.getItem('token');

  const handleSubmit = async(e) => {
    console.log(formData)
    e.preventDefault();
    try {
          const response = await axios.post(`${API_BASE}/patients`, formData,
          {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
    console.log(response.data);
    console.log(token);
    } catch (error) {
      console.error('Erreur de connexion :', error);
       console.log(token);
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
    navigate("/admin/patient");
  };
  return (
    
      <>
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Gestion des patients" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1 onClick={handleClick}>Liste des patients</Span1>
                    <Span2 > {">"} Ajouter un patient</Span2>
                </Barrehorizontal1>
            </SousDiv1Style>
            <Afficheformulaireadd>
              <Form onSubmit={handleSubmit}>
                <FormContainer>
                <Title>Créer un patient</Title>
                <TraitHorizontal></TraitHorizontal>
                <Title>Informations générales</Title>
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" name="nom" value={formData.nom} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input id="adresse" name="adresse" value={formData.adresse} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="genre">Genre</Label>
                    <Select id="genre" name="genre" value={formData.genre} onChange={handleChange}>
                      <option value="Femme">Femme</option>
                      <option value="Homme">Homme</option>
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="dateNaissance">Date de naissance</Label>
                    <Input id="dateNaissance" name="dateNaissance" type="date" value={formData.dateNaissance} onChange={handleChange} />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  
                  <FormGroup>
                    <Label htmlFor="telephone">telephone</Label>
                    <Input id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} />
                  </FormGroup>
                </FormRow>
                <TraitHorizontal2></TraitHorizontal2>
                <Title>Dossier médical</Title>
                <FormRow>
                    <FormGroup>
                      <Label htmlFor="groupeSanguin">Groupe sanguin et Rhésus</Label>
                      <Select id='groupeSanguin' name="dossierMedical.groupeSanguin" value={formData.dossierMedical.groupeSanguin} onChange={handleChange}>
                        <option value="">-- Choisir --</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="alergies">Alergies</Label>
                      <Input id='alergies'  name="dossierMedical.allergies" value={formData.dossierMedical.allergies} onChange={handleChange} />
                    </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="traitements">Traitements en cours</Label>
                  <TextArea id='traitements' name="dossierMedical.traitementsEnCours" value={formData.dossierMedical.traitementsEnCours} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor='antecedents'>Antécédents médicaux</Label>
                  <TextArea id='antecedents' name="dossierMedical.antecedentsMedicaux" value={formData.dossierMedical.antecedentsMedicaux} onChange={handleChange} />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <Label htmlFor='observation'>observation</Label>
                  <TextArea id='observation' name="dossierMedical.observations" value={formData.dossierMedical.observations} onChange={handleChange} />
                </FormGroup>
              </FormRow>
                
            </FormContainer>
                <ButtonRow>
                  <Button type="button" onClick={()=> setFormData({
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
                      })}>
                    Annuler
                  </Button>
                  <Button type="submit" primary>
                    Créer un patient
                  </Button>
                </ButtonRow>
            </Form>
            </Afficheformulaireadd>
    </>
  );
};

export default FormulairePatient;
