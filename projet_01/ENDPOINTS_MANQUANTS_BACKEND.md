# Endpoints Backend Manquants pour la Messagerie Complète

## 📋 **Analyse des Endpoints Existants vs Manquants**

### ✅ **Endpoints Déjà Implémentés (Backend)**

#### **1. Gestion des Messages (WebSocket)**
- `POST /app/chat.sendMessage` - Envoi de messages individuels et de groupe
- `POST /app/chat.updateMessage` - Modification de messages
- `POST /app/chat.deleteMessage` - Suppression de messages

#### **2. Gestion des Groupes**
- `POST /Api/V1/clinique/messagerie/groupes` - Création de groupes

#### **3. Récupération de Messages**
- `GET /Api/V1/clinique/messagerie/chat.{id}` - Récupération d'un message par ID

### ❌ **Endpoints Manquants (À Implémenter)**

#### **1. Historique des Conversations**
```java
@GetMapping("/conversations/{userId1}/{userId2}")
public ResponseEntity<List<MessageResponseDto>> getConversationHistory(
    @PathVariable Long userId1,
    @PathVariable Long userId2,
    @RequestParam(defaultValue = "50") int limit,
    @RequestParam(defaultValue = "0") int offset
) {
    // Récupérer l'historique des messages entre deux utilisateurs
    // Avec pagination et tri par date
}
```

#### **2. Conversations de l'Utilisateur**
```java
@GetMapping("/conversations/{userId}")
public ResponseEntity<List<ConversationSummaryDto>> getUserConversations(
    @PathVariable Long userId
) {
    // Récupérer la liste des conversations de l'utilisateur
    // Avec le dernier message et le nombre de messages non lus
}
```

#### **3. Marquer les Messages comme Lus**
```java
@PatchMapping("/messages/{messageId}/read")
public ResponseEntity<MessageResponseDto> markMessageAsRead(
    @PathVariable Long messageId
) {
    // Marquer un message comme lu
    // Mettre à jour le statut et notifier via WebSocket
}
```

#### **4. Messages Non Lus**
```java
@GetMapping("/messages/unread/{userId}")
public ResponseEntity<List<MessageResponseDto>> getUnreadMessages(
    @PathVariable Long userId
) {
    // Récupérer tous les messages non lus de l'utilisateur
}
```

#### **5. Statistiques de Messagerie**
```java
@GetMapping("/statistics/{userId}")
public ResponseEntity<MessagingStatisticsDto> getMessagingStatistics(
    @PathVariable Long userId
) {
    // Récupérer les statistiques de messagerie
    // Nombre total de messages, conversations, etc.
}
```

#### **6. Recherche de Messages**
```java
@GetMapping("/messages/search")
public ResponseEntity<List<MessageResponseDto>> searchMessages(
    @RequestParam String query,
    @RequestParam Long userId,
    @RequestParam(defaultValue = "50") int limit
) {
    // Rechercher des messages par contenu
    // Pour l'utilisateur spécifié
}
```

## 🔧 **Implémentation Recommandée**

### **1. Service Layer (MessageService)**
```java
@Service
public class MessageServiceImpl implements MessageService {
    
    // Méthodes existantes...
    
    // Nouvelles méthodes à implémenter
    public List<Message> getConversationHistory(Long userId1, Long userId2, int limit, int offset);
    public List<ConversationSummary> getUserConversations(Long userId);
    public Message markMessageAsRead(Long messageId);
    public List<Message> getUnreadMessages(Long userId);
    public MessagingStatistics getMessagingStatistics(Long userId);
    public List<Message> searchMessages(String query, Long userId, int limit);
}
```

### **2. Repository Layer**
```java
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    // Requêtes existantes...
    
    // Nouvelles requêtes à implémenter
    @Query("SELECT m FROM Message m WHERE " +
           "(m.expediteur.id = :userId1 AND m.destinataire.id = :userId2) OR " +
           "(m.expediteur.id = :userId2 AND m.destinataire.id = :userId1) " +
           "ORDER BY m.timestamp DESC")
    Page<Message> findConversationHistory(
        @Param("userId1") Long userId1, 
        @Param("userId2") Long userId2, 
        Pageable pageable
    );
    
    @Query("SELECT DISTINCT m FROM Message m WHERE " +
           "m.destinataire.id = :userId AND m.lu = false " +
           "ORDER BY m.timestamp DESC")
    List<Message> findUnreadMessages(@Param("userId") Long userId);
    
    @Query("SELECT m FROM Message m WHERE " +
           "m.destinataire.id = :userId AND " +
           "LOWER(m.contenu) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY m.timestamp DESC")
    List<Message> searchMessages(@Param("userId") Long userId, @Param("query") String query);
}
```

