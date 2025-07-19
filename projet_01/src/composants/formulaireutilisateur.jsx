import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Styled from 'styled-components';
import fondImage from '../assets/backgroundimageuserform.jpg';
import Barrehorizontal1 from '../composants/barrehorizontal1';
import imgprofil from '../assets/photoDoc.png'
const nomprofil = ' Dr Atagana A. T.'

const SousDiv1Style = Styled.div`
 width: 99%;
 padding-left: 1%;
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
  display: ${props => props.$formgroupdisplay || "none"};
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

const FormulaireUtilisateur = () => {
  const [formData, setFormData] = useState({
   
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

  });
  const [isVisible, setisVisible] = useState(false)
    
  

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
 const handleChangerole = e => {
    const { name, value } = e.target;
    value === "medecin" ? setisVisible(true) : setisVisible(false)
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const token = localStorage.getItem('token');
  const formData2 = {
       nom : formData.nom,
       prenom : formData.prenom,
       email : formData.email,
       dateNaissance : formData.dateNaissance,
       telephone : formData.telephone,
       adresse :  formData.adresse,
       genre : formData.genre,
       password :  formData.password,
       actif : formData.actif,
       role :  formData.role
      }
  const handleSubmit = async(e) => {
    console.log(formData)
    e.preventDefault();
    try {
      if(formData.role != "medecin"){
        const response = await axios.post('http://localhost:8081/Api/V1/clinique/utilisateurs', formData2,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data);
      }else{
        const response = await axios.post('http://localhost:8081/Api/V1/clinique/utilisateurs', formData,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data);
      }
      

    

    } catch (error) {
      console.error('Erreur de connexion :', error);
      console.log(token)
      console.log(formData.serviceMedicalName)
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
  };


  let navigate = useNavigate();

  const handleClick = () => {
    // Redirige vers /utilisateur
    navigate("/admin/utilisateur");
  };
  return (<>
              <SousDiv1Style>
                <Barrehorizontal1 titrepage="Gestion des utilisateurs" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1 onClick={handleClick}>Liste des utilisateurs</Span1>
                    <Span2 > {">"} Ajouter un utilisateur</Span2>
                </Barrehorizontal1>
            </SousDiv1Style>
      <Afficheformulaireadd>
      <Form onSubmit={handleSubmit}>
        <FormContainer>
        <Title>Créer un utilisateur</Title>
        <TraitHorizontal></TraitHorizontal>
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
              <option value="Femme">F</option>
              <option value="Homme">H</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="dateNaissance">Date de naissance</Label>
            <Input id="dateNaissance" name="dateNaissance" type="date" value={formData.dateNaissance} onChange={handleChange} />
          </FormGroup>
        </FormRow>
         <FormRow>
          <FormGroup>
            <Label htmlFor="password">password</Label>
            <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="telephone">telephone</Label>
            <Input id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label htmlFor="role">Rôle</Label>
            <Select id="role" name="role" value={formData.role} onChange={handleChangerole}>
              <option value="">Sélectionnez un rôle</option>
              <option value="Admin">admin</option>
              <option value="medecin">medecin</option>
              <option value="secretaire">secretaire</option>
            </Select>
            </FormGroup>
            <FormGroupvisible $formgroupdisplay={isVisible ? "flex" : "none"}>
              <Label htmlFor="servicemedical">Service médical</Label>
              <Select id="servicemedical" name="serviceMedicalName" value={formData.serviceMedicalName} onChange={handleChange} >
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
        </FormRow>
        </FormContainer>
        <ButtonRow>
          <Button type="button" onClick={()=> setFormData({ nom: '', prenom: '', adresse: '', email: '', genre: '', password: " ",dateNaissance: '',telephone: "", role: '',serviceMedicalName:'' })}>
            Annuler
          </Button>
          <Button type="submit" primary>
            Créer un utilisateur
          </Button>
        </ButtonRow>
      </Form>
      </Afficheformulaireadd>
    </>
  );
};

export default FormulaireUtilisateur;
