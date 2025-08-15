# Correction Formulaire Utilisateur - Gestion des Rôles

## Problème identifié

Le formulaire de création d'utilisateur envoyait les rôles dans un format incorrect :
- **Avant** : `"role": "medecin"` (chaîne de caractères)
- **Attendu par le backend** : `"role": { "id": 1 }` (objet avec ID)

## Solution implémentée

### 1. Mapping des rôles
```javascript
const roleMapping = {
  "admin": { id: 1, roleType: "ROLE_ADMIN" },
  "medecin": { id: 2, roleType: "ROLE_MEDECIN" },
  "secretaire": { id: 3, roleType: "ROLE_SECRETAIRE" }
};
```

### 2. Format des données envoyées
```javascript
const dataToSend = {
  // ... autres champs
  role: {
    id: selectedRole.id  // Format attendu par le backend
  }
};
```

### 3. Validation des rôles
- Vérification que le rôle sélectionné existe dans le mapping
- Message d'erreur si le rôle est invalide
- Structure cohérente pour tous les types d'utilisateurs

## Corrections supplémentaires

### Genre
- **Avant** : `<option value="Femme">F</option>` (valeur et texte inversés)
- **Après** : `<option value="F">Femme</option>` (valeur correcte, texte descriptif)

### Simplification du code
- Suppression de la logique conditionnelle complexe pour l'envoi des données
- Un seul objet `dataToSend` pour tous les types d'utilisateurs
- Ajout conditionnel du service médical uniquement pour les médecins

## Structure finale des données

### Pour un administrateur
```json
{
  "nom": "John",
  "prenom": "Doe",
  "email": "john@example.com",
  "role": {
    "id": 1
  }
  // ... autres champs
}
```

### Pour un médecin
```json
{
  "nom": "Dr. Smith",
  "prenom": "Jane",
  "email": "jane@example.com",
  "role": {
    "id": 2
  },
  "serviceMedicalName": "CARDIOLOGIE"
  // ... autres champs
}
```

## Avantages de cette correction

### 1. Conformité backend
- Format des données exactement comme attendu par l'API
- Évite les erreurs 400 (Bad Request) liées au format des rôles

### 2. Maintenabilité
- Mapping centralisé des rôles
- Code plus lisible et maintenable
- Validation robuste des données

### 3. Cohérence
- Même structure de données pour tous les types d'utilisateurs
- Gestion uniforme des erreurs
- Validation centralisée

## Tests recommandés

1. **Création d'administrateur** : Vérifier que le rôle est envoyé avec `id: 1`
2. **Création de médecin** : Vérifier que le rôle est envoyé avec `id: 2` et le service médical
3. **Création de secrétaire** : Vérifier que le rôle est envoyé avec `id: 3`
4. **Validation des erreurs** : Tester avec des rôles invalides
5. **Format des données** : Vérifier dans les outils de développement que la requête est correcte

## Fichiers modifiés

- **`src/composants/administrateur/formulaireutilisateur.jsx`**
  - Ajout du mapping des rôles
  - Correction de la logique d'envoi des données
  - Correction des valeurs du select genre
  - Simplification et amélioration du code

## Notes importantes

- Les IDs des rôles (1, 2, 3) doivent correspondre à ceux définis dans la base de données
- Si les IDs changent côté backend, il faudra mettre à jour le mapping
- La validation côté frontend ne remplace pas la validation côté backend 