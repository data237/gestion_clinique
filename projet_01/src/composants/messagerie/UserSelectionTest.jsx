import React, { useState } from 'react';
import UserSelectionModal from './UserSelectionModal';
import styled from 'styled-components';

const TestContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const TestButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
  
  &:hover {
    background: #0056b3;
  }
`;

const SelectedUsersList = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  margin: 5px 0;
  background: white;
  border-radius: 4px;
  border: 1px solid #e9ecef;
`;

const UserAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
`;

const UserSelectionTest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleUsersSelected = (users) => {
    console.log('Utilisateurs sélectionnés:', users);
    setSelectedUsers(users);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <TestContainer>
      <h2>Test de Sélection d'Utilisateurs</h2>
      
      <TestButton onClick={handleOpenModal}>
        Ouvrir la Sélection d'Utilisateurs
      </TestButton>

      {selectedUsers.length > 0 && (
        <SelectedUsersList>
          <h3>Utilisateurs Sélectionnés ({selectedUsers.length})</h3>
          {selectedUsers.map((user) => (
            <UserItem key={user.id}>
              <UserAvatar 
                src={user.photoUrl || '/default-avatar.png'} 
                alt={`${user.prenom || ''} ${user.nom || ''}`}
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
              <div>
                <strong>{user.prenom || ''} {user.nom || ''}</strong>
                <br />
                <small>{user.email || ''}</small>
                <br />
                <small>Rôle: {user.role?.roleType || user.role || 'Non défini'}</small>
              </div>
            </UserItem>
          ))}
        </SelectedUsersList>
      )}

      <UserSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUsersSelected={handleUsersSelected}
        multipleSelection={true}
        title="Sélectionner des Utilisateurs"
      />
    </TestContainer>
  );
};

export default UserSelectionTest;