### **3. DTOs Supplémentaires**
```java
// Résumé de conversation
public class ConversationSummaryDto {
    private Long otherUserId;
    private String otherUserName;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private int unreadCount;
    private String lastSenderName;
}

// Statistiques de messagerie
public class MessagingStatisticsDto {
    private int totalMessages;
    private int totalConversations;
    private int unreadMessages;
    private LocalDateTime lastActivity;
    private Map<String, Integer> messagesByType; // individuel, groupe
}

// Résumé de message pour les conversations
public class MessageSummaryDto {
    private Long id;
    private String contenu;
    private LocalDateTime timestamp;
    private String expediteurName;
    private boolean lu;
}
```

## 🚀 **Priorités d'Implémentation**

### **Phase 1 (Critique)**
1. **Historique des conversations** - Essentiel pour l'expérience utilisateur
2. **Marquage des messages comme lus** - Fonctionnalité de base

### **Phase 2 (Important)**
3. **Conversations de l'utilisateur** - Liste des contacts avec conversations
4. **Messages non lus** - Notifications et indicateurs

### **Phase 3 (Optionnel)**
5. **Statistiques de messagerie** - Analytics et insights
6. **Recherche de messages** - Fonctionnalité avancée

## 📱 **Intégration Frontend**

### **1. Service de Messagerie**
```javascript
// Récupérer l'historique des conversations
async getConversationHistory(userId1, userId2, limit = 50, offset = 0) {
    const response = await axios.get(
        `${API_BASE}/messagerie/conversations/${userId1}/${userId2}`,
        { params: { limit, offset } }
    );
    return response.data;
}

// Récupérer les conversations de l'utilisateur
async getUserConversations(userId) {
    const response = await axios.get(
        `${API_BASE}/messagerie/conversations/${userId}`
    );
    return response.data;
}
```

### **2. Composant de Chat**
```javascript
// Charger l'historique des messages
useEffect(() => {
    if (selectedContact) {
        loadConversationHistory();
    }
}, [selectedContact]);

const loadConversationHistory = async () => {
    const userId = localStorage.getItem('idUser');
    const history = await messagingService.getConversationHistory(
        userId, 
        selectedContact.id
    );
    setMessages(history);
};
```

## 🔒 **Sécurité et Validation**

### **1. Vérifications d'Autorisation**
```java
// Vérifier que l'utilisateur peut accéder à la conversation
@PreAuthorize("hasRole('USER') and " +
              "(@userId == authentication.principal.id or " +
              "@otherUserId == authentication.principal.id)")
public List<Message> getConversationHistory(Long userId, Long otherUserId) {
    // Logique métier
}
```

### **2. Validation des Données**
```java
// Validation des paramètres de pagination
@GetMapping("/conversations/{userId1}/{userId2}")
public ResponseEntity<List<MessageResponseDto>> getConversationHistory(
    @PathVariable Long userId1,
    @PathVariable Long userId2,
    @RequestParam(defaultValue = "50") @Min(1) @Max(100) int limit,
    @RequestParam(defaultValue = "0") @Min(0) int offset
) {
    // Logique métier
}
```

## 📊 **Tests Recommandés**

### **1. Tests Unitaires**
- Service de messagerie
- Repository queries
- Validation des DTOs

### **2. Tests d'Intégration**
- Endpoints REST
- WebSocket messages
- Gestion des erreurs

### **3. Tests de Performance**
- Pagination des conversations
- Recherche de messages
- Gestion de la mémoire

## 🎯 **Conclusion**

L'implémentation de ces endpoints manquants permettra d'avoir une messagerie complète et professionnelle avec :

- ✅ **Historique complet** des conversations
- ✅ **Gestion des messages non lus**
- ✅ **Interface utilisateur riche** et responsive
- ✅ **Performance optimisée** avec pagination
- ✅ **Sécurité renforcée** et validation des données

Une fois ces endpoints implémentés, le frontend pourra offrir une expérience de messagerie comparable aux applications modernes comme WhatsApp ou Slack. 