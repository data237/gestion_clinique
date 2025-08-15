import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import axiosInstance from '../config/axiosConfig';
import { API_BASE } from '../../composants/config/apiconfig';
import '../../styles/calendar.css';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png';
import '../../styles/Zonedaffichage.css';

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

    // Fonction pour déterminer le style selon la date
    const getEventStyle = (dateStr) => {
        const today = new Date();
        const eventDate = new Date(dateStr);
        const todayStr = today.toISOString().split('T')[0];
        
        // Réinitialiser l'heure pour la comparaison
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        
        if (dateStr === todayStr) {
            // Aujourd'hui (LocalDate.now()) - BLEU
            return {
                backgroundColor: '#2196F3', // Bleu professionnel
                borderColor: '#1976D2',
                textColor: '#FFFFFF', // Blanc pur pour la lisibilité
                borderWidth: '1px',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
                fontWeight: 'bold'
            };
        } else if (eventDate > today) {
            // Jours suivants (futur) - VERT
            return {
                backgroundColor: '#4CAF50', // Vert professionnel
                borderColor: '#388E3C',
                textColor: '#FFFFFF', // Blanc pur pour la lisibilité
                borderWidth: '1px',
                boxShadow: '0 3px 8px rgba(76, 175, 80, 0.3)',
                fontWeight: '600'
            };
        } else {
            // Jours d'avant (passé) - ROUGE
            return {
                backgroundColor: '#F44336', // Rouge pour le passé
                borderColor: '#D32F2F',
                textColor: '#FFFFFF', // Blanc pur pour la lisibilité
                borderWidth: '1px',
                opacity: 0.9,
                fontWeight: '500'
            };
        }
    };

    // Fonction pour obtenir l'icône selon le type de rendez-vous
    const getEventIcon = (dateStr) => {
        const today = new Date();
        const eventDate = new Date(dateStr);
        const todayStr = today.toISOString().split('T')[0];
        
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        
        if (dateStr === todayStr) {
            return '⭐'; // Aujourd'hui - Étoile pour l'importance
        } else if (eventDate > today) {
            return '📅'; // Futur - Calendrier
        } else {
            return '⏰'; // Passé - Horloge pour le temps écoulé
        }
    };

    useEffect(() => {
        const fetchRendezvous = async () => {
            const id = localStorage.getItem('id');

            if (!id) {
                console.error('ID manquant');
                setIsLoading(false);
                return;
            }

            try {
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth() + 1;

                const response = await axiosInstance.get(`/rendezvous/utilisateurs/${id}/confirmed/month/${year}/${month}`);

                console.log('Réponse API:', response.data);

                if (response.data && Array.isArray(response.data)) {
                    // Trier les rendez-vous par ordre décroissant (plus récent en premier)
                    const rendezvousTries = response.data.sort((a, b) => {
                        // Trier d'abord par date (du plus récent au plus ancien)
                        if (a.jour && b.jour) {
                            const dateA = new Date(a.jour);
                            const dateB = new Date(b.jour);
                            if (dateA.getTime() !== dateB.getTime()) {
                                return dateB.getTime() - dateA.getTime();
                            }
                        }
                        // Si même date, trier par heure (du plus tôt au plus tard)
                        if (a.heure && b.heure) {
                            return a.heure.localeCompare(b.heure);
                        }
                        // Si pas d'heure, trier par ID (plus récent en premier)
                        return b.id - a.id;
                    });
                    
                    const dailyCounts = {};

                    rendezvousTries.forEach(rdv => {
                        const date = rdv.jour;
                        if (date) {
                            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
                        }
                    });

                    const calendarEvents = Object.keys(dailyCounts).map(date => {
                        const style = getEventStyle(date);
                        const icon = getEventIcon(date);
                        
                        return {
                            title: `${icon} ${dailyCounts[date]} RDV`,
                            start: date,
                            backgroundColor: style.backgroundColor,
                            borderColor: style.borderColor,
                            textColor: style.textColor,
                            borderWidth: style.borderWidth,
                            extendedProps: {
                                count: dailyCounts[date],
                                style: style,
                                icon: icon
                            }
                        };
                    });

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

    // CSS pour le curseur pointer sur les cellules des jours
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .clickable-day {
                cursor: pointer !important;
            }
            .clickable-day:hover {
                background-color: rgba(33, 150, 243, 0.1) !important;
                transition: background-color 0.2s ease;
            }
            .fc-daygrid-day {
                cursor: pointer !important;
            }
            .fc-daygrid-day:hover {
                background-color: rgba(33, 150, 243, 0.05) !important;
                transition: background-color 0.2s ease;
            }
            
            /* Hover pour les jours avec rendez-vous - couleur correspondante */
            .fc-daygrid-day.has-events:hover {
                background-color: rgba(33, 150, 243, 0.1) !important;
                transition: background-color 0.2s ease;
            }
            
            /* Hover pour les jours sans rendez-vous */
            .fc-daygrid-day:not(.has-events):hover {
                background-color: rgba(158, 158, 158, 0.1) !important;
                transition: background-color 0.2s ease;
            }
            
            /* Hover spécifique pour les événements selon leur couleur */
            .fc-event:hover {
                transform: scale(1.05) !important;
                transition: all 0.2s ease !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
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
                    <h2 className='nomtable' style={{ marginTop: '-20px', marginBottom: '-20px' }}> Evenements </h2>
                    </div>
                </div>

                <div className='conteneurbarre'>
                    <div className='barre'></div>
                </div>

                <CalendarContainer>
                     {/* Légende des couleurs en dessous du calendrier */}
                     <div style={{
                         marginTop: '0',
                         marginBottom: '-10px',
                         padding: '1px',
                         backgroundColor: 'rgba(255, 255, 255, 0.95)',
                         borderRadius: '8px',
                         border: '2px solid #e0e0e0',
                         boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                         display: 'flex',
                         justifyContent: 'center',
                         alignItems: 'center',
                         gap: '30px',
                         flexWrap: 'wrap'
                    }}>
                        <h4 style={{ margin: '0', color: '#333', fontSize: '14px', marginRight: '20px' }}>🎨 Légende :</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                                width: '16px', 
                                height: '16px', 
                                backgroundColor: '#F44336', 
                                borderRadius: '3px'
                            }}></div>
                            <span style={{ fontSize: '12px' }}>⏰ Passé</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                                width: '16px', 
                                height: '16px', 
                                backgroundColor: '#2196F3', 
                                borderRadius: '3px'
                            }}></div>
                            <span style={{ fontSize: '12px' }}>⭐ Aujourd'hui</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                                width: '16px', 
                                height: '16px', 
                                backgroundColor: '#4CAF50', 
                                borderRadius: '3px'
                            }}></div>
                            <span style={{ fontSize: '12px' }}>📅 Futur</span>
                        </div>
                    </div>

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
                        dayCellClassNames="clickable-day"
                        eventContent={(eventInfo) => {
                            const style = eventInfo.event.extendedProps.style;
                            return (
                                <div style={{ 
                                    textAlign: 'center', 
                                    padding: '4px 6px',
                                    fontSize: '11px',
                                    fontWeight: style.fontWeight || 'bold',
                                    backgroundColor: style.backgroundColor,
                                    color: style.textColor,
                                    borderRadius: '6px',
                                    margin: '2px',
                                    border: `${style.borderWidth} solid ${style.borderColor}`,
                                    boxShadow: style.boxShadow || 'none',
                                    opacity: style.opacity || 1,
                                    minHeight: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}>
                                    {eventInfo.event.title}
                                </div>
                            );
                        }}
                    />
                    
                   
                </CalendarContainer>
            </div>
        </>
    );
};

export default Calendar; 