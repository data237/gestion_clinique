import React, { useState } from 'react';
import { UnifiedModal, ModalButton } from '../shared/UnifiedModal';
import { API_BASE } from '../config/apiConfig';
import axios from 'axios';
import styled from 'styled-components';

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
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
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
  box-sizing: border-box; /* Inclure padding et border dans la largeur */
  
  &:focus {
    outline: none; /* Supprimer l'outline par défaut */
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); /* Focus visible sans débordement */
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  box-sizing: border-box; /* Inclure padding et border dans la largeur */
  
  &:focus {
    outline: none; /* Supprimer l'outline par défaut */
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1); /* Focus visible sans débordement */
  }
`;

const UserList = styled.div`
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  ${props => props.selected && `
    background-color: #e3f2fd;
    border-left: 3px solid #2196f3;
  `}
`;

const UserAvatarSmall = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
`;

const UserInfoSmall = styled.div`
  flex: 1;
`;

const UserNameSmall = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
  font-size: 14px;
`;

const UserDetailsSmall = styled.div`
  font-size: 11px;
  color: #666;
  display: flex;
  gap: 15px;
`;

const UserRoleSmall = styled.span`
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
`;

const Checkbox = styled.input`
  margin-left: 10px;
  transform: scale(1.2);
`;

const AddUsersButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  white-space: nowrap; /* Empêcher le débordement de texte */
  overflow: hidden; /* Empêcher le débordement */
  text-overflow: ellipsis; /* Ajouter des points de suspension si nécessaire */
  box-sizing: border-box; /* Inclure padding et border dans la largeur */
  
  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:focus {
    outline: none; /* Supprimer l'outline par défaut */
    background: #5a6fd8;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3); /* Focus visible sans débordement */
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }
`;

const NoUsersMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
  background: white;
  border-radius: 4px;
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
      const response = await axios.get(`${API_BASE}/utilisateurs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      setUsersError('Erreur lors du chargement des utilisateurs');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Le nom du groupe est requis');
      return;
    }

    if (selectedUsers.length === 0) {
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
    const isAlreadySelected = selectedUsers.some(selected => selected.id === user.id);
    
    if (isAlreadySelected) {
      setSelectedUsers(prev => prev.filter(selected => selected.id !== user.id));
    } else {
      setSelectedUsers(prev => [...prev, user]);
    }
  };

  const removeUser = (userId) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };

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
        disabled={loading || !groupName.trim() || selectedUsers.length === 0}
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
            {showUserSelection ? '− Masquer la sélection' : '+ Ajouter des utilisateurs'} ({selectedUsers.length})
          </AddUsersButton>
          
          {selectedUsers.length > 0 && (
            <SelectedUsersContainer>
              {selectedUsers.map((user) => (
                <SelectedUserItem key={user.id}>
                  <UserInfo>
                    <UserAvatar 
                      src={user.photoProfil ? `${API_BASE}/utilisateurs/${user.id}/photo` : '/default-avatar.png'} 
                      alt={`${user.prenom} ${user.nom}`}
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
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
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  Chargement des utilisateurs...
                </div>
              ) : usersError ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#dc3545' }}>
                  {usersError}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontStyle: 'italic' }}>
                  Aucun utilisateur trouvé avec les critères sélectionnés
                </div>
              ) : (
                <UserList>
                  {filteredUsers.map((user) => (
                    <UserItem
                      key={user.id}
                      selected={selectedUsers.some(selected => selected.id === user.id)}
                      onClick={() => handleUserToggle(user)}
                    >
                      <UserAvatarSmall 
                        src={user.photoProfil ? `${API_BASE}/utilisateurs/${user.id}/photo` : '/default-avatar.png'} 
                        alt={`${user.prenom} ${user.nom}`}
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
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
                        checked={selectedUsers.some(selected => selected.id === user.id)}
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
          <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}
      </FormContainer>
    </UnifiedModal>
  );
};

export default CreateGroupModal;