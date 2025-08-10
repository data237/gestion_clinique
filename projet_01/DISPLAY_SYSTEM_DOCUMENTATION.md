# Système de Gestion des Valeurs d'Affichage

## Vue d'ensemble

Ce système centralise la gestion des valeurs d'affichage (hauteurs, espacements, couleurs, etc.) pour assurer la cohérence et la maintenabilité du code. Il utilise des variables CSS et des composants React pour gérer l'affichage responsive.

## Structure des fichiers

### 1. `src/styles/display-config.css`
Fichier de configuration centralisé contenant toutes les variables CSS pour les valeurs d'affichage.

**Variables principales :**
- `--header-height`: Hauteur de l'en-tête (120px)
- `--content-padding`: Padding du contenu (24px par défaut)
- `--grid-gap`: Espacement entre éléments de grille (12px par défaut)
- `--zone-height-desktop/tablet/mobile`: Hauteurs des zones d'affichage

**Responsive breakpoints :**
- Desktop: > 1200px
- Tablet: 768px - 1200px  
- Mobile: ≤ 768px
- Small Mobile: ≤ 480px

### 2. `src/composants/utils/DisplayConfig.jsx`
Composants et hooks React pour gérer les valeurs d'affichage de manière dynamique.

## Utilisation

### Avec les variables CSS

```css
/* Dans vos fichiers CSS */
.my-component {
  padding: var(--content-padding);
  gap: var(--gap-medium);
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-medium);
}
```

### Avec les composants React

```jsx
import { DisplayZone, Spacer, useDisplayConfig } from '../utils/DisplayConfig';

function MyComponent() {
  const config = useDisplayConfig();
  
  return (
    <DisplayZone variant="default">
      <h1>Mon composant</h1>
      <Spacer size="medium" />
      <p>Contenu avec espacement automatique</p>
    </DisplayZone>
  );
}
```

### Avec les hooks

```jsx
import { useSpacing } from '../utils/DisplayConfig';

function MyComponent() {
  const { small, medium, large, contentPadding } = useSpacing();
  
  return (
    <div style={{ 
      padding: `${contentPadding}px`,
      gap: `${medium}px`
    }}>
      {/* Contenu */}
    </div>
  );
}
```

## Variantes disponibles

### DisplayZone
- `variant="default"`: Zone d'affichage standard (fond gris clair)
- `variant="dashboard"`: Zone d'affichage pour le dashboard (fond gris)
- `variant="secretaire"`: Zone d'affichage pour la secrétaire (fond bleu clair)

### Spacer
- `size="small"`: 8px (6px sur mobile)
- `size="medium"`: 12px (8px sur mobile)
- `size="large"`: 16px (10px sur mobile)
- `size="xl"`: 24px (12px sur mobile)
- `size="xxl"`: 32px (16px sur mobile)

## Migration depuis l'ancien système

### Avant (ancien système)
```jsx
<div className='zonedaffichage'>
  {/* Contenu */}
</div>
```

### Après (nouveau système)
```jsx
import { DisplayZone } from '../utils/DisplayConfig';

<DisplayZone variant="default">
  {/* Contenu */}
</DisplayZone>
```

### Ou avec la classe CSS
```jsx
<div className='display-zone'>
  {/* Contenu */}
</div>
```

## Avantages du nouveau système

1. **Cohérence** : Toutes les valeurs d'affichage sont centralisées
2. **Maintenabilité** : Modification d'une valeur = mise à jour partout
3. **Responsive** : Gestion automatique des breakpoints
4. **Performance** : Variables CSS optimisées
5. **Flexibilité** : Composants React + CSS variables
6. **Documentation** : Code auto-documenté

## Bonnes pratiques

1. **Utilisez toujours les variables CSS** au lieu de valeurs hardcodées
2. **Préférez les composants React** pour la logique complexe
3. **Testez sur tous les breakpoints** avant de déployer
4. **Documentez les nouvelles variables** si vous en ajoutez
5. **Maintenez la cohérence** des noms de variables

## Exemples d'utilisation avancée

### Combinaison de composants
```jsx
<DisplayZone variant="dashboard">
  <h1>Titre</h1>
  <Spacer size="large" />
  <div className="content">
    <p>Paragraphe 1</p>
    <Spacer size="small" />
    <p>Paragraphe 2</p>
  </div>
</DisplayZone>
```

### Styles personnalisés
```jsx
<DisplayZone 
  variant="default" 
  style={{ 
    backgroundColor: 'custom-color',
    border: '2px solid var(--text-accent)'
  }}
>
  {/* Contenu avec styles personnalisés */}
</DisplayZone>
```

### Hook avec logique conditionnelle
```jsx
function ResponsiveComponent() {
  const { isMobile, contentPadding, gapLarge } = useDisplayConfig();
  
  return (
    <div style={{
      padding: isMobile ? `${contentPadding / 2}px` : `${contentPadding}px`,
      gap: `${gapLarge}px`
    }}>
      {/* Contenu responsive */}
    </div>
  );
}
```

## Support et maintenance

Pour toute question ou suggestion d'amélioration, consultez :
1. Ce fichier de documentation
2. Les exemples dans le code
3. Les composants existants qui utilisent le système
4. L'équipe de développement

## Roadmap

- [ ] Ajout de nouvelles variantes de couleurs
- [ ] Support des thèmes sombres/clairs
- [ ] Animations et transitions
- [ ] Tests automatisés
- [ ] Documentation interactive 