import Styled from 'styled-components'
import { API_BASE } from '../composants/config/apiconfig'
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'
import logout from '../assets/open-door.svg'
import axios from 'axios'
import Eltmenu from './eltmenu'

const MenuStyle = Styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-top: 0px;
`
const Image = Styled.img`
    width: 70%
`

const Imgsvg = Styled.img`
     width: 28px;
    height: 28px;
`

const BarrelatteralStyle = Styled.div`
    position: relatif;
    background-color: rgba(254, 255, 239, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20vw;
    height: 100vh;
    gap: 41px;
    padding-top: 32px;
    padding-bottom: 32px;
`

const Button = Styled.button`
    display: flex;
    justify-content: space-between;
    background-color:  rgba(68, 68, 68, 0.3);
    position : absolute;
    bottom: 0px;
    width: 20vw;
    gap: 8px;
    padding: 15px 15px 15px 25px;
    text-align: left;
    align-items: left;
    font-family: "Inter", sans-serif;
    font-weight: 300;
    font-size: 1.2em;
    
    &:hover{
        cursor: pointer;
        background-color:  rgba(159, 159, 255, 1);
        color: #fff;
    }
`
function Barrelatteral({children}){

    const navigate = useNavigate()
    const idUser = localStorage.getItem('id');
    const handleLogout = () => {
    // Supprimer le token (ou autre info) du localStorage
    
        const logout = async () => {
            const token2 = localStorage.getItem('token');
            try {
                const response = await axios.patch(`${API_BASE}/utilisateurs/${idUser}/DECONNECTE`,{},{   
                    headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token2}`,
                    'Content-Type': 'application/json',
                    }});
                console.log(response)
                localStorage.removeItem("token");
                navigate("/");
            } catch (error) {
                console.error("Erreur pendant le logout :", error);
            }
        };
        logout()
  };
    return(<>
            <BarrelatteralStyle>
                <Image src={logo}></Image>
                <MenuStyle>
                    {children}
                    
                </MenuStyle>
                <Button onClick={()=> handleLogout()}> 
                    <p>Deconnexion</p> 
                    <Imgsvg src={logout}></Imgsvg>
                </Button>
            </BarrelatteralStyle>
    </>)
}

export default Barrelatteral