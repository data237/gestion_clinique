// Configuration des endpoints API
export const API_BASE = 'http://localhost:2025/Api/V1/clinique';

// Endpoints de messagerie
export const MESSAGING_ENDPOINTS = {
    // WebSocket endpoints - SockJS a besoin d'URLs HTTP/HTTPS, pas WS
    WS_BASE: 'http://localhost:2025/ws',
    
    // REST endpoints
    GROUPS: '/messagerie/groupes',
    MESSAGE_BY_ID: (id) => `/messagerie/chat.${id}`,
    
    // Endpoints à implémenter côté backend
    CONVERSATIONS: (userId) => `/messagerie/conversations/${userId}`,
    CONVERSATION_HISTORY: (userId1, userId2) => `/messagerie/conversations/${userId1}/${userId2}`,
    MARK_AS_READ: (messageId) => `/messagerie/messages/${messageId}/read`,
    UNREAD_MESSAGES: (userId) => `/messagerie/messages/unread/${userId}`,
    SEARCH_MESSAGES: '/messagerie/messages/search',
    MESSAGING_STATS: (userId) => `/messagerie/statistics/${userId}`,
};

// Endpoints utilisateurs
export const USER_ENDPOINTS = {
    ALL_USERS: '/utilisateurs',
    USER_BY_ID: (id) => `/utilisateurs/${id}`,
    USER_PHOTO: (id) => `/utilisateurs/${id}/photo`,
    USER_BY_ROLE: (role) => `/utilisateurs/role/${role}`,
    SEARCH_USERS: '/utilisateurs/search',
    CONNECTED_USERS: '/utilisateurs/connected',
    DISCONNECTED_USERS: '/utilisateurs/disconnected',
};

// Configuration WebSocket
export const WEBSOCKET_CONFIG = {
    ENDPOINTS: {
        SEND_MESSAGE: '/app/chat.sendMessage',
        UPDATE_MESSAGE: '/app/chat.updateMessage',
        DELETE_MESSAGE: '/app/chat.deleteMessage',
    },
    TOPICS: {
        USER_QUEUE: (userId) => `/queue/user.${userId}`,
        GROUP_TOPIC: (groupId) => `/topic/group.${groupId}`,
    },
    // Configuration de connexion
    CONNECTION: {
        TIMEOUT: 10000, // 10 secondes
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 2000, // 2 secondes
    }
};

// Configuration des headers par défaut
export const getDefaultHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Configuration des paramètres de pagination
export const PAGINATION_CONFIG = {
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 100,
    DEFAULT_OFFSET: 0,
};

// Configuration des timeouts
export const TIMEOUT_CONFIG = {
    REQUEST_TIMEOUT: 30000, // 30 secondes
    WEBSOCKET_RECONNECT_DELAY: 5000, // 5 secondes
    TYPING_INDICATOR_DELAY: 1000, // 1 seconde
};

export default {
    API_BASE,
    MESSAGING_ENDPOINTS,
    USER_ENDPOINTS,
    WEBSOCKET_CONFIG,
    getDefaultHeaders,
    PAGINATION_CONFIG,
    TIMEOUT_CONFIG,
}; 