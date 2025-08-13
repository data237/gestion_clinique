//import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import { Link, useNavigate } from 'react-router-dom';
import Styled from 'styled-components'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import '../../styles/calendar.css'; // pour le style personnalisé
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'


const SousDiv1Style = Styled.div`
 width: 99%;
 
`
const Span1= Styled.span`
    cursor: pointer;
`
const CalendarContainer = Styled.div`
 width: 100%;
  height: 85vh;
padding-bottom: 25px;
margin-top: -30px;
`
const Calendar = () => {

    //const idUser = localStorage.getItem('id');
    //const [nomprofil, setnomprofil]= useState('')

    /*useEffect(() => {
        const token = localStorage.getItem('token');
           const nomutilisateur =  async ()=> {
                try {
                const response = await axios.get(`${API_BASE}/utilisateurs/${idUser}`,
                    {   headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    }},);
                console.log(token);
              if (response) {
                 setnomprofil(response.data.nom)
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                
            } finally {
              console.log('fin')
            }
            }
            nomutilisateur()
    }, [idUser]);*/

    const [rendezvousdayvisible, setrendezvousdayvisible] = useState(false)
   
     const nbr = 10
     const navigate = useNavigate();
    
      const handleClick = (today) => {
        navigate(`/medecin/calendrier/${today.dateStr}`);
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
                <Barrehorizontal1 titrepage="Calendrier" imgprofil1={imgprofil} nomprofil='bahebeck'> 
                    <Span1 onClick={()=> setrendezvousdayvisible(false)}>Liste des evenements</Span1>
                </Barrehorizontal1>
            </SousDiv1Style>
   
            <div className='zonedaffichage' $zonedaffichagedisplay={rendezvousdayvisible ? 'none' : 'block'}
        style={{
          height: '78vh',
          marginRight: '30px',
        }}
      >


        <div className='numero'

        >
          <div>
            <h2 className='nomtable'> Evenements </h2>
          </div>

        </div>
                           
                            
                       
        <div className='conteneurbarre'
        >
          <div className='barre'></div>
        </div>
        <CalendarContainer>
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
            height="100%"
            width="100%"
            dateClick={handleClick}
        />
        </CalendarContainer>
      </div>
      {/*right: 'dayGridMonth',timeGridWeek,timeGridDay' */}
     
     </>
  );
};

export default Calendar;