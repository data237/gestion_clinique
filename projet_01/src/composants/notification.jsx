import { useState, useEffect } from 'react';
import styled from 'styled-components';

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
`;

const NotificationItem = styled.div`
  background-color: ${props => {
    switch (props.type) {
      case 'success':
        return '#d4edda';
      case 'error':
        return '#f8d7da';
      case 'warning':
        return '#fff3cd';
      case 'info':
        return '#d1ecf1';
      default:
        return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success':
        return '#155724';
      case 'error':
        return '#721c24';
      case 'warning':
        return '#856404';
      case 'info':
        return '#0c5460';
      default:
        return '#383d41';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success':
        return '#c3e6cb';
      case 'error':
        return '#f5c6cb';
      case 'warning':
        return '#ffeaa7';
      case 'info':
        return '#bee5eb';
      default:
        return '#d6d8db';
    }
  }};
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideIn 0.3s ease-out;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: inherit;
  padding: 0;
  margin-left: 16px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const NotificationIcon = styled.span`
  margin-right: 12px;
  font-size: 16px;
`;

const Notification = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  if (!isVisible) return null;

  return (
    <NotificationItem type={type}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <NotificationIcon>{getIcon()}</NotificationIcon>
        <span>{message}</span>
      </div>
      <CloseButton onClick={handleClose}>&times;</CloseButton>
    </NotificationItem>
  );
};

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Exposer la fonction globalement
  useEffect(() => {
    window.showNotification = addNotification;
    return () => {
      delete window.showNotification;
    };
  }, []);

  return (
    <>
      {children}
      <NotificationContainer>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </NotificationContainer>
    </>
  );
};

export { Notification, NotificationProvider };
export default NotificationProvider; 