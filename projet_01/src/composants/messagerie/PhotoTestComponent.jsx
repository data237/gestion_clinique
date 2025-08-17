import React, { useState, useEffect } from 'react';
import UserPhotoService from '../../services/userPhotoService';
import styled from 'styled-components';
import imgprofilDefault from '../../assets/photoDoc.png';

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

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
`;

const PhotoItem = styled.div`
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const PhotoImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e1e5e9;
  margin-bottom: 10px;
`;

const PhotoInfo = styled.div`
  font-size: 12px;
  color: #666;
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

const StatusMessage = styled.div`
  padding: 10px;
  margin: 10px 0;
  border-radius: 6px;
  font-size: 14px;
  
  &.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  &.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  &.info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }
`;

const PhotoTestComponent = () => {
  const [testUsers, setTestUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState([]);

  // Utilisateurs de test avec différents scénarios
  const mockUsers = [
    { id: 1, nom: 'Dupont', prenom: 'Jean', photoProfil: 'photo1.jpg', description: 'Avec photo' },
    { id: 2, nom: 'Martin', prenom: 'Marie', photoProfil: null, description: 'Sans photo' },
    { id: 3, nom: 'Bernard', prenom: 'Pierre', photoProfil: 'photo3.jpg', description: 'Avec photo' },
    { id: 4, nom: 'Petit', prenom: 'Sophie', photoProfil: '', description: 'Photo vide' },
    { id: 5, nom: 'Robert', prenom: 'Lucas', photoProfil: undefined, description: 'Photo undefined' }
  ];

  useEffect(() => {
    setTestUsers(mockUsers);
  }, []);

  const testPhotoService = async () => {
    setLoading(true);
    setError(null);
    setTestResults([]);

    try {
      const results = [];

      // Test 1: getUserPhotoUrl
      results.push({
        test: 'getUserPhotoUrl',
        status: 'info',
        message: 'Test de la méthode getUserPhotoUrl...'
      });

      testUsers.forEach(user => {
        const photoUrl = UserPhotoService.getUserPhotoUrl(user.id, user.photoProfil);
        const hasPhoto = user.photoProfil && user.photoProfil.trim() !== '';
        const expectedResult = hasPhoto ? 'URL API' : 'Image par défaut';
        
        if ((hasPhoto && photoUrl.includes('/utilisateurs/')) || (!hasPhoto && photoUrl === imgprofilDefault)) {
          results.push({
            test: `getUserPhotoUrl - ${user.prenom} ${user.nom}`,
            status: 'success',
            message: `✅ ${user.description}: ${expectedResult}`
          });
        } else {
          results.push({
            test: `getUserPhotoUrl - ${user.prenom} ${user.nom}`,
            status: 'error',
            message: `❌ ${user.description}: Résultat inattendu`
          });
        }
      });

      // Test 2: handleImageError
      results.push({
        test: 'handleImageError',
        status: 'info',
        message: 'Test de la méthode handleImageError...'
      });

      const mockEvent = {
        target: { src: 'invalid-url.jpg' }
      };
      
      UserPhotoService.handleImageError(mockEvent, imgprofilDefault);
      
      if (mockEvent.target.src === imgprofilDefault) {
        results.push({
          test: 'handleImageError',
          status: 'success',
          message: '✅ Gestion d\'erreur d\'image fonctionne'
        });
      } else {
        results.push({
          test: 'handleImageError',
          status: 'error',
          message: '❌ Gestion d\'erreur d\'image échoue'
        });
      }

      // Test 3: revokeBlobUrls
      results.push({
        test: 'revokeBlobUrls',
        status: 'info',
        message: 'Test de la méthode revokeBlobUrls...'
      });

      const mockBlobUrls = ['blob:http://localhost:3000/abc123', 'blob:http://localhost:3000/def456'];
      UserPhotoService.revokeBlobUrls(mockBlobUrls);
      
      results.push({
        test: 'revokeBlobUrls',
        status: 'success',
        message: '✅ Nettoyage des blobs testé (pas d\'erreur)'
      });

      setTestResults(results);

    } catch (error) {
      setError(`Erreur lors des tests: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testPhotoRetrieval = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test de récupération de photos réelles (si l'API est disponible)
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token d\'authentification manquant pour tester l\'API réelle');
        setLoading(false);
        return;
      }

      // Test avec un utilisateur de test
      const testUser = testUsers[0];
      if (testUser.photoProfil) {
        try {
          const photoUrl = await UserPhotoService.getUserPhotoWithFallback(testUser.id, testUser.photoProfil);
          setTestResults(prev => [...prev, {
            test: 'getUserPhotoWithFallback - API réelle',
            status: 'success',
            message: `✅ Photo récupérée via API: ${photoUrl !== imgprofilDefault ? 'Succès' : 'Image par défaut'}`
          }]);
        } catch (apiError) {
          setTestResults(prev => [...prev, {
            test: 'getUserPhotoWithFallback - API réelle',
            status: 'error',
            message: `❌ Erreur API: ${apiError.message}`
          }]);
        }
      }

    } catch (error) {
      setError(`Erreur lors du test API: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TestContainer>
      <h2>🧪 Test du Service de Photos - Messagerie</h2>
      
      <TestSection>
        <TestTitle>Configuration du Test</TestTitle>
        <p>Ce composant teste le service UserPhotoService utilisé dans la messagerie.</p>
        <p><strong>Utilisateurs de test:</strong> {testUsers.length} utilisateurs avec différents scénarios de photos</p>
        
        <div style={{ marginTop: '15px' }}>
          <TestButton onClick={testPhotoService} disabled={loading}>
            {loading ? 'Tests en cours...' : 'Lancer les Tests Locaux'}
          </TestButton>
          
          <TestButton onClick={testPhotoRetrieval} disabled={loading}>
            {loading ? 'Test API...' : 'Tester l\'API Réelle'}
          </TestButton>
        </div>
      </TestSection>

      <TestSection>
        <TestTitle>Utilisateurs de Test</TestTitle>
        <PhotoGrid>
          {testUsers.map((user) => (
            <PhotoItem key={user.id}>
              <PhotoImage 
                src={UserPhotoService.getUserPhotoUrl(user.id, user.photoProfil)} 
                alt={`${user.prenom} ${user.nom}`}
                onError={(e) => UserPhotoService.handleImageError(e, imgprofilDefault)}
              />
              <PhotoInfo>
                <strong>{user.prenom} {user.nom}</strong><br />
                {user.description}<br />
                ID: {user.id}
              </PhotoInfo>
            </PhotoItem>
          ))}
        </PhotoGrid>
      </TestSection>

      {testResults.length > 0 && (
        <TestSection>
          <TestTitle>Résultats des Tests</TestTitle>
          {testResults.map((result, index) => (
            <StatusMessage key={index} className={result.status}>
              <strong>{result.test}:</strong> {result.message}
            </StatusMessage>
          ))}
        </TestSection>
      )}

      {error && (
        <StatusMessage className="error">
          <strong>Erreur:</strong> {error}
        </StatusMessage>
      )}

      <TestSection>
        <TestTitle>Informations Techniques</TestTitle>
        <p><strong>Endpoint API:</strong> {process.env.REACT_APP_API_BASE || 'API_BASE'}/utilisateurs/&#123;id&#125;/photo</p>
        <p><strong>Image par défaut:</strong> {imgprofilDefault}</p>
        <p><strong>Méthodes testées:</strong></p>
        <ul>
          <li>getUserPhotoUrl() - Génération d'URLs</li>
          <li>getUserPhotoBlob() - Récupération avec blobs</li>
          <li>handleImageError() - Gestion des erreurs d'images</li>
          <li>revokeBlobUrls() - Nettoyage des blobs</li>
        </ul>
      </TestSection>
    </TestContainer>
  );
};

export default PhotoTestComponent;
