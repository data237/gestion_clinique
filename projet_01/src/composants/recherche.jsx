import Styled from 'styled-components'
import iconrecherche from '../assets/iconrecherche.png'
import iconburger from '../assets/iconburger.png'

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
function Recherche(){
    return(<>
        <RechercheStyle>
            <IconburgerStyle src={iconburger}></IconburgerStyle>
            <InputStyle type="text" id="text1" placeholder='Hinted search text' required></InputStyle>
            <IconrechercheStyle src={iconrecherche}></IconrechercheStyle>
        </RechercheStyle>
        
    </>)
}
export default Recherche