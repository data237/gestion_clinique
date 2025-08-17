import React, { useState, useEffect } from 'react';
import { UnifiedModal, ModalButton } from '../shared/UnifiedModal';
import { API_BASE } from '../config/apiConfig';
import axios from 'axios';
import styled from 'styled-components';
import imgprofilDefault from '../../assets/photoDoc.png';

// Styles pour le modal de nouveau message
const ModalContent = styled.div`
  padding: 20px;
`;

const ModalDescription = styled.div`
  margin-bottom: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

const UserList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
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
  border: 2px solid #e1e5e9;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  font-size: 14px;
`;

const UserDetails = styled.div`
  font-size: 12px;
  color: #666;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const UserRole = styled.span`
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #dc3545;
`;

const NoUsersMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
`;

const NewMessageModal = ({ isOpen, onClose, onMessageSent }) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [serviceFilter, setServiceFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    // Charger les utilisateurs quand le modal s'ouvre
    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    // Filtrer les utilisateurs
    useEffect(() => {
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

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleConfirm = () => {
        if (selectedUser) {
            onMessageSent({
                recipients: [selectedUser],
                action: 'start_conversation'
            });
            onClose();
        }
    };

    const handleClose = () => {
        setSelectedUser(null);
        setSearchTerm('');
        setRoleFilter('');
        setServiceFilter('');
        setError(null);
        onClose();
    };

    const getRoleLabel = (role) => {
        if (typeof role === 'object' && role !== null) {
            if (role.roleType) return role.roleType;
            if (role.name) return role.name;
            return JSON.stringify(role);
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
            if (service.nom) return service.nom;
            if (service.name) return service.name;
            return JSON.stringify(service);
        }
        
        return String(service);
    };

    const footerContent = (
        <>
            <ModalButton onClick={handleClose}>
                Annuler
            </ModalButton>
            <ModalButton 
                $primary 
                onClick={handleConfirm}
                disabled={!selectedUser}
            >
                Démarrer la conversation
            </ModalButton>
        </>
    );

    return (
        <UnifiedModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Nouveau message"
            size="large"
            footerContent={footerContent}
        >
            <ModalContent>
                <ModalDescription>
                    <p>Sélectionnez l'utilisateur avec qui vous souhaitez démarrer une conversation :</p>
                </ModalDescription>
                
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

                {loading ? (
                    <LoadingMessage>
                        Chargement des utilisateurs...
                    </LoadingMessage>
                ) : error ? (
                    <ErrorMessage>
                        {error}
                    </ErrorMessage>
                ) : filteredUsers.length === 0 ? (
                    <NoUsersMessage>
                        Aucun utilisateur trouvé avec les critères sélectionnés
                    </NoUsersMessage>
                ) : (
                    <UserList>
                        {filteredUsers.map((user) => (
                            <UserItem
                                key={user.id}
                                selected={selectedUser?.id === user.id}
                                onClick={() => handleUserClick(user)}
                            >
                                <UserAvatar 
                                    src={user.photoProfil ? `${API_BASE}/utilisateurs/${user.id}/photo` : imgprofilDefault} 
                                    alt={`${user.prenom} ${user.nom}`}
                                    onError={(e) => {
                                        e.target.src = imgprofilDefault;
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
                            </UserItem>
                        ))}
                    </UserList>
                )}
            </ModalContent>
        </UnifiedModal>
    );
};

export default NewMessageModal; 
