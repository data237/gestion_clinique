// src/services/messagingService.js
import SockJS from "sockjs-client";
import { Client as StompClient } from "@stomp/stompjs";
import { API_BASE } from "../composants/config/apiconfig";

let stompClient = null;

export const connectWebSocket = (userId, onMessageReceived, onConnected) => {
  console.log("🔌 Tentative de connexion WebSocket pour l'utilisateur:", userId);
  
  stompClient = new StompClient({
    webSocketFactory: () => new SockJS(`${API_BASE}/ws`),
    onConnect: () => {
      console.log("✅ Connecté au WebSocket");
 
      // File privée (messages individuels)
      const subscription = stompClient.subscribe(`/queue/user.${userId}`, (message) => {
        console.log("📨 Message reçu sur la queue:", message);
        try {
          const body = JSON.parse(message.body);
          console.log(" Contenu du message parsé:", body);
          onMessageReceived(body);
        } catch (error) {
          console.error("❌ Erreur lors du parsing du message:", error);
        }
      });
      
      console.log("📡 Abonnement créé pour la queue:", `/queue/user.${userId}`);
 
      // Groupes (si utilisateur est membre)
      // Tu pourras souscrire dynamiquement aux groupes
      if (onConnected) onConnected();
    },
    onDisconnect: () => {
      console.log("🔌 Déconnecté du WebSocket");
    },
    onStompError: (frame) => {
      console.error("❌ Erreur STOMP:", frame);
    },
    onWebSocketError: (error) => {
      console.error("❌ Erreur WebSocket:", error);
    }
  });
  
  stompClient.activate();
  console.log("🚀 Activation du client STOMP");
};

export const sendMessage = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message)
    });
  }
};

export const updateMessage = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.updateMessage",
      body: JSON.stringify(message)
    });
  }
};

export const deleteMessage = (messageId) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.deleteMessage",
      body: JSON.stringify(messageId)
    });
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log("🔌 Déconnecté du WebSocket");
  }
};
