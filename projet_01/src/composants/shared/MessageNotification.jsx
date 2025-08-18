import React from 'react';

const MessageNotification = ({ notification, onClose, onClick }) => {
    if (!notification) return null;
    
    return (
        <div className="message-notification" style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#4CAF50',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            cursor: 'pointer',
            maxWidth: '300px',
            animation: 'slideIn 0.3s ease-out'
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                Nouveau message de {notification.sender?.prenom || 'Quelqu\'un'}
            </div>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                {notification.content}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                    onClick={onClick}
                    style={{
                        background: 'white',
                        color: '#4CAF50',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    Voir
                </button>
                <button 
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        color: 'white',
                        border: '1px solid white',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    Fermer
                </button>
            </div>
        </div>
    );
};

export default MessageNotification;
