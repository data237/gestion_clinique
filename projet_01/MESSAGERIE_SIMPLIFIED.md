# Messagerie Simplifiée - Gestion Clinique

## Vue d'ensemble

La messagerie utilise uniquement les API nécessaires sans données de test ni composants superflus.

## API Utilisées

### 1. Utilisateurs
- **Endpoint** : `/Api/V1/clinique/utilisateurs`
- **Fonction** : Récupération de tous les utilisateurs pour les contacts et la création de groupes
- **Méthode** : GET

### 2. Groupes (préparé pour l'avenir)
- **Endpoint** : `/Api/V1/clinique/messagerie/groupes`
- **Fonction** : Création et gestion des groupes de discussion
- **Méthode** : POST

### 3. Messages (préparé pour l'avenir)
- **Endpoint** : `/Api/V1/clinique/messagerie`
- **Fonction** : Envoi et réception de messages
- **Méthode** : WebSocket + REST

## Fonctionnalités

- **Contacts** : Liste des utilisateurs depuis l'API
- **Groupes** : Création de nouveaux groupes
- **Messages** : Envoi de messages individuels et de groupe
- **Gestion d'erreur** : Message simple en cas de problème

## Utilisation

1. **Accès** : Menu latéral → Messagerie
2. **Contacts** : Onglet "Contacts" pour voir tous les utilisateurs
3. **Groupes** : Onglet "Groupes" pour créer des groupes
4. **Chat** : Sélectionnez un contact ou groupe pour discuter

## Gestion des Erreurs

- **Erreur de chargement** : Message simple "❌ Erreur lors du chargement des données"
- **Pas de fallback** : Aucune donnée par défaut en cas d'erreur
- **Logs console** : Détails des erreurs dans la console du navigateur

## Structure

```
src/composants/
├── shared/
│   └── Messagerie.jsx          # Composant principal
├── administrateur/
│   └── messagerie.jsx          # Page admin
├── medecin/
│   └── messagerie.jsx          # Page médecin
├── secretaire/
│   └── messagerie.jsx          # Page secrétaire
└── config/
    └── messagerieApi.jsx       # Services API
```

## Routes

- **Admin** : `/admin/messagerie`
- **Médecin** : `/medecin/messagerie`
- **Secrétaire** : `/secretaire/messagerie`

---

**Version** : 1.0.0 - Simplifiée  
**Date** : Décembre 2024 