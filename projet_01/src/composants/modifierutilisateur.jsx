import React, { useState,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Styled from 'styled-components';
import fondImage from '../assets/backgroundimageuserform.jpg';
import Barrehorizontal1 from '../composants/barrehorizontal1';
import imgprofil from '../assets/photoDoc.png'


const SousDiv1Style = Styled.div`
 width: 99%;
 padding-left: 1%;
`
const Span3= Styled.span`
  
`
 
const Span2= Styled.span`
  cursor: pointer;
`
const Span1= Styled.span`
    cursor: pointer;
`
const Title = Styled.div`
  display: flex;
  justify-content: space-between;
`;
const Title1 = Styled.h2`
  margin-bottom: 0px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  padding-bottom: 10px;
  font-family: Roboto;
`;
const Title2 = Styled.h2`
  margin-bottom: 0px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  padding-bottom: 10px;
  font-family: Roboto;
`;
const Modifieruser = Styled.div`
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

const ModifierUtilisateur = () => {
  const nomprofil = localStorage.getItem('username');
  const [isVisiblerole, setisVisiblerole] = useState(false)
  const [formData, setFormData] = useState({});
  const [erreur, setErreur] = useState(null);
  const [isloading, setisloading] = useState(true);
  
    
  const { id } = useParams();
  //  const [utilisateur, setUtilisateur] = useState(null);
    
  /*
   useEffect(() => {
    fetch('/utilisateurs.json')
      .then(res => res.json())
      .then(data => {console.log("ID reçu depuis l'URL:", id);
      console.log("Données chargées:", data);
      const user = data.find(u => String(u.id) === String(id));
      console.log("Utilisateur trouvé:", user);
        setFormData(user);
        if (user?.rôle === "Médecin") {
          setisVisiblerole(true);
        }
      });
  }, [id]);

  */

  
  
   
   useEffect(()=>{
         
         const fetchUtilisateurs = async () => {
           const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:8081/Api/V1/clinique/utilisateurs/${id}`,
                    {   headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    }});
                //console.log(response.data);
               const user = response.data
               setFormData(response.data);
              if (user.role.roleType === "MEDECIN") {
                 setisVisiblerole(true);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                setisloading(false);
            }
    
        };
            fetchUtilisateurs();
        },[id]);


  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleChangerole = e => {
    const { name, value } = e.target;
    value === "medecin" ? setisVisiblerole(true) : setisVisiblerole(false)
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  
  
 
  
 
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
    const token2 = localStorage.getItem('token');
    
    e.preventDefault();
    try {
      if(formData.role.roleType != "MEDECIN"){
        const response = await axios.post(`http://localhost:8081/Api/V1/clinique/utilisateurs/${id}`, formData2,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token2}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data);
      }else{
        const response = await axios.post(`http://localhost:8081/Api/V1/clinique/utilisateurs/${id}`, formData,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token2}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data);
      }
    } catch (error) {
      console.error('Erreur de connexion :', error);
      console.log(token2)
      console.log(formData.serviceMedicalName)
    } finally{
     setFormData({
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
    };
  };

  
  
  

  let navigate = useNavigate();
  const handleClick = () => {
    // Redirige vers /utilisateur
    navigate("/admin/utilisateur");
  };
  let navigate1 = useNavigate();
  const handleClick1 = () => {
    // Redirige vers /utilisateur
    navigate1(`/admin/utilisateur/viewuser/${id}`);
  };
 if (!formData) {
  return <p style={{ textAlign: 'center' }}>{formData}</p>;
  }
  if (isloading) return <p>Chargement...</p>;

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
  return (
    <>
      <SousDiv1Style>
          <Barrehorizontal1 titrepage="Gestion des utilisateurs" imgprofil1={imgprofil} nomprofil={nomprofil}> 
              <Span1 onClick={handleClick}>Liste des utilisateurs</Span1>
              <Span2 onClick={handleClick1}> {">"} Détail de l'utilisateur</Span2>
              <Span3 > {">"} Modifier les informations</Span3>
          </Barrehorizontal1>
      </SousDiv1Style>
      <Modifieruser>
          <Form onSubmit={handleSubmit}>
            <FormContainer>
              <Title>
                <Title1>Modifier les informations de l’ utilisateur</Title1>
                <Title2>Edit</Title2>
            </Title>
            <Title></Title>
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
                  <option value="">Sélectionnez un rôle</option>
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
                <Select id="role" name="role" value={formData.role.roleType} onChange={handleChangerole}>
                  <option value="">Sélectionnez un rôle</option>
                  <option value="Admin">Admin</option>
                  <option value="medecin">medecin</option>
                  <option value="secretaire">secretaire</option>
                </Select>
                </FormGroup>
                <FormGroupvisible $formgroupdisplay={isVisiblerole ? "flex" : "none"}>
                  <Label htmlFor="servicemedical">Service médical</Label>
                  <Select id="servicemedical" name="servicemedical" value={formData.servicemedical} onChange={handleChange} >
                    <option value="">Sélectionnez un rôle</option>
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
              <Button type="button" onClick={()=> setFormData({ nom: '', prenom: '', adresse: '', email: '', genre: 'Femme', dateNaissance: '', role: '',servicemedical:'' })}>
                Annuler
              </Button>
              <Button type="submit" primary>
                Modifier
              </Button>
            </ButtonRow>
          </Form>
      </Modifieruser>
    </>
  );
};

export default ModifierUtilisateur;
