
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../composants/config/apiconfig';
import '../../styles/dashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofilDefault from '../../assets/photoDoc.png'
import iconutilisateurblanc from '../../assets/iconutilisateurdashboardblanc.svg'

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil] = useState('')
    const [imgprofil, setImgprofil] = useState(imgprofilDefault)
    const [statjour, setstatjour] = useState({})
    const [usersconnecte, setusersconnecte] = useState([])
    const [usersdisconnecte, setusersdisconnecte] = useState([])
    const [connexionadmin, setconnexionadmin] = useState([])
    const [historiques, sethistoriques] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [blobUrls, setBlobUrls] = useState([]) // Pour stocker les URLs des blobs
    const [monthlyRevenue, setMonthlyRevenue] = useState([])

    // Récupération du nom et de la photo de profil de l'utilisateur connecté
    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchUserProfile = async () => {
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
                    // Utiliser l'API de récupération des images par ID
                    if (response.data.id) {
                        try {
                            const photoResponse = await axios.get(`${API_BASE}/utilisateurs/${response.data.id}/photo`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                                responseType: 'blob'
                            });
                            const imageUrl = URL.createObjectURL(photoResponse.data);
                            setImgprofil(imageUrl);
                            setBlobUrls(prev => [...prev, imageUrl]);
                        } catch (photoError) {
                            // Si pas de photo, utiliser l'image par défaut
                            setImgprofil(imgprofilDefault);
                        }
                    } else {
                        setImgprofil(imgprofilDefault);
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                setImgprofil(imgprofilDefault);
            }
        }
        fetchUserProfile()
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

    // Récupération des revenus mensuels
    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchMonthlyRevenue = async () => {
            try {
                const response = await axios.get(`${API_BASE}/stats/monthly`,
                    {
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                if (response && response.data) {
                    setMonthlyRevenue(response.data || [])
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des revenus mensuels:', error);
                setMonthlyRevenue([])
            }
        }
        fetchMonthlyRevenue()
    }, []);

    // Récupération des utilisateurs connectés avec leur image de profil
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
                    // Pour chaque utilisateur, récupérer sa photo de profil via l'API
                    const usersWithImg = await Promise.all(
                        response.data.map(async user => {
                            try {
                                const photoResponse = await axios.get(`${API_BASE}/utilisateurs/${user.id}/photo`, {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                    responseType: 'blob'
                                });
                                const imageUrl = URL.createObjectURL(photoResponse.data);
                                setBlobUrls(prev => [...prev, imageUrl]);
                                return { ...user, imgProfilUrl: imageUrl };
                            } catch (photoError) {
                                // Si pas de photo, utiliser l'image par défaut
                                return { ...user, imgProfilUrl: imgprofilDefault };
                            }
                        })
                    );
                    setusersconnecte(usersWithImg || [])
                    // Filtrer pour l'admin connecté
                    const adminUser = usersWithImg.find(user => user.id === parseInt(idUser))
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

    // Récupération des utilisateurs déconnectés avec leur image de profil
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
                    const usersWithImg = await Promise.all(
                        response.data.map(async user => {
                            try {
                                const photoResponse = await axios.get(`${API_BASE}/utilisateurs/${user.id}/photo`, {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                    responseType: 'blob'
                                });
                                const imageUrl = URL.createObjectURL(photoResponse.data);
                                setBlobUrls(prev => [...prev, imageUrl]);
                                return { ...user, imgProfilUrl: imageUrl };
                            } catch (photoError) {
                                // Si pas de photo, utiliser l'image par défaut
                                return { ...user, imgProfilUrl: imgprofilDefault };
                            }
                        })
                    );
                    setusersdisconnecte(usersWithImg || [])
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs déconnectés:', error);
                setusersdisconnecte([])
            }
        }
        utilisateursdeconnectes()
    }, []);

    // Nettoyage des URLs des blobs lors du démontage du composant
    useEffect(() => {
        return () => {
            blobUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [blobUrls]);

    // Récupération de l'historique des actions
    useEffect(() => {
        const token = localStorage.getItem('token');
        const Historique = async () => {
            try {
                // Récupérer TOUTES les actions sans limitation
                const response = await axios.get(`${API_BASE}/historiqueActions`,
                    {
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                if (response && response.data) {
                    // Trier du plus récent au plus ancien - Aucune limitation sur le nombre d'actions
                    const sortedHistorique = response.data.sort((a, b) => {
                        const dateA = new Date(a.dateAction || a.createdAt || 0);
                        const dateB = new Date(b.dateAction || b.createdAt || 0);
                        return dateB - dateA; // dateB - dateA = ordre décroissant (récent → ancien)
                    });
                    sethistoriques(sortedHistorique || [])
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

    // Fonction de recherche par mot-clé (filtrage côté frontend)
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

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
                                    <img className='responsive-image' src={connexionadmin[0]?.imgProfilUrl || imgprofil} alt="profile" />
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
                                    <img className='responsive-image' src={connexionadmin[0]?.imgProfilUrl || imgprofil} alt="profile" />
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
                        <div className='historique-header'>
                            <p className='grid-3-title title'>Historique des actions</p>
                            <div className='search-container'>
                                <input
                                    type="text"
                                    placeholder="Rechercher par mot-clé..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className='search-input'
                                />
                                {/* isSearching && <div className='search-loading'>Recherche...</div> */}
                            </div>
                        </div>
                        <div className='grid-3-content'>
                            {/* Affichage des résultats de recherche ou de l'historique complet */}
                            <ul className='sous-grid-liste'>
                                {searchTerm.trim() ? (
                                    // Résultats de recherche par mot-clé (filtrage côté frontend)
                                    historiques.filter(historique => 
                                        historique.action && historique.action.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).length > 0 ? (
                                        historiques.filter(historique => 
                                            historique.action && historique.action.toLowerCase().includes(searchTerm.toLowerCase())
                                        ).map((historique) => (
                                            <li key={historique.id}>
                                                {historique.action || 'Action non spécifiée'}
                                            </li>
                                        ))
                                    ) : (
                                        <li>Aucun résultat trouvé</li>
                                    )
                                ) : (
                                    // Historique complet trié du plus récent au plus ancien
                                    historiques && historiques.length > 0 ? (
                                        historiques.map((historique) => (
                                            <li key={historique.id}>
                                                {historique.action || 'Action non spécifiée'}
                                            </li>
                                        ))
                                    ) : (
                                        <li>Aucune activité récente</li>
                                    )
                                )}
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
                        <p className='grid-3-title title'>Etat des Connexions</p>
                        <div className='grid-3-content'>
                            {/* Section des utilisateurs connectés */}
                            <div className='section-title'>
                                <h4>Utilisateurs connectés</h4>
                            </div>
                            {usersconnecte && usersconnecte.length > 0 ? usersconnecte.map((user) => (
                                <div key={user.id} className='grid-31'>
                                    <div className="content-image img-connecte">
                                        <img className='responsive-image img-connecte' src={user.imgProfilUrl || imgprofilDefault} alt="profile" />
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

                            {/* Section des utilisateurs déconnectés */}
                            {usersdisconnecte && usersdisconnecte.length > 0 && (
                                <>
                                    <div className='section-title'>
                                        <h4>Utilisateurs déconnectés</h4>
                                    </div>
                                    {usersdisconnecte.map((user) => (
                                        <div key={user.id} className='grid-31 disconnect'>
                                            <div className="content-image img-connecte">
                                                <img className='responsive-image img-connecte' src={user.imgProfilUrl || imgprofilDefault} alt="profile" />
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
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Grid 4: Revenue Chart */}
                    <div className='grid-4'>
                        <p className='grid-title chart title'>Chiffre d'affaires par mois (en FCFA)</p>
                        <div className='line-chart'>
                            <Line
                                data={{
                                    labels: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
                                    datasets: [
                                        {
                                            label: "Revenue",
                                            data: monthlyRevenue.length > 0 ? monthlyRevenue : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
