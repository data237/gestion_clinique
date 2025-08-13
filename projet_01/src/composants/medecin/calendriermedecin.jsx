import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import axios from 'axios';
import { API_BASE } from '../../composants/config/apiconfig';
import '../../styles/calendar.css';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png';
import '../../styles/Zonedaffichage.css'

const SousDiv1Style = Styled.div`
    width: 95%;
`;

const Span1 = Styled.span`
    cursor: pointer;
`;

const CalendarContainer = Styled.div`
    width: 100%;
    height: 85vh;
    padding-bottom: 25px;
    margin-top: -30px;
`;

const Calendar = () => {
    const [rendezvousdayvisible, setrendezvousdayvisible] = useState(false);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRendezvous = async () => {
            const token = localStorage.getItem('token');
            const id = localStorage.getItem('id');

            if (!token || !id) {
                console.error('Token ou ID manquant');
                setIsLoading(false);
                return;
            }

            try {
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth() + 1;

                const apiUrl = `${API_BASE}/rendezvous/utilisateurs/${id}/confirmed/month/${year}/${month}`;
                console.log('Appel API:', apiUrl);

                const response = await axios.get(apiUrl, {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Réponse API:', response.data);

                if (response.data && Array.isArray(response.data)) {
                    const dailyCounts = {};

                    response.data.forEach(rdv => {
                        const date = rdv.jour;
                        if (date) {
                            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
                        }
                    });

                    const calendarEvents = Object.keys(dailyCounts).map(date => ({
                        title: `${dailyCounts[date]} RDV`,
                        start: date,
                        backgroundColor: '#4CAF50',
                        borderColor: '#4CAF50',
                        textColor: '#fff',
                    }));

                    setEvents(calendarEvents);
                }
            } catch (err) {
                console.error('Erreur API:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRendezvous();
    }, []);

    const handleClick = (today) => {
        console.log('Date cliquée:', today.dateStr);
        navigate(`/medecin/calendrier/${today.dateStr}`);
    };

    if (isLoading) {
        return <p>Chargement du calendrier...</p>;
    }

    return (
        <>
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Calendrier" imgprofil1={imgprofil} nomprofil='bahebeck'>
                    <Span1 onClick={() => setrendezvousdayvisible(false)}>Liste des evenements</Span1>
                </Barrehorizontal1>
            </SousDiv1Style>

            <div className='zonedaffichage' $zonedaffichagedisplay={rendezvousdayvisible ? 'none' : 'block'}
                style={{
                    height: '78vh',
                    marginRight: '30px',
                }}
            >
                <div className='numero'>
                    <div>
                        <h2 className='nomtable'>Evenements</h2>
                    </div>
                </div>

                <div className='conteneurbarre'>
                    <div className='barre'></div>
                </div>

                <CalendarContainer>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locales={[frLocale]}
                        locale="fr"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        buttonText={{
                            today: 'Aujourd\'hui',
                            month: 'Mois',
                            week: 'Semaine',
                            day: 'Jour'
                        }}
                        events={events}
                        height="100%"
                        dateClick={handleClick}
                        eventDisplay="block"
                        dayMaxEvents={false}
                    />
                </CalendarContainer>
            </div>
        </>
    );
};

export default Calendar; 