import Styled from 'styled-components'
import cloche from '../assets/Bell.png'
const ImgprofilStyle= Styled.img`
    width: 40px;
    height: 40px;
    border-radius: 55.31px;

`
function Cloche(){
    return(<>
    <div>
        <ImgprofilStyle src={cloche}></ImgprofilStyle>
    </div>
       
    </>)
} 

export default Cloche
