import React, { useState } from 'react';
import { UnifiedModal, ModalButton } from '../shared/UnifiedModal';
import UserSelectionModal from './UserSelectionModal';

const NewMessageModal = ({ isOpen, onClose, onMessageSent }) => {
    const [recipients, setRecipients] = useState([]);
    const [showUserSelection, setShowUserSelection] = useState(false);

    const handleUserSelected = (selectedUsers) => {
        setRecipients(selectedUsers);
        // Si c'est une sélection unique, fermer automatiquement
        if (selectedUsers.length === 1) {
            handleConfirm(selectedUsers);
        }
    };

    const handleConfirm = (users = recipients) => {
        if (users.length > 0) {
            // Just pass the selected recipients to start a conversation
            // The actual message will be written in the main chat area
            onMessageSent({
                recipients: users,
                action: 'start_conversation'
            });
            onClose();
        }
    };

    const footerContent = (
        <>
            <ModalButton onClick={onClose}>
                Annuler
            </ModalButton>
            <ModalButton 
                $primary 
                onClick={() => handleConfirm()}
                disabled={recipients.length === 0}
            >
                Démarrer la conversation ({recipients.length})
            </ModalButton>
        </>
    );

    return (
        <UnifiedModal
            isOpen={isOpen}
            onClose={onClose}
            title="Nouveau message"
            size="large"
            footerContent={footerContent}
        >
            <div className="new-message-modal">
                <div className="modal-description">
                    <p>Sélectionnez l'utilisateur avec qui vous souhaitez démarrer une conversation :</p>
                </div>
                
                <UserSelectionModal
                    isOpen={true}
                    onClose={() => {}}
                    onUsersSelected={handleUserSelected}
                    multipleSelection={false}
                    title="Sélectionner un destinataire"
                />
            </div>
        </UnifiedModal>
    );
};

export default NewMessageModal; 