import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config/apiConfig';
import axios from 'axios';
import styled from 'styled-components';

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
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const UserList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
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

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
`;

const UserDetails = styled.div`
  font-size: 12px;
  color: #666;
  display: flex;
  gap: 15px;
`;

const UserRole = styled.span`
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
`;

const Checkbox = styled.input`
  margin-left: 10px;
  transform: scale(1.2);
`;

const NoUsersMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
`;

const UserSelectionModal = ({ 
  isOpen, 
  onClose, 
  title, 
  onUsersSelected, 
  multipleSelection = false
}) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Récupération de tous les utilisateurs
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
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
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // Filtrage des utilisateurs
  useEffect(() => {
    let filtered = users;

    // Filtre par terme de recherche
    if (searchTerm.trim()) {
      filtered = filtered.filter(user => 
        user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par rôle
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtre par service médical (si disponible)
    if (serviceFilter && serviceFilter !== 'all') {
      filtered = filtered.filter(user => user.serviceMedical === serviceFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, serviceFilter]);

  const handleUserClick = (user) => {
    if (multipleSelection) {
      // Sélection multiple avec checkbox
      setSelectedUsers(prev => {
        const isSelected = prev.some(selected => selected.id === user.id);
        if (isSelected) {
          return prev.filter(selected => selected.id !== user.id);
        } else {
          return [...prev, user];
        }
      });
    } else {
      // Sélection unique - fermer directement avec le résultat
      if (onUsersSelected) {
        onUsersSelected([user]);
      }
    }
  };

  const handleConfirm = () => {
    if (onUsersSelected && selectedUsers.length > 0) {
      onUsersSelected(selectedUsers);
    }
  };

  const getRoleLabel = (role) => {
    // Si role est un objet, extraire la valeur appropriée
    if (typeof role === 'object' && role !== null) {
      if (role.roleType) {
        role = role.roleType;
      } else if (role.name) {
        role = role.name;
      } else {
        role = JSON.stringify(role);
      }
    }
    
    // Convertir en string si ce n'est pas déjà le cas
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
    
    // Si service est un objet, extraire la valeur appropriée
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

  if (!isOpen) return null;

  return (
    <div className="user-selection-content">
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Chargement des utilisateurs...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
          {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <NoUsersMessage>
          Aucun utilisateur trouvé avec les critères sélectionnés
        </NoUsersMessage>
      ) : (
        <UserList>
          {filteredUsers.map((user) => (
            <UserItem
              key={user.id}
              selected={selectedUsers.some(selected => selected.id === user.id)}
              onClick={() => handleUserClick(user)}
            >
              <UserAvatar 
                src={user.photoProfil ? `${API_BASE}/utilisateurs/${user.id}/photo` : '/default-avatar.png'} 
                alt={`${user.prenom} ${user.nom}`}
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
              <UserInfo>
                <UserName>
                  {String(user.prenom || '')} {String(user.nom || '')}
                </UserName>
                <UserDetails>
                  <span>{String(user.email || '')}</span>
                  <UserRole>{getRoleLabel(user.role)}</UserRole>
                  {user.serviceMedical && (
                    <span>{getServiceLabel(user.serviceMedical)}</span>
                  )}
                </UserDetails>
              </UserInfo>
              {multipleSelection && (
                <Checkbox
                  type="checkbox"
                  checked={selectedUsers.some(selected => selected.id === user.id)}
                  onChange={() => handleUserClick(user)}
                />
              )}
            </UserItem>
          ))}
        </UserList>
      )}
      
      {multipleSelection && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>Utilisateurs sélectionnés : {selectedUsers.length}</p>
        </div>
      )}
    </div>
  );
};

export default UserSelectionModal; 