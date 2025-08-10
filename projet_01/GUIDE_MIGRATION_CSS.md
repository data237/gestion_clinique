# Guide de Migration CSS - Système d'Affichage Optimisé

## Vue d'ensemble

Ce guide vous accompagne dans la migration de vos composants vers le nouveau système CSS optimisé. L'objectif est de remplacer les styled-components hardcodés par des classes CSS standardisées et des variables CSS centralisées.

## Avant/Après - Exemples de Migration

### 1. Composants de mise en page

#### ❌ Avant (Styled-components hardcodés)
```jsx
const SousDiv1Style = Styled.div`
  width: 100%;
  padding-right: 32px;
`

const SousDiv2Style = Styled.div`
  width: 100%;
  padding-right: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`
```

#### ✅ Après (Classes CSS standardisées)
```jsx
// Remplacer par des classes CSS
<div className="sous-div-container">
<div className="sous-div-content">
```

**Classes CSS disponibles :**
- `.sous-div-container` : Container principal avec padding
- `.sous-div-content` : Container de contenu avec flexbox et gap

### 2. Zones d'affichage

#### ❌ Avant (Styled-components avec valeurs hardcodées)
```jsx
const ZonedaffichageStyle = Styled.div`
    height: 70vh;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: rgba(239, 239, 255, 1);
    border-radius: 10px;
`
```

#### ✅ Après (Classes CSS avec variables)
```jsx
// Utiliser les classes CSS spécialisées
<div className="zonedaffichage-secretaire-compact">
// ou
<div className="zonedaffichage-medecin-compact">
```

**Classes CSS disponibles :**
- `.zonedaffichage` : Zone générique
- `.zonedaffichage-secretaire` : Zone secrétaire standard
- `.zonedaffichage-secretaire-compact` : Zone secrétaire compacte (65vh)
- `.zonedaffichage-medecin` : Zone médecin standard
- `.zonedaffichage-medecin-compact` : Zone médecin compacte (70vh)
- `.zonedaffichage-calendar` : Zone calendrier (78vh)

### 3. Barres de recherche et boutons

#### ❌ Avant (Styled-components)
```jsx
const RechercheStyle = Styled.div`
   width: 75%;
   height: 56px;
   border-radius: 28px;
   background-color: rgba(239, 239, 255, 1);
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding-left: 20px;
   padding-right: 20px;
`
```

#### ✅ Après (Classes CSS)
```jsx
<div className="recherche">
```

**Classes CSS disponibles :**
- `.recherche` : Barre de recherche complète
- `.iconburger` : Icône burger
- `.iconrecherche` : Icône de recherche
- `.inputrecherche` : Champ de saisie
- `.affichebarh2` : Container de la barre

## Étapes de Migration

### Étape 1 : Identifier les styled-components à remplacer

Recherchez dans votre composant les styled-components qui correspondent aux patterns suivants :

```jsx
// Patterns à identifier
const SousDiv1Style = Styled.div`...`
const SousDiv2Style = Styled.div`...`
const ZonedaffichageStyle = Styled.div`...`
const RechercheStyle = Styled.div`...`
const IconburgerStyle = Styled.img`...`
const IconrechercheStyle = Styled.img`...`
const InputStyle = Styled.input`...`
```

### Étape 2 : Remplacer par les classes CSS

#### Exemple complet de migration

**Avant :**
```jsx
import Styled from 'styled-components'

const SousDiv1Style = Styled.div`
  width: 100%;
  padding-right: 32px;
`

const SousDiv2Style = Styled.div`
  width: 100%;
  padding-right: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const ZonedaffichageStyle = Styled.div`
    height: 70vh;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: rgba(239, 239, 255, 1);
    border-radius: 10px;
`

// Dans le JSX
<SousDiv1Style>
  <SousDiv2Style>
    <ZonedaffichageStyle>
      {/* contenu */}
    </ZonedaffichageStyle>
  </SousDiv2Style>
</SousDiv1Style>
```

**Après :**
```jsx
// Supprimer les styled-components
// Garder l'import CSS
import '../../styles/Zonedaffichage.css'

// Dans le JSX
<div className="sous-div-container">
  <div className="sous-div-content">
    <div className="zonedaffichage-secretaire-compact">
      {/* contenu */}
    </div>
  </div>
</div>
```

### Étape 3 : Adapter les props conditionnelles

Si vous aviez des props pour contrôler l'affichage :

**Avant :**
```jsx
const ZonedaffichageStyle = Styled.div`
    display: ${props => props.$zonedaffichagedisplay};
    // ... autres styles
`

