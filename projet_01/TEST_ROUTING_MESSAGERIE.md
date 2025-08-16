# Test du Routage de la Messagerie

## Instructions de test

Ce document décrit comment tester le routage de la messagerie pour s'assurer que tout fonctionne correctement.

## Prérequis

1. **Application démarrée** : `npm start` ou `yarn start`
2. **Base de données** : Connectée et accessible
3. **Utilisateurs de test** : Créés avec différents rôles

## Tests à effectuer

### 1. Test de l'authentification

#### Test sans connexion
```bash
# Ouvrir ces URLs sans être connecté
http://localhost:3000/admin/messagerie
http://localhost:3000/secretaire/messagerie
http://localhost:3000/medecin/messagerie
```

**Résultat attendu** : Redirection vers la page de connexion (`/`)

### 2. Test avec rôle ADMIN

#### Connexion en tant qu'administrateur
1. Aller sur `/`
2. Se connecter avec un compte administrateur
3. Vérifier que l'onglet "Messagerie" apparaît dans la barre latérale
4. Cliquer sur "Messagerie"

**Résultat attendu** :
- URL : `/admin/messagerie`
- Composant : `MessagerieAdmin` affiché
- Titre : "Messagerie administrative"
- Interface : Contacts + zone de chat

#### Test de navigation
```bash
# Tester ces URLs en tant qu'admin
http://localhost:3000/admin/dashboard      # ✅ Dashboard
http://localhost:3000/admin/utilisateur    # ✅ Utilisateurs
http://localhost:3000/admin/patient        # ✅ Patients
http://localhost:3000/admin/messagerie     # ✅ Messagerie
```

#### Test d'accès interdit
```bash
# Tester ces URLs en tant qu'admin
http://localhost:3000/secretaire/messagerie  # ❌ Accès refusé
http://localhost:3000/medecin/messagerie     # ❌ Accès refusé
```

### 3. Test avec rôle SECRETAIRE

#### Connexion en tant que secrétaire
1. Aller sur `/`
2. Se connecter avec un compte secrétaire
3. Vérifier que l'onglet "Messagerie" apparaît dans la barre latérale
4. Cliquer sur "Messagerie"

**Résultat attendu** :
- URL : `/secretaire/messagerie`
- Composant : `MessagerieSecretaire` affiché
- Titre : "Messagerie secrétariat"
- Interface : Contacts + zone de chat

#### Test de navigation
```bash
# Tester ces URLs en tant que secrétaire
http://localhost:3000/secretaire/rendezvous   # ✅ Rendez-vous
http://localhost:3000/secretaire/patient      # ✅ Patients
http://localhost:3000/secretaire/calendrier   # ✅ Calendrier
http://localhost:3000/secretaire/facture      # ✅ Factures
http://localhost:3000/secretaire/messagerie   # ✅ Messagerie
```

#### Test d'accès interdit
```bash
# Tester ces URLs en tant que secrétaire
http://localhost:3000/admin/messagerie        # ❌ Accès refusé
http://localhost:3000/medecin/messagerie      # ❌ Accès refusé
```

### 4. Test avec rôle MEDECIN

#### Connexion en tant que médecin
1. Aller sur `/`
2. Se connecter avec un compte médecin
3. Vérifier que l'onglet "Messagerie" apparaît dans la barre latérale
4. Cliquer sur "Messagerie"

**Résultat attendu** :
- URL : `/medecin/messagerie`
- Composant : `MessagerieMedecin` affiché
- Titre : "Messagerie médicale"
- Interface : Contacts + zone de chat

#### Test de navigation
```bash
# Tester ces URLs en tant que médecin
http://localhost:3000/medecin/rendezvous      # ✅ Rendez-vous
http://localhost:3000/medecin/calendrier      # ✅ Calendrier
http://localhost:3000/medecin/messagerie      # ✅ Messagerie
```

#### Test d'accès interdit
```bash
# Tester ces URLs en tant que médecin
http://localhost:3000/admin/messagerie         # ❌ Accès refusé
http://localhost:3000/secretaire/messagerie    # ❌ Accès refusé
```

## Vérifications visuelles

### 1. Barre latérale
- [ ] L'onglet "Messagerie" est visible
- [ ] L'icône enveloppe est affichée
- [ ] L'onglet est cliquable
- [ ] L'onglet devient actif lors du clic

### 2. Interface de messagerie
- [ ] Le header avec titre est affiché
- [ ] Les boutons "Nouveau message" et "Paramètres" sont visibles
- [ ] La sidebar des contacts est présente
- [ ] La zone de chat est affichée
- [ ] La zone de saisie est fonctionnelle

### 3. Responsive design
- [ ] L'interface s'adapte sur mobile
- [ ] Les éléments sont bien alignés
- [ ] Les boutons sont accessibles

## Tests de fonctionnalités

### 1. Recherche de contacts
- [ ] Le champ de recherche est visible
- [ ] La saisie fonctionne
- [ ] Les résultats s'affichent

### 2. Sélection de contact
- [ ] Cliquer sur un contact le sélectionne
- [ ] Le contact sélectionné est mis en évidence
- [ ] Les informations du contact s'affichent dans le chat

### 3. Zone de saisie
- [ ] Le textarea est éditable
- [ ] Le bouton "Envoyer" est cliquable
- [ ] Le placeholder est visible

## Gestion des erreurs

### 1. Routes inexistantes
```bash
# Tester des URLs invalides
http://localhost:3000/admin/messagerie/invalid
http://localhost:3000/secretaire/messagerie/invalid
http://localhost:3000/medecin/messagerie/invalid
```

**Résultat attendu** : Redirection vers la route par défaut du rôle

### 2. Accès non autorisé
- Tenter d'accéder à une route d'un autre rôle
- Vérifier la redirection vers la page de connexion

### 3. Token expiré
- Laisser le token expirer
- Tenter d'accéder à une route protégée
- Vérifier la redirection vers la page de connexion

## Tests de performance

### 1. Chargement des composants
- [ ] Le composant se charge rapidement
- [ ] Pas de blocage de l'interface
- [ ] Les images se chargent correctement

### 2. Navigation entre onglets
- [ ] Le changement d'onglet est fluide
- [ ] Pas de rechargement de page
- [ ] L'état est conservé

## Checklist de validation

### Fonctionnalités de base
- [ ] Authentification requise
- [ ] Contrôle de rôle fonctionnel
- [ ] Navigation entre onglets
- [ ] Affichage des composants

### Interface utilisateur
- [ ] Design cohérent avec l'application
- [ ] Responsive design
- [ ] Icônes et images
- [ ] États actifs des onglets

### Sécurité
- [ ] Routes protégées
- [ ] Accès basé sur les rôles
- [ ] Redirection automatique
- [ ] Gestion des erreurs

### Performance
- [ ] Chargement rapide
- [ ] Navigation fluide
- [ ] Pas de fuites mémoire

## Résolution des problèmes

### Problème : Onglet non visible
**Solution** : Vérifier l'import de l'icône et l'ajout dans la barre latérale

### Problème : Route non accessible
**Solution** : Vérifier l'ajout de la route dans le routeur correspondant

### Problème : Composant non affiché
**Solution** : Vérifier l'import et l'export du composant

### Problème : Accès refusé
**Solution** : Vérifier la configuration des rôles et la protection des routes

## Conclusion

Une fois tous ces tests passés avec succès, le routage de la messagerie est considéré comme fonctionnel et prêt pour la production. 