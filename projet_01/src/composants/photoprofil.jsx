import Styled from 'styled-components'
const ImgprofilStyle= Styled.img`
    width: 40px;
    height: 40px;
    border-radius: 55.31px;

`
function Photoprofil({imgprofil} ){
    return(<>
     <div>
        <ImgprofilStyle src={imgprofil}></ImgprofilStyle>
     </div>
        
    </>)
} 

export default Photoprofil