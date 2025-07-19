import Styled from 'styled-components'

const EltmenuStyle= Styled.div`
    width: 100%;
    height: 30px;
    gap: 8px;
    padding: 20px 15px 20px 25px;
    display: flex;
    align-items: center;
    font-family: "Inter", sans-serif;
    font-weight: 300;
    font-size: 1.8em;
    
    &:hover{
        cursor: pointer;
        background-color:  rgba(159, 159, 255, 1);
        color: #fff;
    }
    
`

const ImgStyle = Styled.img`
    width: 18px;
    height: 18px;
`
function Eltmenu({nommenu, img}){
    return(<>
        <EltmenuStyle>
            <ImgStyle src={img}></ImgStyle>
           <p>{nommenu} </p> 
        </EltmenuStyle>
    </>)
} 

export default Eltmenu