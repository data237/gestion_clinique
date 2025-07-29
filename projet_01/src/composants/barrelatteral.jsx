import Styled from 'styled-components'
import logo from '../assets/logo.png'
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
const BarrelatteralStyle = Styled.div`
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
function Barrelatteral({children}){
    return(<>
            <BarrelatteralStyle>
                <Image src={logo}></Image>
                <MenuStyle>
                    {children}
                    
                </MenuStyle>
                
            </BarrelatteralStyle>
    </>)
}

export default Barrelatteral