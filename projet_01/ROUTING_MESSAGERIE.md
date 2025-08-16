# Routage de la Messagerie

## Vue d'ensemble du routage

La messagerie est intégrée dans le système de routage existant avec une architecture basée sur les rôles et la protection des routes.

## Structure du routage principal (App.jsx)

```jsx
<Router>
  <Routes>
    <Route path="/" element={<PageLogin />} />
    <Route path="/calendar" element={<Calendrier />} />
    <Route path="/pagemedecin" element={<PageMedecin />} />
    
    {/* Routes protégées avec contrôle de rôle */}
    <Route element={<ProtectedRoute />}>
      <Route element={<RoleBasedRoute allowedRoles={['ROLE_ADMIN']} />}>
        <Route path='/admin/*' element={<Adminroute />} />
      </Route>
      <Route element={<RoleBasedRoute allowedRoles={['ROLE_MEDECIN']} />}>
        <Route path='/medecin/*' element={<Medecinroute />} />
      </Route>
      <Route element={<RoleBasedRoute allowedRoles={['ROLE_SECRETAIRE']} />}>
        <Route path='/secretaire/*' element={<Secretaireroute />} />
      </Route>
    </Route>
  </Routes>
</Router>
```

## Routage par rôle

### 1. Administrateur (`/admin/*`)

**Fichier** : `src/pages/adminrouter.jsx`

```jsx
const Adminroute = () => {
  return (
    <Routes>
      <Route path="/" element={<PageAdmin />}>
        {/* Route par défaut */}
        <Route index element={<Dashboard />} />
        
        {/* Routes dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Routes utilisateurs */}
        <Route path="utilisateur" element={<Utilisateur />} />
        <Route path="utilisateur/add" element={<FormulaireUtilisateur />} />
        <Route path="utilisateur/viewuser/:id" element={<DetailsUtilisateur />} />
        <Route path="utilisateur/edit/:id" element={<ModifierUtilisateur />} />
        
        {/* Routes patients */}
        <Route path="patient" element={<Patient />} />
        <Route path="patient/add" element={<FormulairePatient />} />
        <Route path="patient/viewpatient/:id" element={<DetailsPatient />} />
        <Route path="patient/edit/:id" element={<ModifierPatient />} />
        
        {/* Routes messagerie */}
        <Route path="messagerie" element={<MessagerieAdmin />} />
        
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};
```

**URLs disponibles** :
- `/admin` → Dashboard (route par défaut)
- `/admin/dashboard` → Dashboard
- `/admin/utilisateur` → Gestion des utilisateurs
- `/admin/patient` → Gestion des patients
- `/admin/messagerie` → **Messagerie administrative**

### 2. Secrétaire (`/secretaire/*`)

**Fichier** : `src/pages/secretaireroute.jsx`

```jsx
const Secretaireroute = () => {
  return (
    <Routes>
      <Route path="/" element={<PageSecretaire />}>
        {/* Route par défaut */}
        <Route index element={<Rendezvous />} />
        
        {/* Routes rendez-vous */}
        <Route path="rendezvous" element={<Rendezvous />} />
        <Route path="rendezvous/viewrendezvous/:id" element={<AfficherDetailRendezVous />} />
        <Route path="rendezvous/edit/:id" element={<ModifierRendezVous />} />
        
        {/* Routes patients */}
        <Route path="patient" element={<PatientSecretaire />} />
        <Route path="patient/add" element={<FormulairePatientSecretaire />} />
        <Route path="patient/rendezvous/:nompatient" element={<FormulaireRendezVous />} />
        
        {/* Routes calendrier */}
        <Route path="calendrier" element={<CalendarSecretaire />} />
        <Route path="calendrier/:today" element={<RendezvousScretaireToday />} />
        
        {/* Routes factures */}
        <Route path="facture" element={<Facture />} />
        
        {/* Routes messagerie */}
        <Route path="messagerie" element={<MessagerieSecretaire />} />
        
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="rendezvous" replace />} />
      </Route>
    </Routes>
  );
};
```

**URLs disponibles** :
- `/secretaire` → Rendez-vous (route par défaut)
- `/secretaire/rendezvous` → Gestion des rendez-vous
- `/secretaire/patient` → Gestion des patients
- `/secretaire/calendrier` → Calendrier
- `/secretaire/facture` → Gestion des factures
- `/secretaire/messagerie` → **Messagerie secrétariat**

### 3. Médecin (`/medecin/*`)

**Fichier** : `src/pages/medecinrouter.jsx`

```jsx
const Medecinroute = () => {
  return (
    <Routes>
      <Route path="/" element={<PageMedecin />}>
        {/* Route par défaut */}
        <Route index element={<RendezvousMedecin />} />
        
        {/* Routes rendez-vous */}
        <Route path="rendezvous" element={<RendezvousMedecin />} />
        <Route path="rendezvous/viewrendezvous/:id" element={<AfficherDetailRendezvous />} />
        <Route path="rendezvous/consultation/:idrendezvous" element={<FormulaireConsultation />} />
        <Route path="rendezvous/dossiermedical/:patientId" element={<DossierMedical />} />
        
        {/* Routes calendrier */}
        <Route path="calendrier" element={<Calendar />} />
        <Route path="calendrier/:today" element={<RendezvousMedecinToday />} />
        
        {/* Routes messagerie */}
        <Route path="messagerie" element={<MessagerieMedecin />} />
        
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="rendezvous" replace />} />
      </Route>
    </Routes>
  );
};
```

