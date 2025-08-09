import React, { createContext, useContext, useState } from 'react';
import Modal from './Modal';

const ConfirmationContext = createContext();

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};

export const ConfirmationProvider = ({ children }) => {
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: '',
    content: '',
    onConfirm: null,
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    variant: 'default'
  });

  const showConfirmation = ({
    title,
    content,
    onConfirm,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    variant = 'default'
  }) => {
    setConfirmation({
      isOpen: true,
      title,
      content,
      onConfirm,
      confirmText,
      cancelText,
      variant
    });
  };

  const hideConfirmation = () => {
    setConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    if (confirmation.onConfirm) {
      confirmation.onConfirm();
    }
    hideConfirmation();
  };

  const value = {
    showConfirmation
  };

  return (
    <ConfirmationContext.Provider value={value}>
      {children}
      <Modal
        isOpen={confirmation.isOpen}
        onClose={hideConfirmation}
        title={confirmation.title}
        content={confirmation.content}
        onConfirm={handleConfirm}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        variant={confirmation.variant}
      />
    </ConfirmationContext.Provider>
  );
}; 