import '../../styles/Zonedaffichage.css'
import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import axios from 'axios';
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import iconutilisateurblanc from '../../assets/iconutilisateurdashboardblanc.svg'
import '../../styles/dashboard.css'

function Dashboard() {
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
            <div className="loading-container">
                <div>Chargement du dashboard...</div>
            </div>
        );
    }

    return (
        <>
            {/* Header Section */}
            <div className="sous-div1">
                <Barrehorizontal1 titrepage="Dashboard" imgprofil1={imgprofil} nomprofil={nomprofil}>
                    <span className="span1">Home</span>
                </Barrehorizontal1>
            </div>

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


                {/* Dashboard Grid Layout */}
                <div className='dashboard-grid'>
                    {/* Grid 1: Account Information */}
                    <div className='account-grid grid-1'>
                        <p className='grid-title title'>Ce compte</p>
                        <div className='grid-01'>
                            {/* Connection Info */}
                            <div className='grid-11 box-gid-01'>
                                <div className="grid-1-content-image">
                                    <img className='responsive-image' src={imgprofil} alt="profile" />
                                </div>

                                <div className='grid-11-content'>
                                    <p className='sous-grid-title'>Connecté depuis le</p>
                                    {connexionadmin && connexionadmin.length > 0 ? connexionadmin.map((connexion) => (
                                        <p className='grid-11-date' key={connexion.id}>
                                            {connexion.lastLoginDate ? connexion.lastLoginDate.split("T")[0] : 'N/A'} A <br />
                                            <span className='grid-11-date-heure'>
                                                {connexion.lastLoginDate ? connexion.lastLoginDate.split("T")[1].split(".")[0] : 'N/A'}
                                            </span>
                                        </p>
                                    )) : <p className='grid-11-date'>Aucune donnée disponible</p>}
                                </div>
                            </div>

                            {/* Last Connection */}
                            <div className='grid-13 box-gid-01'>
                                <div className="grid-1-content-image">
                                    <img className='responsive-image' src={imgprofil} alt="profile" />
                                </div>

                                <div className='grid-11-content'>
                                    <p className='sous-grid-title'> Dernière connection </p>
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
                        </div>
                    </div>

                    <div className='historique-grid'>
                        <p className='grid-3-title title'>Actions récentes</p>
                        <div className='grid-3-content'>
                            <ul className='sous-grid-liste'>
                                {historiques && historiques.length > 0 ? historiques.map((historique) => (
                                    <li key={historique.id}> {historique.action || 'Action non spécifiée'}</li>
                                )) : <li>Aucune activité récente</li>}
                            </ul>
                        </div>
                    </div>

                    {/* Grid 2: Today's Statistics */}
                    <div className='stats-grid grid-2'>
                        <p className='grid-2-title title'>statistiques du jour</p>
                        <div className='grid-2-content'>
                            <div className="grid-2-content-chid">
                                <p className="grid-2-content-chid-text">Patients enregistrés</p>
                                <div className="grid-2-content-chid-chiffre">{statjour.nbrPatientEnrg || 0}</div>
                            </div>
                            <div className="grid-2-content-chid">
                                <p className="grid-2-content-chid-text"> Nombre de RDV validés</p>
                                <div className="grid-2-content-chid-chiffre">{statjour.nbrRendezVousCONFIRME || 0}</div>
                            </div>
                            <div className="grid-2-content-chid">
                                <p className="grid-2-content-chid-text"> Nombre de RDV manqués</p>
                                <div className="grid-2-content-chid-chiffre">{statjour.nbrRendezANNULE || 0}</div>
                            </div>
                            <div className="grid-2-content-chid">
                                <p className="grid-2-content-chid-text">Nombre de consultations effectuées</p>
                                <div className="grid-2-content-chid-chiffre">{statjour.nbrConsultation || 0}</div>
                            </div>
                        </div>
                    </div>

                    {/* Grid 3: Connected Users */}
                    <div className='grid-3'>
                        <p className='grid-3-title title'>Connectés récemment</p>
                        <div className='grid-3-content'>
                            {usersconnecte && usersconnecte.length > 0 ? usersconnecte.map((user) => (
                                <div key={user.id} className='grid-31'>
                                    <div className="content-image img-connecte">
                                        <img className='responsive-image img-connecte' src={imgprofil} alt="profile" />
                                        <div className='img-nom'>
                                            <p>{user.nom}.</p>
                                        </div>
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
                                    <div className="content-image img-connecte">
                                        <img className='responsive-image img-connecte' src={imgprofil} alt="profile" />
                                        <div className='img-nom'>
                                            <p>{user.nom}</p>
                                        </div>
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
                        <p className='grid-title chart title'>Revenus en dizaine de francs CFA par mois</p>
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

                <div className='barre-dashboard'>

                    <img className='image-barre' src={iconutilisateurblanc} alt="users" />
                    <p>Uti. connecté : {usersconnecte.length}</p>

                </div>

            </div>

        </>
    )
}

export default Dashboard