**URLs disponibles** :
- `/medecin` → Rendez-vous (route par défaut)
- `/medecin/rendezvous` → Gestion des rendez-vous
- `/medecin/calendrier` → Calendrier
- `/medecin/messagerie` → **Messagerie médicale**

## Navigation dans la barre latérale

### Page Admin (`src/pages/pageadmin.jsx`)
```jsx
<Barrelatteral> 
  <Link to="/admin/dashboard">
    <Eltmenu nommenu='Dashboard' active={contenuActif === 'dashboard'} />
  </Link>
  <Link to="/admin/utilisateur">
    <Eltmenu nommenu='Utilisateurs' img={imgutilisateur} active={contenuActif === 'utilisateur'} />
  </Link>
  <Link to="/admin/patient">
    <Eltmenu nommenu='Patients' img={imgpatient} active={contenuActif === 'patient'} />
  </Link>
  <Link to="/admin/messagerie">
    <Eltmenu nommenu='Messagerie' img={iconEnvelope} active={contenuActif === 'messagerie'} />
  </Link>
</Barrelatteral>
```

### Page Secrétaire (`src/pages/pagesecretaire.jsx`)
```jsx
<Barrelatteral> 
  <Link to="/secretaire/rendezvous">
    <Eltmenu nommenu='rendez-vous' img={imgrendezvous} />
  </Link>
  <Link to="/secretaire/patient">
    <Eltmenu nommenu='Patients' img={imgpatient} />
  </Link>
  <Link to="/secretaire/calendrier">
    <Eltmenu nommenu='Calendrier' img={imgcalendrier} />
  </Link>
  <Link to="/secretaire/facture">
    <Eltmenu nommenu='Facture' img={imgcalendrier} />
  </Link>
  <Link to="/secretaire/messagerie">
    <Eltmenu nommenu='Messagerie' img={iconEnvelope} />
  </Link>
</Barrelatteral>
```

### Page Médecin (`src/pages/pagemedecin.jsx`)
```jsx
<Barrelatteral> 
  <Link to="/medecin/rendezvous">
    <Eltmenu nommenu='rendez-vous' img={imgrendezvous} />
  </Link>
  <Link to="/medecin/calendrier">
    <Eltmenu nommenu='Calendrier' img={imgcalendrier} />
  </Link>
  <Link to="/medecin/messagerie">
    <Eltmenu nommenu='Messagerie' img={iconEnvelope} />
  </Link>
</Barrelatteral>
```

## Composants de messagerie

### Imports dans les routeurs
```jsx
// Adminrouter.jsx
import MessagerieAdmin from "../composants/administrateur/messagerie";

// Secretaireroute.jsx
import MessagerieSecretaire from "../composants/secretaire/messagerie";

// Medecinrouter.jsx
import MessagerieMedecin from "../composants/medecin/messagerie";
```

### Fichiers des composants
- `src/composants/administrateur/messagerie.jsx`
- `src/composants/secretaire/messagerie.jsx`
- `src/composants/medecin/messagerie.jsx`

## Sécurité et protection

### ProtectedRoute
- Vérifie l'authentification (token valide)
- Redirige vers `/` si non authentifié

### RoleBasedRoute
- Vérifie le rôle de l'utilisateur
- Redirige vers `/` si rôle non autorisé
- Permet l'accès uniquement aux routes correspondant au rôle

## Test du routage

### URLs à tester
1. **Sans authentification** :
   - `/admin/messagerie` → Redirection vers `/`
   - `/secretaire/messagerie` → Redirection vers `/`
   - `/medecin/messagerie` → Redirection vers `/`

2. **Avec authentification ADMIN** :
   - `/admin/messagerie` → ✅ MessagerieAdmin
   - `/secretaire/messagerie` → ❌ Accès refusé
   - `/medecin/messagerie` → ❌ Accès refusé

3. **Avec authentification SECRETAIRE** :
   - `/admin/messagerie` → ❌ Accès refusé
   - `/secretaire/messagerie` → ✅ MessagerieSecretaire
   - `/medecin/messagerie` → ❌ Accès refusé

4. **Avec authentification MEDECIN** :
   - `/admin/messagerie` → ❌ Accès refusé
   - `/secretaire/messagerie` → ❌ Accès refusé
   - `/medecin/messagerie` → ✅ MessagerieMedecin

## Gestion des erreurs

### Routes non trouvées
- **Admin** : Redirection vers `/admin/dashboard`
- **Secrétaire** : Redirection vers `/secretaire/rendezvous`
- **Médecin** : Redirection vers `/medecin/rendezvous`

### Accès non autorisé
- Redirection automatique vers la page de connexion
- Message d'erreur approprié affiché

## Points d'attention

1. **Ordre des routes** : Les routes plus spécifiques doivent être placées avant les routes génériques
2. **Protection des routes** : Toutes les routes de messagerie sont protégées par authentification et contrôle de rôle
3. **Navigation active** : L'état actif des onglets est géré par le composant parent
4. **Icônes** : L'icône enveloppe est utilisée de manière cohérente dans tous les rôles 