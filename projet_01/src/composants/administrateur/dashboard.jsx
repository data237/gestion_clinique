import '../../styles/Zonedaffichage.css'
import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import axios from 'axios';
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import Styled from 'styled-components'
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import iconutilisateurblanc from '../../assets/iconutilisateurdashboardblanc.svg'
import '../../styles/dashboard-modern.css'

// Composants styled manquants
const SousDiv1Style = Styled.div`
    width: 99%;
`

const Span1 = Styled.span`
    cursor: pointer;
`

const DashboardContainer = Styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f8f9fa;
`

const HeaderSection = Styled.div`
    width: 99%;
    margin-bottom: 20px;
`

const MainContent = Styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0 32px 32px 32px;
`

const DashboardTitle = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
`

const Title = Styled.h2`
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 1.5em;
    color: #333;
    margin: 0;
`

const Divider = Styled.div`
    width: 100%;
    height: 5px;
    border-radius: 2.5px;
    background-color: rgba(159, 159, 255, 1);
    margin-bottom: 24px;
`

const DashboardGrid = Styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 24px;
    height: calc(100vh - 300px);
`

const GridCard = Styled.div`
    background-color: rgba(159, 159, 255, 1);
    border-radius: 32px;
    padding: 20px;
    display: flex;
    flex-direction: column;
`

const GridTitle = Styled.h3`
    font-family: 'Roboto', sans-serif;
    color: white;
    font-weight: 400;
    font-size: 18px;
    margin: 0 0 16px 0;
    text-align: center;
`

const AccountGrid = Styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 12px;
    height: 100%;
`

const AccountCard = Styled.div`
    background-color: white;
    border-radius: 24px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const AccountCardHeader = Styled.div`
    display: flex;
    gap: 12px;
    align-items: flex-start;
`

const ProfileImage = Styled.img`
    height: 60px;
    width: 60px;
    border-radius: 16px;
    object-fit: cover;
`

const AccountCardContent = Styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const CardSubtitle = Styled.p`
    color: rgba(159, 159, 255, 1);
    font-weight: 600;
    font-size: 14px;
    margin: 0;
    padding-bottom: 6px;
    border-bottom: 2px solid rgba(159, 159, 255, 1);
`

const CardDate = Styled.p`
    color: rgba(159, 159, 255, 1);
    font-size: 16px;
    margin: 0;
    line-height: 1.4;
`

const CardTime = Styled.span`
    font-weight: 300;
    font-size: 24px;
    color: rgba(159, 159, 255, 1);
    display: block;
    margin-top: 4px;
`

const CardList = Styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    color: #666;
    font-size: 14px;
`

const CardListItem = Styled.li`
    padding: 6px 0;
    border-bottom: 1px solid #eee;
    line-height: 1.4;
    
    &:last-child {
        border-bottom: none;
    }
`

const StatsGrid = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
`

const StatCard = Styled.div`
    background-color: white;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s ease;
    
    &:hover {
        transform: translateX(4px);
    }
`

const StatText = Styled.p`
    color: #666;
    font-weight: 600;
    font-size: 14px;
    margin: 0;
    flex: 1;
`

const StatNumber = Styled.div`
    color: rgba(65, 65, 255, 1);
    font-weight: 700;
    font-size: 24px;
`

const UsersList = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
    overflow-y: auto;
`

const UserCard = Styled.div`
    background-color: white;
    border-radius: 16px;
    padding: 12px;
    display: flex;
    gap: 12px;
    align-items: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border: 1px solid #f0f0f0;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    &.disconnected {
        background-color: rgba(254, 255, 239, 1);
        border-color: #ffe8e8;
    }
`

const UserImage = Styled.div`
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
`

const UserName = Styled.div`
    position: absolute;
    bottom: 0;
    background-color: #333;
    color: white;
    width: 100%;
    text-align: center;
    font-size: 11px;
    padding: 4px 0;
    font-weight: 500;
`

const UserInfo = Styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const ChartContainer = Styled.div`
    grid-column: 1 / 3;
    height: 200px;
`

const ChartCard = Styled.div`
    background-color: white;
    border-radius: 15px;
    padding: 20px;
    height: 100%;
    width: 100%;
`

const Sidebar = Styled.div`
    grid-column: 3 / 4;
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const SidebarCard = Styled.div`
    background-color: rgb(255, 159, 172);
    border-radius: 10px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
`

const SidebarIcon = Styled.img`
    height: 16px;
    width: 16px;
`

const LoadingContainer = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f8f9fa;
    border-radius: 10px;