<ZonedaffichageStyle $zonedaffichagedisplay={rendezvousdayvisible ? 'none' : 'block'}>
```

**Après :**
```jsx
// Utiliser des classes CSS conditionnelles
<div className={`zonedaffichage-calendar ${rendezvousdayvisible ? 'hidden' : ''}`}>
```

**Ou créer des classes CSS dédiées :**
```css
.zonedaffichage-calendar.hidden {
  display: none;
}
```

## Classes CSS par Composant

### Composants Secrétaire

#### `rendezvoussecretaire.jsx`
```jsx
// Remplacer
<SousDiv1Style> → <div className="sous-div-container">
<SousDiv2Style> → <div className="sous-div-content">
<ZonedaffichageStyle> → <div className="zonedaffichage-secretaire-compact">
<RechercheStyle> → <div className="recherche">
<IconburgerStyle> → <img className="iconburger">
<IconrechercheStyle> → <img className="iconrecherche">
<InputStyle> → <input className="inputrecherche">
```

#### `patientsecretaire.jsx`
```jsx
// Même remplacements que rendezvoussecretaire.jsx
// Zone d'affichage : zonedaffichage-secretaire-compact
```

#### `calendriersecretaire.jsx`
```jsx
// Remplacer
<ZonedaffichageStyle> → <div className="zonedaffichage-calendar">
```

#### `rdvsecretaireday.jsx`
```jsx
// Même remplacements que rendezvoussecretaire.jsx
// Zone d'affichage : zonedaffichage-secretaire-compact
```

#### `facture.jsx`
```jsx
// Même remplacements que rendezvoussecretaire.jsx
// Zone d'affichage : zonedaffichage-secretaire-compact
```

### Composants Médecin

#### `rendezvousmedecin.jsx`
```jsx
// Remplacer
<SousDiv1Style> → <div className="sous-div-container">
<SousDiv2Style> → <div className="sous-div-content">
<ZonedaffichageStyle> → <div className="zonedaffichage-medecin-compact">
<RechercheStyle> → <div className="recherche">
<IconburgerStyle> → <img className="iconburger">
<IconrechercheStyle> → <img className="iconrecherche">
<InputStyle> → <input className="inputrecherche">
```

#### `rdvday.jsx`
```jsx
// Même remplacements que rendezvousmedecin.jsx
// Zone d'affichage : zonedaffichage-medecin-compact
```

#### `calendriermedecin.jsx`
```jsx
// Remplacer
<ZonedaffichageStyle> → <div className="zonedaffichage-calendar">
```

## Variables CSS Disponibles

### Hauteurs
```css
--zone-height-desktop: calc(100vh - 120px - 40px)
--zone-height-tablet: calc(100vh - 120px - 60px)
--zone-height-mobile: calc(100vh - 120px - 80px)
--zone-height-secretaire: 70vh
--zone-height-secretaire-mobile: 60vh
```

### Couleurs
```css
--bg-primary: #f8f9fa
--bg-secondary: #ffffff
--bg-accent: rgba(239, 239, 255, 1)
--text-primary: #333333
--text-accent: #667eea
```

### Espacements
```css
--gap-small: 8px
--gap-medium: 16px
--gap-large: 24px
--gap-xl: 32px
--content-padding: 24px
--content-padding-mobile: 16px
```

## Classes Utilitaires

### Layout
```css
.flex, .flex-col, .flex-row
.items-center, .justify-center, .justify-between
.gap-small, .gap-medium, .gap-large, .gap-xl
```

### Spacing
```css
.p-small, .p-medium, .p-large, .p-xl
.m-small, .m-medium, .m-large, .m-xl
```

### Dimensions
```css
.w-full, .h-full, .h-screen, .h-auto
```

### Couleurs
```css
.bg-primary, .bg-secondary, .bg-accent
.text-primary, .text-secondary, .text-accent
```

## Responsive Design

Le système inclut automatiquement le responsive design. Les classes CSS s'adaptent selon les breakpoints :

- **Desktop** : ≥ 769px
- **Tablet** : ≤ 768px
- **Mobile** : ≤ 480px

### Exemple d'utilisation responsive
```jsx
// Les classes CSS s'adaptent automatiquement
<div className="zonedaffichage-secretaire">
  {/* 
    Desktop: height: 70vh
    Tablet: height: 70vh
    Mobile: height: 60vh
  */}
</div>
```

## Tests et Validation

### 1. Vérifier l'affichage
- Tester sur desktop (1920x1080)
- Tester sur tablette (768x1024)
- Tester sur mobile (375x667)

### 2. Vérifier les interactions
- Barre de recherche
- Boutons de pagination
- Navigation

### 3. Vérifier la cohérence
- Couleurs uniformes
- Espacements cohérents
- Hauteurs appropriées

## Dépannage

### Problème : Les styles ne s'appliquent pas
**Solution :** Vérifier que le fichier CSS est bien importé
```jsx
import '../../styles/Zonedaffichage.css'
```

### Problème : Responsive ne fonctionne pas
**Solution :** Vérifier que les variables CSS sont bien définies dans `display-config.css`

### Problème : Conflit avec d'autres styles
**Solution :** Utiliser des classes plus spécifiques ou ajouter `!important` si nécessaire

## Avantages de la Migration

1. **Maintenabilité** : Variables centralisées
2. **Performance** : Moins de styled-components
3. **Cohérence** : Styles uniformes
4. **Responsive** : Adaptation automatique
5. **Réutilisabilité** : Classes réutilisables

## Support

Pour toute question ou problème lors de la migration, consultez :
- `SYSTEME_AFFICHAGE_OPTIMISATION.md` : Documentation complète
- `display-config.css` : Variables CSS disponibles
- `Zonedaffichage.css` : Classes CSS spécialisées 