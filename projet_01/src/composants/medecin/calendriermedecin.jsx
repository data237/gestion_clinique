import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Styled from 'styled-components'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import './calendar.css'; // pour le style personnalisé
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'


const SousDiv1Style = Styled.div`
 width: 99%;
 padding-left: 1%;
`
const Span1= Styled.span`
    cursor: pointer;
`
const ZonedaffichageStyle = Styled.div`
    width: 99%;
    height: 78vh;
    display: ${props => props.$zonedaffichagedisplay};
    flex-direction: column;
    gap: 15px;
    background-color: rgba(239, 239, 255, 1);
    border-radius: 10px;
`
const Rendezvousday = Styled.div`
  width: 99%;
  height: 78vh;
  display: ${props => props.$Rendezvousdaydisplay};
  flex-direction: column;
  gap: 15px;
  background-color: rgba(239, 239, 255, 1);
  border-radius: 10px;
`
const NomtableStyle = Styled.p`
    font-family: "Inter", sans-serif;
    font-weight: 700;
    font-size: 1.5em;
    padding: 10px 20px;
`
const BarreStyle = Styled.div`
    width: 100%;
    height: 5px;
    border-radius: 2.5px;
    background-color: rgba(159, 159, 255, 1);
    padding-left:  20px;

`
const Calendar = () => {
    const [rendezvousdayvisible, setrendezvousdayvisible] = useState(false)
    const nomprofil = localStorage.getItem('username');
     const nbr = 10
     const navigate = useNavigate();
    
      const handleClick = () => {
        navigate(`/medecin/calendrier/today`);
      };
  const events = [
    { title: `${nbr} rendez-vous`, start: '2025-07-24' },
    { title: 'Conference', start: '2025-03-02', end: '2025-03-03' },
    { title: '10:30a Meeting', start: '2025-03-03T10:30:00' },
    { title: '12p Lunch', start: '2025-03-03T12:00:00' },
    { title: '7a Birthday Party', start: '2025-03-04T07:00:00' },
    { title: 'Long Event', start: '2025-03-07', end: '2025-03-10' },
    { title: '4p Repeating Event', start: '2025-03-09T16:00:00', groupId: 'repeats' },
    { title: '4p Repeating Event', start: '2025-03-16T16:00:00', groupId: 'repeats' },
    { title: 'Click for Google', url: 'https://google.com/', start: '2025-03-28' },
  ];


 
  return (
    <>
    
   <SousDiv1Style>
                <Barrehorizontal1 titrepage="Calendrier" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1 onClick={()=> setrendezvousdayvisible(false)}>Liste des evenements</Span1>
                </Barrehorizontal1>
            </SousDiv1Style>
   
      <ZonedaffichageStyle $zonedaffichagedisplay = {rendezvousdayvisible? 'none' : 'block'}>
        
            <div>
                <NomtableStyle> Evenements </NomtableStyle>
            </div>
                           
                            
                       
            <div style={{ margin: '20px 20px' }}>
                <BarreStyle></BarreStyle>
            </div>
            <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locales={[frLocale]}
            locale="fr"
            headerToolbar={{
            left: 'prev,next ,today',
            right: 'title',
            
            }}
            events={events}
            height="auto"
            dateClick={handleClick}
        />
      </ZonedaffichageStyle>
      {/*right: 'dayGridMonth',timeGridWeek,timeGridDay' */}
     
     </>
  );
};

export default Calendar;