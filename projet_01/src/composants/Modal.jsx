import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
`;

const ModalContent = styled.div`
  margin-bottom: 24px;
  text-align: center;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: #666;
  border: 1px solid #ddd;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: ${props => props.variant === 'danger' ? '#dc3545' : '#6c5ce7'};
  color: white;
  
  &:hover {
    background-color: ${props => props.variant === 'danger' ? '#c82333' : '#5a4fcf'};
  }
`;

const SuccessButton = styled(Button)`
  background-color: #28a745;
  color: white;
  
  &:hover {
    background-color: #218838;
  }
`;

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  onConfirm, 
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "default",
  showCancel = true 
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getConfirmButton = () => {
    switch (variant) {
      case 'danger':
        return <ConfirmButton variant="danger" onClick={onConfirm}>{confirmText}</ConfirmButton>;
      case 'success':
        return <SuccessButton onClick={onConfirm}>{confirmText}</SuccessButton>;
      default:
        return <ConfirmButton onClick={onConfirm}>{confirmText}</ConfirmButton>;
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        {title && <ModalTitle>{title}</ModalTitle>}
        <ModalContent>{content}</ModalContent>
        <ModalButtons>
          {showCancel && (
            <CancelButton onClick={onClose}>
              {cancelText}
            </CancelButton>
          )}
          {getConfirmButton()}
        </ModalButtons>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal; 