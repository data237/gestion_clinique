import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig';
import axios from 'axios';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'

const SousDiv1Style = Styled.div`
 width: 99%;
 padding-left: 1%;
`
const Span2= Styled.span`
  
`
const Span1= Styled.span`
    cursor: pointer;
`
const Affichedetailuser = Styled.div`
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
  color: rgba(159, 159, 255, 1);
  padding-bottom: 10px;
  font-family: Roboto;
  cursor: pointer;
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

const DetailsUtilisateur = () => {

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
  const [isVisiblerole, setisVisiblerole] = useState(false)
  /*if(user.rôle === "Médecin"){
    
  }*/
  const { id } = useParams();
  const [utilisateur, setUtilisateur] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [isloading, setisloading] = useState(true);

  
 useEffect(()=>{
         
         const fetchUtilisateurs = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${API_BASE}/utilisateurs/${id}`,
                    {   headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    }});
                console.log(token);
              
               const user = response.data
               setUtilisateur(response.data);
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


       
  
  
  let navigate = useNavigate();
  const handleClick = () => {
    // Redirige vers /utilisateur
    navigate("/admin/utilisateur");
  };
  let navigate1 = useNavigate();
   const handleEditClick = (utilisateur) => {
    navigate1(`/admin/utilisateur/edit/${utilisateur.id}`);
  };
  if (!utilisateur) {
  return <p style={{ textAlign: 'center' }}>Chargement...</p>;
  }
  if (isloading) return <p>Chargement...</p>;

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
  return (
    <>
      <SousDiv1Style>
          <Barrehorizontal1 titrepage="Gestion des utilisateurs" imgprofil1={imgprofil} nomprofil={nomprofil}> 
              <Span1 onClick={handleClick}>Liste des utilisateurs</Span1>
              <Span2 > {">"} Détail de l'utilisateur</Span2>
          </Barrehorizontal1>
      </SousDiv1Style>
      <Affichedetailuser>
          <Form>
            <FormContainer>
            <Title>
                <Title1>Détail utilisateur</Title1>
                <Title2 onClick={() => handleEditClick(utilisateur)}>Edit</Title2>
            </Title>
            
            <TraitHorizontal></TraitHorizontal>
            <FormRow>
              <FormGroup>
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" name="nom" value={utilisateur.nom} readOnly/>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" name="prenom" value={utilisateur.prenom} readOnly/>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="adresse">Adresse</Label>
                <Input id="adresse" name="adresse" value={utilisateur.adresse} readOnly/>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={utilisateur.email} readOnly/>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="genre">Genre</Label>
                <Input id="genre" name="genre" value={utilisateur.genre}  readOnly>
              </Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="dateNaissance">Date de naissance</Label>
                <Input id="dateNaissance" name="dateNaissance" type="date" value={utilisateur.dateNaissance} readOnly/>
              </FormGroup>
            </FormRow>
             <FormRow>
              <FormGroup>
                <Label htmlFor="password">password</Label>
                <Input id="password" name="password"  value={utilisateur.password} readOnly />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="telephone">telephone</Label>
                <Input id="telephone" name="telephone" value={utilisateur.telephone} readOnly />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <Label htmlFor="role">Rôle</Label>
                <Input id="role" name="role" value={utilisateur.role.roleType} readOnly/>
                </FormGroup>
                <FormGroupvisible $formgroupdisplay={isVisiblerole ? "flex" : "none"}>
                  <Label htmlFor="servicemedical">Service médical</Label>
                  <Input id="servicemedical" name="servicemedical" value={utilisateur.serviceMedicalName} readOnly />
              </FormGroupvisible>
            </FormRow>
            </FormContainer>
          </Form>
      </Affichedetailuser>
    </>
  );
};

export default DetailsUtilisateur;
