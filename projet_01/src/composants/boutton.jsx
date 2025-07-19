import Styled from 'styled-components'
const BouttonStyle = Styled.button`

height: 56px;
border-radius: 28px;
padding-top: 12px;
padding-right: 16px;
padding-bottom: 12px;
padding-left: 16px;
background-color: rgba(65, 65, 255, 1);
font-family: Body/Font Family;
font-weight: 700;
font-size: 1.3em;
color: #fff;
border: none;
&:hover{
    cursor: pointer;
}
`

function Boutton({ nomboutton, onClick }){
    return(
        <>
        <BouttonStyle onClick={onClick}>{nomboutton}</BouttonStyle>
        </>
    )
}
export default Boutton