`

function Dashboard(){
    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil] = useState('')
    const [statjour, setstatjour] = useState({})
    const [usersconnecte, setusersconnecte] = useState([]) 
    const [usersdisconnecte, setusersdisconnecte] = useState([]) 
    const [connexionadmin, setconnexionadmin] = useState([])
    const [historiques, sethistoriques] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token');
        const nomutilisateur = async () => {
            try {
                const response = await axios.get(`${API_BASE}/utilisateurs/${idUser}`,
                    {   
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                if (response && response.data) {
                    setnomprofil(response.data.nom || '')
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
        }
        nomutilisateur()
    }, [idUser]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const statjournalier = async () => {
            try {
                const response = await axios.get(`${API_BASE}/stats/daily`,
                    {   
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                if (response && response.data) {
                    setstatjour(response.data || {})
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques:', error);
                setstatjour({})
            }
        }
        statjournalier()
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const utilisateursconnectes = async () => {
            try {
                const response = await axios.get(`${API_BASE}/utilisateurs/connected/last-activity`,
                    {   
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                if (response && response.data) {
                    setusersconnecte(response.data || [])
                    // Filtrer pour l'admin connecté
                    const adminUser = response.data.find(user => user.id === parseInt(idUser))
                    if (adminUser) {
                        setconnexionadmin([adminUser])
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs connectés:', error);
                setusersconnecte([])
                setconnexionadmin([])
            }
        }
        utilisateursconnectes()
    }, [idUser]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const utilisateursdeconnectes = async () => {
            try {
                const response = await axios.get(`${API_BASE}/utilisateurs/disconnected/last-activity`,
                    {   
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                if (response && response.data) {
                    setusersdisconnecte(response.data || [])
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs déconnectés:', error);
                setusersdisconnecte([])
            }
        }
        utilisateursdeconnectes()
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const Historique = async () => {
            try {
                const response = await axios.get(`${API_BASE}/historiqueActions/utilisateur/${idUser}`,
                    {   
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                if (response && response.data) {
                    const hist = response.data.slice(-3)
                    sethistoriques(hist || [])
                } else {
                    sethistoriques([])
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'historique:', error);
                sethistoriques([])
            } finally {
                setLoading(false)
            }
        }
        Historique()
    }, [idUser]);

    if (loading) {
        return (
            <LoadingContainer>
                <div>Chargement du dashboard...</div>
            </LoadingContainer>
        );
    }

    return (
        <>
            {/* Header Section */}
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Dashboard" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1>Home</Span1>
                </Barrehorizontal1>
            </SousDiv1Style>

            {/* Main Dashboard Container */}
            <div className='zonedaffichage-dashboad'>
                {/* Dashboard Header */}
                <div className='numero'>
                    <h2 className='nomtable'>Statistiques globales</h2>
                </div>
                        
                {/* Divider Bar */}
                <div className='conteneurbarre'>
                    <div className='barre'></div>
                </div>

                {/* Main Content Grid */}
                <div className='content-grid'>
                    {/* Dashboard Grid Layout */}
                    <div className='dashboard-grid'>
                        {/* Grid 1: Account Information */}
                        <div className='grid-1'>
                            <p className='grid-title'>Ce compte</p>
                            <div className='grid-01'>
                                {/* Connection Info */}
                                <div className='grid-11'>
                                    <div className="grid-1-content-image">
                                       <img className='grid-image' src={imgprofil} alt="profile" /> 
                                    </div>
                                    
                                    <div className='grid-11-content'>
                                        <p className='sous-grid-title'>Connecté depuis le</p>
                                        {connexionadmin && connexionadmin.length > 0 ? connexionadmin.map((connexion) => (
                                            <p className='grid-11-date' key={connexion.id}>
                                                {connexion.lastLoginDate ? connexion.lastLoginDate.split("T")[0] : 'N/A'}<br />
                                                <span className='grid-11-date-heure'> 
                                                    {connexion.lastLoginDate ? connexion.lastLoginDate.split("T")[1].split(".")[0] : 'N/A'}  
                                                </span>
                                            </p>
                                        )) : <p className='grid-11-date'>Aucune donnée disponible</p>}
                                    </div>
                                </div>

                                {/* Recent Actions */}
                                <div className='grid-12'>
                                    <p className='sous-grid-title'>Actions récentes</p>
                                    <ul className='sous-grid-liste'>
                                        {historiques && historiques.length > 0 ? historiques.map((historique) => (
                                            <li key={historique.id}>{historique.action || 'Action non spécifiée'}</li>
                                        )) : <li>Aucune activité récente</li>}
                                    </ul>
                                </div>

                                {/* Last Connection */}
                                <div className='grid-13'>
                                    <div className="grid-1-content-image">
                                       <img className='grid-image' src={imgprofil} alt="profile" /> 
                                    </div>
                                    
                                    <div className='grid-11-content'>
                                        <p className='sous-grid-title'>Dernière connexion</p>
                                        {connexionadmin && connexionadmin.length > 0 ? connexionadmin.map((connexion) => (
                                            <p className='grid-11-date' key={connexion.id}>
                                                {connexion.lastLogoutDate ? connexion.lastLogoutDate.split("T")[0] : 'N/A'}<br />
                                                <span className='grid-11-date-heure'> 
                                                    {connexion.lastLogoutDate ? connexion.lastLogoutDate.split("T")[1].split(".")[0] : 'N/A'}  
                                                </span>
                                            </p>
                                        )) : <p className='grid-11-date'>Aucune donnée disponible</p>}
                                    </div>
                                </div>

                                {/* Pending Items */}
                                <div className='grid-14'>
                                    <p className='sous-grid-title'>En attente</p>
                                    <ul className='sous-grid-liste'>
                                        <li>Confirmation de création de compte.</li>
                                        <li>2 messages de la secrétaire Mengne non lus</li>
                                        <li>1 message du docteur Kipenbé non lu.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Grid 2: Today's Statistics */}
                        <div className='grid-2'>
                            <p className='grid-2-title'>Aujourd'hui</p>
                            <div className='grid-2-content'> 
                                <div className="grid-2-content-chid">
                                    <p className="grid-2-content-chid-text">Patients enregistrés</p>
                                    <div className="grid-2-content-chid-chiffre">{statjour.nbrPatientEnrg || 0}</div>
                                </div>
                                <div className="grid-2-content-chid">
                                    <p className="grid-2-content-chid-text">RDV validés</p>
                                    <div className="grid-2-content-chid-chiffre">{statjour.nbrRendezVousCONFIRME || 0}</div>
                                </div>
                                <div className="grid-2-content-chid">
                                    <p className="grid-2-content-chid-text">RDV manqués</p>
                                    <div className="grid-2-content-chid-chiffre">{statjour.nbrRendezANNULE || 0}</div>
                                </div>
                                <div className="grid-2-content-chid">
                                    <p className="grid-2-content-chid-text">Consultations effectuées</p>
                                    <div className="grid-2-content-chid-chiffre">{statjour.nbrConsultation || 0}</div>
                                </div>
                            </div>
                        </div>

                        {/* Grid 3: Connected Users */}
                        <div className='grid-3'>
                            <p className='grid-3-title'>Connectés récemment</p>
                            <div className='grid-3-content'>
                                {usersconnecte && usersconnecte.length > 0 ? usersconnecte.map((user) => ( 
                                    <div key={user.id} className='grid-31'>
                                        <div className="content-image">
                                            <img className='grid-image' src={imgprofil} alt="profile" />
                                            <div className='grid-31-nom'><p>{user.nom}</p></div>
                                        </div>
                                        <div className='grid-31-content'>
                                            <p className='sous-grid-3-title'>Connecté depuis le</p>
                                            <p className='grid-31-date'>
                                                {user.lastLoginDate ? user.lastLoginDate.split("T")[0] : 'N/A'} à 
                                                <br />
                                                <span className='grid-31-date-heure'>
                                                    {user.lastLoginDate ? user.lastLoginDate.split("T")[1].split(".")[0] : 'N/A'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )) : <div className='grid-31'><p>Aucun utilisateur connecté</p></div>}
                                
                                {usersdisconnecte && usersdisconnecte.length > 0 ? usersdisconnecte.map((user) => ( 
                                    <div key={user.id} className='grid-31 disconnect'>
                                        <div className="content-image">
                                            <img className='grid-image' src={imgprofil} alt="profile" />
                                            <div className='grid-31-nom'><p>{user.nom}</p></div>
                                        </div>
                                        <div className='grid-31-content'>
                                            <p className='sous-grid-3-title'>Dernière connexion</p>
                                            <p className='grid-31-date'>
                                                {user.lastLogoutDate ? user.lastLogoutDate.split("T")[0] : 'N/A'} à 
                                                <br />
                                                <span className='grid-31-date-heure'>
                                                    {user.lastLogoutDate ? user.lastLogoutDate.split("T")[1].split(".")[0] : 'N/A'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )) : null}
                            </div>
                        </div>

                        {/* Grid 4: Revenue Chart */}
                        <div className='grid-4'>
                            <p className='grid-title chart'>Revenus en dizaine de francs CFA par mois</p>
                            <div className='line-chart'>
                                <Line
                                    data={{
                                        labels: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
                                        datasets: [
                                            {
                                                label: "Revenue",
                                                data: [10, 15, 20, 100, -10, 80, 14, 54, 60, 74, 12, 14],
                                                backgroundColor: "white",
                                                borderColor: "rgba(159, 159, 255, 1)",
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        elements: {
                                            line: {
                                                tension: 0,
                                            },
                                        },
                                        plugins: {
                                            title: {
                                                text: "Monthly Revenue & Cost",
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Information */}
                    <div className='content-barre-dashboard'>
                        <div className='barre-dashboard'>
                            <div className="element-barre">
                                <img className='image-barre' src={iconutilisateurblanc} alt="users" />
                                <p>Uti. connecté : {usersconnecte.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </>
    )
}

export default Dashboard