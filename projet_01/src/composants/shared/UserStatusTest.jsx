import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import UserStatusIndicator from './UserStatusIndicator';
import userStatusService from '../../services/userStatusService';

const TestContainer = styled.div`
  padding: 20px;
  max-width: 800px;
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 15px;
`;

const StatusCard = styled.div`
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TestButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin: 5px;
  
  &:hover {
    background: #5a6fd8;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const StatusInfo = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #666;
`;

const UserStatusTest = () => {
  const [testUsers, setTestUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

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

  const testStatusService = async () => {
    setLoading(true);
    setError(null);

    try {
      // Initialiser le service
      if (!userStatusService.isInitialized) {
        await userStatusService.initialize();
      }

      // Tester la récupération des statuts
      const allStatuses = await userStatusService.loadAllUserStatuses();
      console.log('Statuts chargés:', allStatuses);

      // Tester le marquage de l'utilisateur actuel comme connecté
      if (currentUserId) {
        await userStatusService.markCurrentUserAsConnected();
        console.log('Utilisateur actuel marqué comme connecté');
      }

    } catch (error) {
      setError(`Erreur lors des tests: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDisconnect = async () => {
    if (!currentUserId) {
      setError('Utilisateur actuel non identifié');
      return;
    }

    try {
      await userStatusService.markCurrentUserAsDisconnected();
      console.log('Utilisateur actuel marqué comme déconnecté');
    } catch (error) {
      setError(`Erreur lors de la déconnexion: ${error.message}`);
    }
  };

  const testReconnect = async () => {
    if (!currentUserId) {
      setError('Utilisateur actuel non identifié');
      return;
    }

    try {
      await userStatusService.markCurrentUserAsConnected();
      console.log('Utilisateur actuel marqué comme reconnecté');
    } catch (error) {
      setError(`Erreur lors de la reconnexion: ${error.message}`);
    }
  };

  const getStatusInfo = (userId) => {
    if (!userStatusService.isInitialized) return 'Service non initialisé';
    
    const status = userStatusService.getUserStatus(userId);
    if (!status) return 'Statut non disponible';
    
    return `Statut: ${status.status}, En ligne: ${status.isOnline}, Dernière activité: ${status.lastActivity || 'N/A'}`;
  };

  return (
    <TestContainer>
      <h2>🧪 Test du Statut de Connexion - Messagerie</h2>
      
      <TestSection>
        <TestTitle>Configuration du Test</TestTitle>
        <p>Ce composant teste le service UserStatusService utilisé pour afficher le statut en ligne/hors ligne.</p>
        <p><strong>Utilisateurs de test:</strong> {testUsers.length} utilisateurs avec différents statuts</p>
        <p><strong>Votre ID:</strong> {currentUserId || 'Non identifié'}</p>
        
        <div style={{ marginTop: '15px' }}>
          <TestButton onClick={testStatusService} disabled={loading}>
            {loading ? 'Tests en cours...' : 'Initialiser le Service'}
          </TestButton>
          
          {currentUserId && (
            <>
              <TestButton onClick={testDisconnect} disabled={loading}>
                Se Déconnecter
              </TestButton>
              
              <TestButton onClick={testReconnect} disabled={loading}>
                Se Reconnecter
              </TestButton>
            </>
          )}
        </div>
      </TestSection>

      <TestSection>
        <TestTitle>Indicateurs de Statut</TestTitle>
        <StatusGrid>
          {testUsers.map((user) => (
            <StatusCard key={user.id}>
              <h4>{user.prenom} {user.nom}</h4>
              <p><em>{user.description}</em></p>
              
              <div style={{ margin: '15px 0' }}>
                <strong>Indicateur complet:</strong>
                <UserStatusIndicator 
                  userId={user.id} 
                  showText={true}
                  showLastSeen={true}
                  size="medium"
                />
              </div>
              
              <div style={{ margin: '15px 0' }}>
                <strong>Indicateur compact:</strong>
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
          ))}
        </StatusGrid>
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
        <p><strong>Endpoints API:</strong></p>
        <ul>
          <li>GET /utilisateurs/connected/last-activity - Utilisateurs connectés</li>
          <li>GET /utilisateurs/disconnected/last-activity - Utilisateurs déconnectés</li>
          <li>PUT /utilisateurs/&#123;id&#125;/status - Mise à jour du statut</li>
        </ul>
        <p><strong>Mise à jour automatique:</strong> Toutes les 30 secondes</p>
        <p><strong>Statuts possibles:</strong> CONNECTE, HORS_LIGNE</p>
        <p><strong>Fonctionnalités:</strong></p>
        <ul>
          <li>Indicateur visuel avec point coloré</li>
          <li>Texte de statut (En ligne/Hors ligne)</li>
          <li>Dernière activité (À l'instant, Il y a X min, etc.)</li>
          <li>Animation de pulsation pour les utilisateurs en ligne</li>
          <li>Mise à jour en temps réel via WebSocket</li>
        </ul>
      </TestSection>
    </TestContainer>
  );
};

export default UserStatusTest;
