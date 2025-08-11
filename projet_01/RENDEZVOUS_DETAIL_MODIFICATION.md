# Gestion des Rendez-vous - Affichage et Modification

## Vue d'ensemble

Ce document décrit les nouvelles fonctionnalités ajoutées pour permettre aux secrétaires de visualiser et modifier les détails des rendez-vous en cliquant sur les champs du tableau.

## Fonctionnalités ajoutées

### 1. Affichage des détails d'un rendez-vous

**Fichier :** `src/composants/secretaire/afficherdetailrendezvous.jsx`

**Fonctionnalité :** Permet d'afficher toutes les informations d'un rendez-vous spécifique.

**Champs affichés :**
- Patient (nom complet)
- Médecin (nom complet)
- Date et heure
- Service médical
- Salle
- Statut
- Facture associée
- Notes
- Dates de création et modification

**Navigation :**
- Bouton "Liste des rendez-vous" pour retourner au tableau
- Bouton "Modifier" pour passer en mode édition

### 2. Modification d'un rendez-vous

**Fichier :** `src/composants/secretaire/modifierrendezvous.jsx`

**Fonctionnalité :** Permet de modifier les informations d'un rendez-vous existant.

**Champs modifiables :**
- Patient (sélection dans une liste)
- Médecin (sélection dans une liste)
- Date et heure
- Service médical (sélection dans une liste)
- Notes

**Validation :**
- Vérification des champs obligatoires
- Gestion des erreurs de validation
- Prévention des conflits de planning

**Navigation :**
- Bouton "Voir les détails" pour retourner à la vue détaillée
- Bouton "Annuler" pour annuler les modifications

## Routes ajoutées

**Fichier :** `src/pages/secretaireroute.jsx`

```jsx
// Route pour afficher les détails d'un rendez-vous
<Route path="rendezvous/viewrendezvous/:id" element={<AfficherDetailRendezVous />} />

// Route pour modifier un rendez-vous
<Route path="rendezvous/edit/:id" element={<ModifierRendezVous />} />
```

## Intégration avec le tableau existant

**Fichier :** `src/composants/secretaire/rendezvoussecretaire.jsx`

La fonction `handleRowClick` a été modifiée pour rediriger vers la page de détail :

```jsx
const handleRowClick = (rendezvous) => {
  navigate(`/secretaire/rendezvous/viewrendezvous/${rendezvous.id}`);
};
```

**Comportement :** Cliquer sur n'importe quel champ d'une ligne de rendez-vous redirige vers la page de détail.

## Styles CSS

**Fichier :** `src/styles/rendezvous.css`

Styles personnalisés pour :
- Gestion des erreurs de validation
- Boutons et formulaires
- Design responsive
- États de chargement
- Champs en lecture seule

## Utilisation

### Pour visualiser un rendez-vous :

1. Aller dans la section "Gestion des rendez-vous"
2. Cliquer sur n'importe quel champ d'une ligne de rendez-vous
3. La page de détail s'affiche avec toutes les informations
4. Utiliser le bouton "Liste des rendez-vous" pour revenir au tableau

### Pour modifier un rendez-vous :

1. Depuis la page de détail, cliquer sur "Modifier"
2. Modifier les champs souhaités
3. Valider le formulaire
4. Retourner automatiquement à la page de détail

## Gestion des erreurs

- **Validation côté client :** Vérification des champs obligatoires
- **Gestion des conflits :** Détection des créneaux déjà pris
- **Messages d'erreur :** Affichage des erreurs de manière claire
- **Notifications :** Utilisation du système de notifications existant

## Sécurité

- **Authentification :** Vérification du token JWT
- **Autorisation :** Accès limité aux secrétaires
- **Validation :** Vérification des données côté serveur

## Maintenance

### Ajout de nouveaux champs :

1. Modifier le composant `AfficherDetailRendezVous`
2. Modifier le composant `ModifierRendezVous`
3. Mettre à jour la validation si nécessaire
4. Tester l'affichage et la modification

### Modification des services médicaux :

1. Mettre à jour la liste dans `ModifierRendezVous`
2. Vérifier la cohérence avec l'API backend

## Tests recommandés

- [ ] Affichage des détails d'un rendez-vous
- [ ] Modification des informations
- [ ] Validation des champs obligatoires
- [ ] Gestion des erreurs
- [ ] Navigation entre les pages
- [ ] Responsive design
- [ ] Gestion des conflits de planning

## Dépendances

- React Router pour la navigation
- Axios pour les appels API
- Styled-components pour le styling
- Système de notifications existant
- API backend pour la gestion des rendez-vous 