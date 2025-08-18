import React, { useState, useEffect } from 'react';
import { UnifiedModal, ModalButton } from '../shared/UnifiedModal';
import { API_BASE } from '../config/apiconfig';
import axios from 'axios';
import styled from 'styled-components';
import imgprofilDefault from '../../assets/photoDoc.png';
import UserPhotoService from '../../services/userPhotoService';

const FormContainer = styled.div`
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box; /* Inclure padding et border dans la largeur */
  
  &:focus {
    outline: none; /* Supprimer l'outline par défaut */
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); /* Focus visible sans débordement */
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box; /* Inclure padding et border dans la largeur */
  
  &:focus {
    outline: none; /* Supprimer l'outline par défaut */
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); /* Focus visible sans débordement */
  }
`;

const SelectedUsersContainer = styled.div`
  margin-top: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e1e5e9;
`;

const SelectedUserItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #333;
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap; /* Empêcher le débordement de texte */
  overflow: hidden; /* Empêcher le débordement */
  text-overflow: ellipsis; /* Ajouter des points de suspension si nécessaire */
  box-sizing: border-box; /* Inclure padding et border dans la largeur */
  
  &:hover {
    background: #c82333;
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: none; /* Supprimer l'outline par défaut */
    background: #c82333;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.3); /* Focus visible sans débordement */
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Composants pour la sélection d'utilisateurs intégrée
const UserSelectionSection = styled.div`
  margin-top: 20px;
  border-top: 2px solid #e0e0e0;
  padding-top: 20px;
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 15px;
  background: white;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  min-width: 150px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const UserList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
    transform: translateX(2px);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  ${props => props.selected && `
    background-color: #e3f2fd;
    border-left: 4px solid #2196f3;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
  `}
`;

const UserAvatarSmall = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
  border: 2px solid #e1e5e9;
  background: #f0f0f0;
`;

const UserInfoSmall = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserNameSmall = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserDetailsSmall = styled.div`
  font-size: 11px;
  color: #666;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const UserRoleSmall = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
`;

const Checkbox = styled.input`
  margin-left: 10px;
  transform: scale(1.3);
  accent-color: #667eea;
`;

const AddUsersButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
`;

const NoUsersMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;
  font-style: italic;
  background: white;
  border-radius: 8px;
  border: 1px dashed #e1e5e9;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 30px;
  color: #667eea;
  font-weight: 500;
  
  &::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #e1e5e9;
    border-top: 2px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 20px;
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  margin: 10px 0;
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 15px;
  color: #155724;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  margin: 10px 0;
  font-weight: 500;
`;

const DuplicateWarning = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WarningIcon = styled.span`
  color: #f39c12;
  font-size: 14px;
`;

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // États pour la sélection d'utilisateurs
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // Charger les utilisateurs quand on ouvre la sélection
  React.useEffect(() => {
    if (showUserSelection && users.length === 0) {
      fetchUsers();
    }
  }, [showUserSelection]);

  // Filtrer les utilisateurs
  React.useEffect(() => {
    let filtered = users;

    if (searchTerm.trim()) {
      filtered = filtered.filter(user => 
        user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(user => {
        const userRole = typeof user.role === 'object' ? user.role.roleType : user.role;
        return userRole === roleFilter;
      });
    }

    if (serviceFilter && serviceFilter !== 'all') {
      filtered = filtered.filter(user => {
        const userService = typeof user.serviceMedical === 'object' ? user.serviceMedical.nom : user.serviceMedical;
        return userService === serviceFilter;
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, serviceFilter]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await axios.get(`${API_BASE}/utilisateurs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        // Ajouter les URLs des photos aux utilisateurs
        const usersWithPhotos = response.data.map(user => ({
          ...user,
          photoUrl: UserPhotoService.getUserPhotoUrl(user.id, user.photoProfil)
        }));
        
        setUsers(usersWithPhotos);
        setFilteredUsers(usersWithPhotos);
        console.log('Utilisateurs chargés avec succès:', usersWithPhotos.length);
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      if (error.response?.status === 401) {
        setUsersError('Session expirée. Veuillez vous reconnecter.');
      } else if (error.response?.status === 403) {
        setUsersError('Accès refusé. Permissions insuffisantes.');
      } else if (error.code === 'NETWORK_ERROR') {
        setUsersError('Erreur de connexion réseau. Vérifiez votre connexion internet.');
      } else {
        setUsersError(`Erreur lors du chargement des utilisateurs: ${error.message}`);
      }
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Le nom du groupe est requis');
      return;
    }

    // Nettoyer les doublons avant la validation
    cleanDuplicateUsers();

    if (getSelectedUsersCount() === 0) {
      setError('Veuillez sélectionner au moins un utilisateur');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const groupData = {
        nom: groupName.trim(),
        description: groupDescription.trim(),
        membres: selectedUsers.map(user => user.id)
      };

      const response = await axios.post(`${API_BASE}/messagerie/groupes`, groupData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data) {
        // Réinitialiser le formulaire
        setGroupName('');
        setGroupDescription('');
        setSelectedUsers([]);
        setShowUserSelection(false);
        
        // Fermer le modal
        onClose();
        
        // Notifier le composant parent
        if (onGroupCreated) {
          onGroupCreated(response.data);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la création du groupe:', error);
      setError('Erreur lors de la création du groupe. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserToggle = (user) => {
    if (!user || !user.id) {
      console.error('Utilisateur invalide:', user);
      return;
    }

    setSelectedUsers(prev => {
      // Vérifier si l'utilisateur est déjà sélectionné
      const isAlreadySelected = prev.some(selected => selected.id === user.id);
      
      if (isAlreadySelected) {
        // Retirer l'utilisateur s'il est déjà sélectionné
        const updatedUsers = prev.filter(selected => selected.id !== user.id);
        console.log(`Utilisateur ${user.prenom} ${user.nom} retiré de la sélection`);
        return updatedUsers;
      } else {
        // Ajouter l'utilisateur s'il n'est pas déjà sélectionné
        const updatedUsers = [...prev, user];
        console.log(`Utilisateur ${user.prenom} ${user.nom} ajouté à la sélection`);
        return updatedUsers;
      }
    });
  };

  const removeUser = (userId) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };

  // Fonction pour vérifier si un utilisateur est sélectionné
  const isUserSelected = (userId) => {
    return selectedUsers.some(user => user.id === userId);
  };

  // Fonction pour obtenir le nombre d'utilisateurs sélectionnés (sans doublons)
  const getSelectedUsersCount = () => {
    const uniqueIds = new Set(selectedUsers.map(user => user.id));
    return uniqueIds.size;
  };

  // Fonction pour nettoyer les doublons existants
  const cleanDuplicateUsers = () => {
    setSelectedUsers(prev => {
      const uniqueUsers = [];
      const seenIds = new Set();
      
      prev.forEach(user => {
        if (!seenIds.has(user.id)) {
          seenIds.add(user.id);
          uniqueUsers.push(user);
        }
      });
      
      return uniqueUsers;
    });
  };

  // Nettoyer les doublons quand la liste change
  React.useEffect(() => {
    if (selectedUsers.length > 0) {
      const uniqueIds = new Set(selectedUsers.map(user => user.id));
      if (uniqueIds.size !== selectedUsers.length) {
        cleanDuplicateUsers();
      }
    }
  }, [selectedUsers]);

  const handleClose = () => {
    // Réinitialiser le formulaire lors de la fermeture
    setGroupName('');
    setGroupDescription('');
    setSelectedUsers([]);
    setShowUserSelection(false);
    setError(null);
    setSearchTerm('');
    setRoleFilter('');
    setServiceFilter('');
    onClose();
  };

  const getRoleLabel = (role) => {
    if (typeof role === 'object' && role !== null) {
      if (role.roleType) {
        role = role.roleType;
      } else if (role.name) {
        role = role.name;
      } else {
        role = JSON.stringify(role);
      }
    }
    
    const roleStr = String(role);
    
    switch (roleStr) {
      case 'ROLE_ADMIN': return 'Administrateur';
      case 'ROLE_MEDECIN': return 'Médecin';
      case 'ROLE_SECRETAIRE': return 'Secrétaire';
      default: return roleStr;
    }
  };

  const getServiceLabel = (service) => {
    if (!service) return 'Non défini';
    
    if (typeof service === 'object' && service !== null) {
      if (service.nom) {
        service = service.nom;
      } else if (service.name) {
        service = service.name;
      } else {
        service = JSON.stringify(service);
      }
    }
    
    return String(service);
  };

  const footerContent = (
    <>
      <ModalButton onClick={handleClose}>Annuler</ModalButton>
              <ModalButton 
          $primary 
          onClick={handleCreateGroup}
          disabled={loading || !groupName.trim() || getSelectedUsersCount() === 0}
        >
        {loading ? 'Création...' : 'Créer le groupe'}
      </ModalButton>
    </>
  );

  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Créer un nouveau groupe"
      size="xl"
      footerContent={footerContent}
    >
      <FormContainer>
        <FormGroup>
          <Label htmlFor="groupName">Nom du groupe *</Label>
          <Input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Entrez le nom du groupe"
            maxLength={50}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="groupDescription">Description (optionnel)</Label>
          <Textarea
            id="groupDescription"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            placeholder="Décrivez le but de ce groupe..."
            maxLength={200}
          />
        </FormGroup>

        <FormGroup>
          <Label>Membres du groupe *</Label>
          <AddUsersButton onClick={() => setShowUserSelection(!showUserSelection)}>
            {showUserSelection ? '− Masquer la sélection' : '+ Ajouter des utilisateurs'} ({getSelectedUsersCount()})
          </AddUsersButton>
          
          {selectedUsers.length > 0 && (
            <>
              <SelectedUsersContainer>
                {selectedUsers.map((user) => (
                  <SelectedUserItem key={user.id}>
                    <UserInfo>
                      <UserAvatar 
                        src={user.photoUrl || imgprofilDefault} 
                        alt={`${user.prenom || ''} ${user.nom || ''}`}
                        onError={(e) => {
                          UserPhotoService.handleImageError(e, imgprofilDefault);
                        }}
                      />
                      <UserName>{String(user.prenom || '')} {String(user.nom || '')}</UserName>
                    </UserInfo>
                    <RemoveButton onClick={() => removeUser(user.id)}>
                      Retirer
                    </RemoveButton>
                  </SelectedUserItem>
                ))}
              </SelectedUsersContainer>
              
              {/* Avertissement si des doublons sont détectés */}
              {selectedUsers.length !== getSelectedUsersCount() && (
                <DuplicateWarning>
                  <WarningIcon>⚠️</WarningIcon>
                  Doublons détectés et supprimés automatiquement
                </DuplicateWarning>
              )}
            </>
          )}

          {/* Section de sélection d'utilisateurs intégrée */}
          {showUserSelection && (
            <UserSelectionSection>
              <SearchContainer>
                <SearchInput
                  type="text"
                  placeholder="Rechercher par nom, prénom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <FilterContainer>
                  <FilterSelect
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">Tous les rôles</option>
                    <option value="ROLE_ADMIN">Administrateur</option>
                    <option value="ROLE_MEDECIN">Médecin</option>
                    <option value="ROLE_SECRETAIRE">Secrétaire</option>
                  </FilterSelect>
                  
                  <FilterSelect
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                  >
                    <option value="all">Tous les services</option>
                    <option value="Cardiologie">Cardiologie</option>
                    <option value="Dermatologie">Dermatologie</option>
                    <option value="Généraliste">Généraliste</option>
                    <option value="Pédiatrie">Pédiatrie</option>
                    <option value="Radiologie">Radiologie</option>
                    <option value="Chirurgie">Chirurgie</option>
                  </FilterSelect>
                </FilterContainer>
              </SearchContainer>

              {usersLoading ? (
                <LoadingSpinner>Chargement des utilisateurs...</LoadingSpinner>
              ) : usersError ? (
                <ErrorContainer>{usersError}</ErrorContainer>
              ) : filteredUsers.length === 0 ? (
                <NoUsersMessage>Aucun utilisateur trouvé avec les critères sélectionnés</NoUsersMessage>
              ) : (
                <UserList>
                  {filteredUsers.map((user) => (
                                         <UserItem
                       key={user.id}
                       selected={isUserSelected(user.id)}
                       onClick={() => handleUserToggle(user)}
                     >
                      <UserAvatarSmall 
                        src={user.photoUrl || imgprofilDefault} 
                        alt={`${user.prenom || ''} ${user.nom || ''}`}
                        onError={(e) => {
                          UserPhotoService.handleImageError(e, imgprofilDefault);
                        }}
                      />
                      <UserInfoSmall>
                        <UserNameSmall>
                          {String(user.prenom || '')} {String(user.nom || '')}
                        </UserNameSmall>
                        <UserDetailsSmall>
                          <span>{String(user.email || '')}</span>
                          <UserRoleSmall>{getRoleLabel(user.role)}</UserRoleSmall>
                          {user.serviceMedical && (
                            <span>{getServiceLabel(user.serviceMedical)}</span>
                          )}
                        </UserDetailsSmall>
                      </UserInfoSmall>
                                             <Checkbox
                         type="checkbox"
                         checked={isUserSelected(user.id)}
                         onChange={() => handleUserToggle(user)}
                       />
                    </UserItem>
                  ))}
                </UserList>
              )}
            </UserSelectionSection>
          )}
        </FormGroup>

        {error && (
          <ErrorContainer>{error}</ErrorContainer>
        )}
      </FormContainer>
    </UnifiedModal>
  );
};

export default CreateGroupModal;
