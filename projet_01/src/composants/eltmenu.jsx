import Styled from 'styled-components'
import { useState } from 'react'

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
    transition: all 0.3s ease;
    border-radius: 8px;
    margin: 2px 0;
    
    &:hover{
        cursor: pointer;
        background-color:  rgba(159, 159, 255, 1);
        color: #fff;
        transform: translateX(5px);
    }
    
    &:focus{
        outline: 2px solid rgba(159, 159, 255, 1);
        outline-offset: 2px;
    }
    
    &.active {
        background-color: rgba(159, 159, 255, 1);
        color: #fff;
        font-weight: 500;
    }
`

const ImgStyle = Styled.img`
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
    
    ${EltmenuStyle}:hover & {
        transform: scale(1.1);
    }
`

const MenuText = Styled.span`
    transition: all 0.3s ease;
`

const Badge = Styled.span`
    background-color: #ff4757;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: bold;
    margin-left: auto;
    min-width: 18px;
    text-align: center;
    display: ${props => props.show ? 'block' : 'none'};
`

function Eltmenu({nommenu, img, active = false, badge = null, onClick, ...props}){
    const [isPressed, setIsPressed] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick && onClick();
        }
    };

    const handleMouseDown = () => {
        setIsPressed(true);
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    return(
        <EltmenuStyle 
            className={active ? 'active' : ''}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsPressed(false)}
            role="button"
            tabIndex={0}
            aria-label={nommenu}
            {...props}
        >
            <ImgStyle src={img} alt="" />
            <MenuText>{nommenu}</MenuText>
            {badge && <Badge show={badge > 0}>{badge}</Badge>}
        </EltmenuStyle>
    )
} 

export default Eltmenu