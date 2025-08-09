# Système de Popups et Loaders Uniformisé

## Vue d'ensemble

Ce document décrit le nouveau système uniformisé de popups de confirmation et de loaders pour l'application de gestion clinique.

## Composants créés

### 1. Modal.jsx
Composant de modal réutilisable pour les confirmations et validations.

**Props :**
- `isOpen` : boolean - contrôle l'affichage du modal
- `onClose` : function - fonction appelée pour fermer le modal
- `title` : string - titre du modal
- `content` : string - contenu du modal
- `onConfirm` : function - fonction appelée lors de la confirmation
- `confirmText` : string - texte du bouton de confirmation (défaut: "Confirmer")
- `cancelText` : string - texte du bouton d'annulation (défaut: "Annuler")
- `variant` : string - variante du bouton ("default", "danger", "success")
- `showCancel` : boolean - afficher le bouton d'annulation (défaut: true)

### 2. LoadingProvider.jsx
Provider pour gérer les états de chargement de manière centralisée.

**Hooks disponibles :**
- `useLoading()` - hook pour accéder aux fonctions de loading

**Fonctions disponibles :**
- `startLoading(key)` - démarre un loading avec une clé spécifique
- `stopLoading(key)` - arrête un loading avec une clé spécifique
- `startGlobalLoading()` - démarre un loading global (plein écran)
- `stopGlobalLoading()` - arrête le loading global
- `isLoading(key)` - vérifie si un loading est actif

### 3. ConfirmationProvider.jsx
Provider pour gérer les confirmations de manière centralisée.

**Hooks disponibles :**
- `useConfirmation()` - hook pour accéder aux fonctions de confirmation

**Fonctions disponibles :**
- `showConfirmation(options)` - affiche une confirmation

**Options de showConfirmation :**
- `title` : string - titre de la confirmation
- `content` : string - contenu de la confirmation
- `onConfirm` : function - fonction appelée lors de la confirmation
- `confirmText` : string - texte du bouton de confirmation
- `cancelText` : string - texte du bouton d'annulation
- `variant` : string - variante du bouton ("default", "danger", "success")

## Utilisation

### 1. Intégration dans App.jsx

Les providers sont déjà intégrés dans App.jsx :

```jsx
<NotificationProvider>
  <LoadingProvider>
    <ConfirmationProvider>
      {/* Votre application */}
    </ConfirmationProvider>
  </LoadingProvider>
</NotificationProvider>
```

### 2. Utilisation dans un composant

```jsx
import { useLoading } from '../LoadingProvider';
import { useConfirmation } from '../ConfirmationProvider';

function MonComposant() {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const { showConfirmation } = useConfirmation();

  const handleDelete = async () => {
    startLoading('delete');
    try {
      // Opération de suppression
      await deleteItem();
      window.showNotification('Suppression réussie', 'success');
    } catch (error) {
      window.showNotification('Erreur lors de la suppression', 'error');
    } finally {
      stopLoading('delete');
    }
  };

  const handleDeleteClick = () => {
    showConfirmation({
      title: "Confirmation de suppression",
      content: "Voulez-vous vraiment supprimer cet élément ?",
      onConfirm: handleDelete,
      confirmText: "Supprimer",
      cancelText: "Annuler",
      variant: "danger"
    });
  };

  return (
    <div>
      {isLoading('fetchData') && <p>Chargement...</p>}
      <button 
        onClick={handleDeleteClick}
        disabled={isLoading('delete')}
      >
        Supprimer
      </button>
    </div>
  );
}
```

### 3. Exemples de variantes

**Confirmation simple :**
```jsx
showConfirmation({
  title: "Confirmation",
  content: "Voulez-vous continuer ?",
  onConfirm: handleConfirm
});
```

**Confirmation de suppression :**
```jsx
showConfirmation({
  title: "Suppression",
  content: "Voulez-vous vraiment supprimer cet élément ?",
  onConfirm: handleDelete,
  confirmText: "Supprimer",
  variant: "danger"
});
```

**Confirmation de succès :**
```jsx
showConfirmation({
  title: "Succès",
  content: "Opération réussie !",
  onConfirm: handleClose,
  confirmText: "OK",
  variant: "success",
  showCancel: false
});
```

## Migration des composants existants

### Étapes pour migrer un composant :

1. **Importer les hooks :**
```jsx
import { useLoading } from '../LoadingProvider';
import { useConfirmation } from '../ConfirmationProvider';
```

2. **Ajouter les hooks dans le composant :**
```jsx
const { startLoading, stopLoading, isLoading } = useLoading();
const { showConfirmation } = useConfirmation();
```

3. **Remplacer les états de loading locaux :**
```jsx
// Avant
const [isLoading, setIsLoading] = useState(false);

// Après
const { startLoading, stopLoading, isLoading } = useLoading();
```

4. **Remplacer les popups locaux par des confirmations :**
```jsx
// Avant
const [showPopup, setShowPopup] = useState(false);

// Après
const { showConfirmation } = useConfirmation();
```

5. **Mettre à jour les fonctions d'action :**
```jsx
const handleAction = async () => {
  startLoading('actionKey');
  try {
    // Action
    window.showNotification('Succès', 'success');
  } catch (error) {
    window.showNotification('Erreur', 'error');
  } finally {
    stopLoading('actionKey');
  }
};
```

## Avantages du nouveau système

1. **Uniformité** : Tous les popups et loaders ont le même design
2. **Réutilisabilité** : Composants centralisés et réutilisables
3. **Maintenabilité** : Plus facile à maintenir et modifier
4. **UX améliorée** : Expérience utilisateur cohérente
5. **Performance** : Gestion centralisée des états
6. **Accessibilité** : Meilleure accessibilité avec les modals

## Composants déjà migrés

- ✅ `utilisateurs.jsx` - Gestion des utilisateurs
- 🔄 `patients.jsx` - Gestion des patients (en cours)
- ⏳ Autres composants à migrer

## Prochaines étapes

1. Migrer tous les composants existants
2. Ajouter des animations supplémentaires
3. Améliorer l'accessibilité
4. Ajouter des tests unitaires
5. Optimiser les performances 