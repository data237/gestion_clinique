# Composants Messagerie

## Vue d'ensemble

Ce document décrit les composants de messagerie créés pour les trois rôles de l'application : administrateur, secrétaire et médecin.

## Structure des composants

### 1. MessagerieAdmin
- **Fichier** : `src/composants/administrateur/messagerie.jsx`
- **Rôle** : Interface de messagerie pour les administrateurs
- **Fonctionnalités** :
  - Récupération du profil utilisateur
  - Gestion de la photo de profil
  - Interface de base avec squelette du dashboard

### 2. MessagerieSecretaire
- **Fichier** : `src/composants/secretaire/messagerie.jsx`
- **Rôle** : Interface de messagerie pour les secrétaires
- **Fonctionnalités** :
  - Récupération du profil utilisateur
  - Gestion de la photo de profil
  - Interface de base avec squelette du dashboard

### 3. MessagerieMedecin
- **Fichier** : `src/composants/medecin/messagerie.jsx`
- **Rôle** : Interface de messagerie pour les médecins
- **Fonctionnalités** :
  - Récupération du profil utilisateur
  - Gestion de la photo de profil
  - Interface de base avec squelette du dashboard

## Caractéristiques communes

Tous les composants partagent les mêmes caractéristiques :

### Structure
- **Header** : Barre horizontale avec titre "Messagerie" et profil utilisateur
- **Container principal** : Utilise la classe `zonedaffichage-dashboad` du dashboard
- **Titre de section** : Titre spécifique au rôle
- **Barre de séparation** : Divider visuel
- **Zone de contenu** : Espace réservé pour l'implémentation future

### Fonctionnalités
- **Authentification** : Récupération automatique du profil utilisateur connecté
- **Gestion des images** : Récupération et affichage de la photo de profil
- **Gestion des blobs** : Nettoyage automatique des ressources mémoire
- **État de chargement** : Affichage d'un indicateur de chargement

### Styles utilisés
- `Zonedaffichage.css` : Styles de base pour la zone d'affichage
- `dashboard.css` : Styles du dashboard (pour la cohérence visuelle)

## Utilisation

### Import
```javascript
import { MessagerieAdmin, MessagerieSecretaire, MessagerieMedecin } from '../composants/messagerie';
```

### Intégration dans les routes
```javascript
// Exemple pour l'administrateur
<Route path="/admin/messagerie" element={<MessagerieAdmin />} />

// Exemple pour la secrétaire
<Route path="/secretaire/messagerie" element={<MessagerieSecretaire />} />

// Exemple pour le médecin
<Route path="/medecin/messagerie" element={<MessagerieMedecin />} />
```

### Navigation dans la barre latérale
L'onglet messagerie est maintenant disponible dans la barre latérale de chaque rôle avec l'icône enveloppe :
- **Administrateur** : `/admin/messagerie`
- **Secrétaire** : `/secretaire/messagerie`
- **Médecin** : `/medecin/messagerie`

## Développement futur

Ces composants sont conçus comme des squelettes de base. Pour les rendre fonctionnels, il faudra implémenter :

1. **Interface de conversation** : Liste des conversations, messages
2. **Envoi de messages** : Formulaire de saisie et envoi
3. **Gestion des contacts** : Liste des utilisateurs avec qui communiquer
4. **Notifications** : Système de notifications en temps réel
5. **Stockage** : Persistance des messages et conversations
6. **Sécurité** : Chiffrement et authentification des messages

## Dépendances

- `axios` : Pour les appels API
- `react` : Framework principal
- `Barrehorizontal1` : Composant de navigation
- `apiconfig` : Configuration des endpoints API
- Styles CSS : `Zonedaffichage.css` et `dashboard.css`

## Notes techniques

- Les composants utilisent le même pattern de gestion d'état que le dashboard
- La gestion des blobs est implémentée pour éviter les fuites mémoire
- Les composants sont prêts pour l'intégration dans le système de routage existant
- L'architecture suit le pattern établi dans l'application 