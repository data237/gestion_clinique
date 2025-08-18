# Intégration des Statistiques - Frontend React avec Backend Java Spring Boot

## Vue d'ensemble

Ce document décrit l'intégration entre le frontend React et le backend Java Spring Boot pour la récupération et l'affichage des statistiques de la clinique.

## Endpoints Backend Utilisés

### 1. Statistiques Journalières
- **Endpoint**: `GET /Api/V1/clinique/stats/daily`
- **Paramètres**: `date` (optionnel, format YYYY-MM-DD)
- **Rôle requis**: ADMIN
- **Réponse**: `StatDuJourResponseDto`

### 2. Statistiques Mensuelles
- **Endpoint**: `GET /Api/V1/clinique/stats/monthly`
- **Paramètres**: `month` (1-12, "last", "current")
- **Rôle requis**: ADMIN
- **Réponse**: `StatParMoisResponseDto`

### 3. Statistiques Annuelles
- **Endpoint**: `GET /Api/V1/clinique/stats/yearly`
- **Paramètres**: `year` (ex: 2025)
- **Rôle requis**: ADMIN
- **Réponse**: `StatsSurLanneeResponseDto`

## Implémentation Frontend

### Configuration API
Les endpoints sont configurés dans `src/composants/config/apiconfig.jsx`:

```javascript
export const STATS_ENDPOINTS = {
    DAILY: '/stats/daily',
    MONTHLY: '/stats/monthly',
    YEARLY: '/stats/yearly',
};
```

### Composant Dashboard
Le composant `src/composants/administrateur/dashboard.jsx` gère :

1. **Récupération des statistiques journalières** - Affichées dans la grille "statistiques du jour"
2. **Récupération des revenus mensuels** - Affichés dans le graphique linéaire
3. **Récupération des statistiques annuelles** - Affichées dans la nouvelle grille "Statistiques annuelles"

### États de Gestion
- `statsLoading`: Indicateur de chargement
- `statsError`: Gestion des erreurs
- `monthlyRevenue`: Données des revenus mensuels
- `yearlyStats`: Statistiques annuelles

### Gestion des Erreurs
- Affichage des messages d'erreur
- Bouton "Réessayer" pour recharger les données
- Fallback vers des valeurs par défaut en cas d'échec

## Structure des Données Attendues

### Statistiques Mensuelles
```json
{
    "chiffreAffaires": 1500000,
    "nbrPatientEnrg": 45,
    "nbrRendezVous": 120,
    "nbrConsultation": 98
}
```

### Statistiques Annuelles
```json
{
    "chiffreAffaires": 18000000,
    "nbrPatientEnrg": 540,
    "nbrRendezVous": 1440,
    "nbrConsultation": 1176
}
```

## Fonctionnalités

### Graphique des Revenus Mensuels
- Affichage des 12 mois de l'année
- Données récupérées depuis l'API pour chaque mois
- Gestion des erreurs par mois individuel
- Fallback vers des valeurs par défaut

### Statistiques Annuelles
- Affichage dans une grille 2x2
- Chiffre d'affaires total avec formatage FCFA
- Nombre total de patients
- Nombre total de rendez-vous
- Nombre total de consultations

## Sécurité
- Toutes les requêtes nécessitent un token d'authentification
- Vérification du rôle ADMIN
- Headers d'autorisation automatiques

## Débogage
- Logs console pour chaque mois et statistiques annuelles
- Gestion des erreurs détaillée
- États de chargement visibles

## Utilisation

1. L'utilisateur doit être connecté avec le rôle ADMIN
2. Les statistiques se chargent automatiquement au montage du composant
3. En cas d'erreur, un bouton "Réessayer" permet de recharger
4. Les données sont mises à jour en temps réel depuis le backend

## Notes Techniques

- Utilisation d'Axios pour les requêtes HTTP
- Gestion des états avec React hooks
- CSS Grid pour la mise en page responsive
- Chart.js pour le graphique des revenus
- Gestion des erreurs robuste avec fallbacks
