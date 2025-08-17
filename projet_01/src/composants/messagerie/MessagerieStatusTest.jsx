import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import UserStatusIndicator from '../shared/UserStatusIndicator';
import userStatusService from '../../services/userStatusService';

const TestContainer = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TestSection = styled.div`
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
`;

const TestTitle = styled.h3`
  color: #333;
  margin-bottom: 15px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 15px;
`;

const StatusCard = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TestButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin: 8px;
  font-weight: 500;
  
  &:hover {
    background: #5a6fd8;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  &.danger {
    background: #dc3545;
    
    &:hover {
      background: #c82333;
    }
  }
  
  &.success {
    background: #28a745;
    
    &:hover {
      background: #218838;
    }
  }
`;

const StatusInfo = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #667eea;
`;

const LiveStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
  padding: 15px;
  background: ${props => props.isOnline ? '#d4edda' : '#f8d7da'};
  border: 1px solid ${props => props.isOnline ? '#c3e6cb' : '#f5c6cb'};
  border-radius: 6px;
  color: ${props => props.isOnline ? '#155724' : '#721c24'};
`;

const MessagerieStatusTest = () => {
  const [testUsers, setTestUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(false);

  // Utilisateurs de test avec différents IDs
  const mockUsers = [
    { id: 1, nom: 'Dupont', prenom: 'Jean', description: 'Utilisateur connecté' },
    { id: 2, nom: 'Martin', prenom: 'Marie', description: 'Utilisateur déconnecté' },
    { id: 3, nom: 'Bernard', prenom: 'Pierre', description: 'Utilisateur inconnu' },
    { id: 4, nom: 'Petit', prenom: 'Sophie', description: 'Utilisateur actuel' }
  ];

  useEffect(() => {
    setTestUsers(mockUsers);
    
    // Récupérer l'ID de l'utilisateur actuel
    const userId = localStorage.getItem('id');
    if (userId) {
      setCurrentUserId(parseInt(userId));
      // Mettre à jour la description de l'utilisateur actuel
      setTestUsers(prev => prev.map(user => 
        user.id === parseInt(userId) 
          ? { ...user, description: 'Utilisateur actuel (vous)' }
          : user
      ));
    }
  }, []);

  // Effet pour les mises à jour automatiques
  useEffect(() => {
    if (!autoUpdate) return;

    const interval = setInterval(async () => {
      try {
        await userStatusService.loadAllUserStatuses();
        addStatusUpdate('Mise à jour automatique effectuée');
      } catch (error) {
        addStatusUpdate(`Erreur mise à jour auto: ${error.message}`, 'error');
      }
    }, 10000); // Toutes les 10 secondes

    return () => clearInterval(interval);
  }, [autoUpdate]);

  const addStatusUpdate = (message, type = 'info') => {
    const update = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setStatusUpdates(prev => [update, ...prev.slice(0, 9)]); // Garder les 10 derniers
  };

  const testStatusService = async () => {
    setLoading(true);
    setError(null);

    try {
      // Initialiser le service
      if (!userStatusService.isInitialized) {
        await userStatusService.initialize();
        addStatusUpdate('Service initialisé avec succès', 'success');
      }

      // Tester la récupération des statuts
      await userStatusService.loadAllUserStatuses();
      addStatusUpdate('Statuts chargés avec succès', 'success');

      // Tester le marquage de l'utilisateur actuel comme connecté
      if (currentUserId) {
        await userStatusService.markCurrentUserAsConnected();
        addStatusUpdate('Utilisateur actuel marqué comme connecté', 'success');
      }

    } catch (error) {
      const errorMsg = `Erreur lors des tests: ${error.message}`;
      setError(errorMsg);
      addStatusUpdate(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testDisconnect = async () => {
    if (!currentUserId) {
      const errorMsg = 'Utilisateur actuel non identifié';
      setError(errorMsg);
      addStatusUpdate(errorMsg, 'error');
      return;
    }

    try {
      await userStatusService.markCurrentUserAsDisconnected();
      addStatusUpdate('Utilisateur actuel marqué comme déconnecté', 'success');
    } catch (error) {
      const errorMsg = `Erreur lors de la déconnexion: ${error.message}`;
      setError(errorMsg);
      addStatusUpdate(errorMsg, 'error');
    }
  };

  const testReconnect = async () => {
    if (!currentUserId) {
      const errorMsg = 'Utilisateur actuel non identifié';
      setError(errorMsg);
      addStatusUpdate(errorMsg, 'error');
      return;
    }

    try {
      await userStatusService.markCurrentUserAsConnected();
      addStatusUpdate('Utilisateur actuel marqué comme reconnecté', 'success');
    } catch (error) {
      const errorMsg = `Erreur lors de la reconnexion: ${error.message}`;
      setError(errorMsg);
      addStatusUpdate(errorMsg, 'error');
    }
  };

  const toggleAutoUpdate = () => {
    setAutoUpdate(!autoUpdate);
    addStatusUpdate(
      autoUpdate ? 'Mise à jour automatique désactivée' : 'Mise à jour automatique activée (10s)',
      'info'
    );
  };

  const getStatusInfo = (userId) => {
    if (!userStatusService.isInitialized) return 'Service non initialisé';
    
    const status = userStatusService.getUserStatus(userId);
    if (!status) return 'Statut non disponible';
    
    return `Statut: ${status.status}, En ligne: ${status.isOnline}, Dernière activité: ${status.lastActivity || 'N/A'}`;
  };

  const getLiveStatus = (userId) => {
    if (!userStatusService.isInitialized) return null;
    
    const status = userStatusService.getUserStatus(userId);
    return status;
  };

  return (
    <TestContainer>
      <h2>🧪 Test du Statut Dynamique - Messagerie Complète</h2>
      
      <TestSection>
        <TestTitle>Configuration du Test</TestTitle>
        <p>Ce composant teste le système complet de statut dynamique utilisé dans la messagerie.</p>
        <p><strong>Utilisateurs de test:</strong> {testUsers.length} utilisateurs avec différents statuts</p>
        <p><strong>Votre ID:</strong> {currentUserId || 'Non identifié'}</p>
        
        <div style={{ marginTop: '15px' }}>
          <TestButton onClick={testStatusService} disabled={loading}>
            {loading ? 'Tests en cours...' : 'Initialiser le Service'}
          </TestButton>
          
          {currentUserId && (
            <>
              <TestButton onClick={testDisconnect} disabled={loading} className="danger">
                Se Déconnecter
              </TestButton>
              
              <TestButton onClick={testReconnect} disabled={loading} className="success">
                Se Reconnecter
              </TestButton>
            </>
          )}
          
          <TestButton onClick={toggleAutoUpdate} className={autoUpdate ? 'success' : ''}>
            {autoUpdate ? 'Désactiver Auto' : 'Activer Auto (10s)'}
          </TestButton>
        </div>
      </TestSection>

      <TestSection>
        <TestTitle>Indicateurs de Statut Dynamiques</TestTitle>
        <StatusGrid>
          {testUsers.map((user) => {
            const liveStatus = getLiveStatus(user.id);
            return (
              <StatusCard key={user.id}>
                <h4>{user.prenom} {user.nom}</h4>
                <p><em>{user.description}</em></p>
                
                {liveStatus && (
                  <LiveStatus isOnline={liveStatus.isOnline}>
                    <strong>Statut en temps réel:</strong>
                    {liveStatus.isOnline ? '🟢 En ligne' : '⚫ Hors ligne'}
                  </LiveStatus>
                )}
                
                <div style={{ margin: '15px 0' }}>
                  <strong>Indicateur complet (messagerie):</strong>
                  <UserStatusIndicator 
                    userId={user.id} 
                    showText={true}
                    showLastSeen={true}
                    size="medium"
                  />
                </div>
                
                <div style={{ margin: '15px 0' }}>
                  <strong>Indicateur compact (liste contacts):</strong>
                  <UserStatusIndicator 
                    userId={user.id} 
                    showText={true}
                    showLastSeen={false}
                    size="small"
                  />
                </div>
                
                <div style={{ margin: '15px 0' }}>
                  <strong>Point de statut uniquement:</strong>
                  <UserStatusIndicator 
                    userId={user.id} 
                    showText={false}
                    showLastSeen={false}
                    size="medium"
                  />
                </div>
                
                <StatusInfo>
                  <strong>Informations techniques:</strong><br />
                  ID: {user.id}<br />
                  {getStatusInfo(user.id)}
                </StatusInfo>
              </StatusCard>
            );
          })}
        </StatusGrid>
      </TestSection>

      <TestSection>
        <TestTitle>Journal des Mises à Jour</TestTitle>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {statusUpdates.length === 0 ? (
            <p>Aucune mise à jour pour le moment</p>
          ) : (
            statusUpdates.map((update) => (
              <div 
                key={update.id}
                style={{
                  padding: '8px 12px',
                  margin: '4px 0',
                  borderRadius: '4px',
                  background: update.type === 'error' ? '#f8d7da' : 
                             update.type === 'success' ? '#d4edda' : '#d1ecf1',
                  color: update.type === 'error' ? '#721c24' : 
                         update.type === 'success' ? '#155724' : '#0c5460',
                  border: `1px solid ${update.type === 'error' ? '#f5c6cb' : 
                                     update.type === 'success' ? '#c3e6cb' : '#bee5eb'}`,
                  fontSize: '12px'
                }}
              >
                <strong>[{update.timestamp}]</strong> {update.message}
              </div>
            ))
          )}
        </div>
      </TestSection>

      {error && (
        <TestSection>
          <TestTitle>Erreur</TestTitle>
          <div style={{ color: '#dc3545', padding: '10px', background: '#f8d7da', borderRadius: '4px' }}>
            <strong>Erreur:</strong> {error}
          </div>
        </TestSection>
      )}

      <TestSection>
        <TestTitle>Informations Techniques</TestTitle>
        <p><strong>Service utilisé:</strong> UserStatusService</p>
        <p><strong>Composant d'indicateur:</strong> UserStatusIndicator</p>
        <p><strong>Endpoints API:</strong></p>
        <ul>
          <li>GET /utilisateurs/connected/last-activity - Utilisateurs connectés</li>
          <li>GET /utilisateurs/disconnected/last-activity - Utilisateurs déconnectés</li>
          <li>PUT /utilisateurs/&#123;id&#125;/status - Mise à jour du statut</li>
        </ul>
        <p><strong>Mise à jour automatique:</strong> Toutes les 30 secondes (configurable)</p>
        <p><strong>Statuts possibles:</strong> CONNECTE, HORS_LIGNE</p>
        <p><strong>Fonctionnalités dynamiques:</strong></p>
        <ul>
          <li>✅ Mise à jour en temps réel via WebSocket</li>
          <li>✅ Mise à jour périodique via API</li>
          <li>✅ Changement automatique lors connexion/déconnexion</li>
          <li>✅ Indicateurs visuels avec animations</li>
          <li>✅ Gestion des erreurs et fallbacks</li>
        </ul>
        <p><strong>Intégration dans la messagerie:</strong></p>
        <ul>
          <li>✅ Liste des contacts (indicateur compact)</li>
          <li>✅ En-tête de chat (indicateur complet avec dernière activité)</li>
          <li>✅ ChatInterface (indicateur compact)</li>
          <li>✅ Tous les rôles (Admin, Médecin, Secrétaire)</li>
        </ul>
      </TestSection>
    </TestContainer>
  );
};

export default MessagerieStatusTest;
