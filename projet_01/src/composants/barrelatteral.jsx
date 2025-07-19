import Styled from 'styled-components'
import logo from '../assets/logo.png'
import Eltmenu from './eltmenu'

const MenuStyle = Styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    
    gap: 15px;
    padding-top: 35px;
    
`
const BarrelatteralStyle = Styled.div`
    background-color: rgba(254, 255, 239, 1);
    width: 25%;
    height: 100vh;
    gap: 41px;
    padding-top: 32px;
    padding-bottom: 32px;
`
function Barrelatteral({children}){
    return(<>
    <BarrelatteralStyle>
        <img src={logo}></img>
        <MenuStyle>
            {children}
            
        </MenuStyle>
        
    </BarrelatteralStyle>
    </>)
}

export default Barrelatteral