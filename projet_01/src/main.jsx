import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
// Initialiser le service d'authentification pour la gestion automatique de l'expiration du token
import './composants/config/authService.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
   <App/>
    
  </StrictMode>,
)
