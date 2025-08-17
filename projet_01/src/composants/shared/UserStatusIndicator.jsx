import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import userStatusService from '../../services/userStatusService';

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${props => props.size === 'small' ? '12px' : props.size === 'medium' ? '14px' : '16px'};
`;

const StatusDot = styled.div`
  width: ${props => props.size === 'small' ? '8px' : props.size === 'medium' ? '10px' : '12px'};
  height: ${props => props.size === 'small' ? '8px' : props.size === 'medium' ? '10px' : '12px'};
  border-radius: 50%;
  background-color: ${props => props.isOnline ? '#4CAF50' : '#9E9E9E'};
  border: 2px solid white;
  box-shadow: 0 0 0 1px ${props => props.isOnline ? '#4CAF50' : '#9E9E9E'};
  animation: ${props => props.isOnline ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
    }
  }
`;

const StatusText = styled.span`
  color: ${props => props.isOnline ? '#4CAF50' : '#9E9E9E'};
  font-weight: ${props => props.isOnline ? '600' : '400'};
  white-space: nowrap;
`;

const LastSeenText = styled.span`
  color: #666;
  font-size: ${props => props.size === 'small' ? '10px' : '12px'};
  font-style: italic;
  margin-left: 4px;
`;

const UserStatusIndicator = ({ 
  userId, 
  showText = true, 
  showLastSeen = false, 
  size = 'medium',
  className = ''
}) => {
  const [status, setStatus] = useState(null);
  const [formattedStatus, setFormattedStatus] = useState({
    text: 'Hors ligne',
    isOnline: false,
    lastSeen: null,
    lastSeenText: null
  });

  useEffect(() => {
    if (!userId) return;

    // Obtenir le statut initial
    const initialStatus = userStatusService.getUserStatus(userId);
    setStatus(initialStatus);
    setFormattedStatus(userStatusService.formatStatusForDisplay(initialStatus));

    // S'abonner aux mises à jour de statut
    const callbackId = `status-${userId}-${Date.now()}`;
    userStatusService.subscribeToStatusUpdates(callbackId, (allStatuses) => {
      const userStatus = allStatuses.get(userId);
      if (userStatus) {
        setStatus(userStatus);
        setFormattedStatus(userStatusService.formatStatusForDisplay(userStatus));
      }
    });

    // Nettoyer l'abonnement
    return () => {
      userStatusService.unsubscribeFromStatusUpdates(callbackId);
    };
  }, [userId]);

  // Initialiser le service si ce n'est pas déjà fait
  useEffect(() => {
    if (!userStatusService.isInitialized) {
      userStatusService.initialize();
    }
  }, []);

  if (!userId) {
    return null;
  }

  return (
    <StatusContainer size={size} className={className}>
      <StatusDot 
        isOnline={formattedStatus.isOnline} 
        size={size}
        title={formattedStatus.text}
      />
      
      {showText && (
        <StatusText isOnline={formattedStatus.isOnline}>
          {formattedStatus.text}
        </StatusText>
      )}
      
      {showLastSeen && formattedStatus.lastSeenText && (
        <LastSeenText size={size}>
          ({formattedStatus.lastSeenText})
        </LastSeenText>
      )}
    </StatusContainer>
  );
};

export default UserStatusIndicator;
