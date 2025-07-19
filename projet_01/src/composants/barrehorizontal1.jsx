import Styled from 'styled-components'
import Cloche from './cloche'
import Photoprofil from './photoprofil'

const Barrehorizontal1Style = Styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 120px;
`
const DivStyle = Styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`
const TitreStyle = Styled.h1`
    font-family: Roboto;
    font-weight: 700;
    font-size: 40px;
    line-height: 143%;
    letter-spacing: 0.25px;
    color: rgba(102, 102, 102, 1);
`
const NomDocStyle = Styled.p`
    font-family: "Inter", sans-serif;
    font-weight: 300;
    font-size: 1em;
`
const Contenu = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const Chemin = Styled.div`
    font-family: "Inter", sans-serif;
    font-weight: 500;
    font-size: 1.2em;
    display: flex;
`
function Barrehorizontal1({titrepage, imgprofil1, nomprofil, children}){
    return(<>
        <Barrehorizontal1Style>
            <Contenu>
                <TitreStyle>
                    {titrepage}
                </TitreStyle>
                <DivStyle>
                    <Cloche/>
                    <Photoprofil imgprofil={imgprofil1}/>
                    <NomDocStyle> {nomprofil} </NomDocStyle>
                </DivStyle> 
            </Contenu>
           <Chemin>
                {children}
           </Chemin>
            
        </Barrehorizontal1Style>
            
    </>)
}

export default Barrehorizontal1