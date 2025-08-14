import '../styles/pagelogin.css'
import '../styles/buttons.css'
import { useState, useEffect } from 'react';
import axios from 'axios'
import { API_BASE } from '../composants/config/apiconfig'
import { useNavigate } from 'react-router-dom';
import imageclinique from '../assets/img_clinique.jpg'
import logoclinique from '../assets/logo.png'
import icon from '../assets/Icon.png'
import Photoprofil from '../composants/photoprofil.jsx'
import photoProfil from '../assets/img_profil.jpg'

function PageLogin() {
  let navigate = useNavigate()
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(true); // Par défaut visible
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [success, setSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
   const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(photoProfil);
  
  // Validation email en temps réel
  useEffect(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailValid(false);
    } else {
      setEmailValid(true);
    }
  }, [email]);

  // Validation mot de passe en temps réel
  useEffect(() => {
    if (password && password.length < 6) {
      setPasswordValid(false);
    } else {
      setPasswordValid(true);
    }
  }, [password]);

  // Vérifier si l'utilisateur était déjà connecté
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setemail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Afficher popup après 5 tentatives échouées
  useEffect(() => {
    if (loginAttempts >= 5) {
      setPopupMessage('Trop de tentatives de connexion échouées. Veuillez contacter l\'administrateur.');
      setShowPopup(true);
    }
  }, [loginAttempts]);

  // Récupérer la photo de profil actuelle
  useEffect(() => {
    const fetchCurrentPhoto = async () => {
      const userId = localStorage.getItem('id');
      const token = localStorage.getItem('token');
      
      if (userId && token) {
        try {
          const response = await axios.get(`${API_BASE}/utilisateurs/${userId}/photo`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.data) {
            setCurrentPhotoUrl(response.data);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la photo:', error);
          // Garder la photo par défaut en cas d'erreur
        }
      }
    };

    fetchCurrentPhoto();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation finale
    if (!emailValid || !passwordValid) {
      setError('Veuillez corriger les erreurs avant de continuer');
      return;
    }

    // Bloquer si trop de tentatives
    if (loginAttempts >= 5) {
      setError('Trop de tentatives échouées. Contactez l\'administrateur.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE}/login`, {
        email,
        password,
      });

      const { id, token, username, photoUrl, authorities } = response.data;
      
      // Réinitialiser les tentatives de connexion
      setLoginAttempts(0);
      
      // Sauvegarder les informations de connexion
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      localStorage.setItem('username', username);
      localStorage.setItem('photoUrl', photoUrl);
      localStorage.setItem('user', JSON.stringify(authorities[0].authority));

      // Mettre à jour la photo de profil dans l'état local
      if (photoUrl) {
        setCurrentPhotoUrl(photoUrl);
      }

      // Gérer "Se souvenir de moi"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Appeler l'endpoint pour annuler les vieux rendez-vous
      try {
        await axios.post(`${API_BASE}/rendezvous/cancel-old`, {}, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Vieux rendez-vous annulés avec succès');
      } catch (cancelError) {
        console.error('Erreur lors de l\'annulation des vieux rendez-vous:', cancelError);
        // Ne pas bloquer la connexion si cet appel échoue
      }

      // Notification de succès
      if (window.showNotification) {
        window.showNotification('Connexion réussie !', 'success', 3000);
      }

      setSuccess(true);

      // Redirection conditionnelle
      setTimeout(() => {
        if (authorities[0].authority === 'ROLE_ADMIN') {
          navigate('/admin/dashboard');
        } else if (authorities[0].authority === 'ROLE_MEDECIN') {
          navigate('/medecin');
        } else if (authorities[0].authority === 'ROLE_SECRETAIRE') {
          navigate('/secretaire');
        } else {
          navigate('/');
        }
      }, 1000);

    } catch (error) {
      console.error('Erreur de connexion :', error);
      
      // Incrémenter les tentatives de connexion
      setLoginAttempts(prev => prev + 1);
      
      if (error.response?.status === 401) {
        setError('Email ou mot de passe incorrect');
      } else if (error.response?.status === 404) {
        setError('Utilisateur non trouvé');
      } else if (error.response?.status === 403) {
        setError('Compte désactivé. Contactez l\'administrateur.');
      } else if (error.code === 'NETWORK_ERROR') {
        setError('Erreur de connexion réseau. Vérifiez votre connexion internet.');
      } else {
        setError('Erreur de connexion. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  };

  const handleForgotPassword = () => {
    setPopupMessage('Pour réinitialiser votre mot de passe, contactez l\'administrateur.');
    setShowPopup(true);
  };

  const handleContactAdmin = () => {
    setPopupMessage('Pour toute assistance, contactez l\'administrateur.');
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  const handlePhotoUpload = async (file) => {
    try {
      // Validation du fichier
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      
      if (file.size > maxSize) {
        setPopupMessage('Le fichier est trop volumineux (max 5MB)');
        setShowPopup(true);
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        setPopupMessage('Format de fichier non supporté (JPG, PNG, GIF uniquement)');
        setShowPopup(true);
        return;
      }

      // Récupérer l'ID utilisateur depuis le localStorage
      const userId = localStorage.getItem('id');
      if (!userId) {
        setPopupMessage('Erreur: ID utilisateur non trouvé. Veuillez vous reconnecter.');
        setShowPopup(true);
        return;
      }

      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('photo', file);

      // Appel API pour uploader la photo
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE}/utilisateurs/${userId}/photo`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        // Récupérer la nouvelle photo de profil
        try {
          const photoResponse = await axios.get(`${API_BASE}/utilisateurs/${userId}/photo`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (photoResponse.data) {
            // Mettre à jour la photo dans le localStorage et l'état local
            localStorage.setItem('photoUrl', photoResponse.data);
            setCurrentPhotoUrl(photoResponse.data);
          }
        } catch (photoError) {
          console.error('Erreur lors de la récupération de la photo:', photoError);
        }

        setPopupMessage('Photo de profil mise à jour avec succès !');
        setShowPopup(true);
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo:', error);
      let errorMessage = 'Erreur lors de l\'upload de la photo. Veuillez réessayer.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      } else if (error.response?.status === 413) {
        errorMessage = 'Fichier trop volumineux.';
      }
      
      setPopupMessage(errorMessage);
      setShowPopup(true);
    }
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordChangeError('');
    setPasswordChangeSuccess('');
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentPassword) {
      setPasswordChangeError('Le mot de passe actuel est requis');
      return;
    }
    
    if (!newPassword) {
      setPasswordChangeError('Le nouveau mot de passe est requis');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordChangeError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    if (!confirmPassword) {
      setPasswordChangeError('La confirmation du mot de passe est requise');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordChangeError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      // Récupérer l'ID utilisateur depuis le localStorage
      const userId = localStorage.getItem('id');
      if (!userId) {
        setPasswordChangeError('Erreur: ID utilisateur non trouvé. Veuillez vous reconnecter.');
        return;
      }

      // Appel API pour changer le mot de passe
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE}/utilisateurs/${userId}/password`, {
        newPassword: newPassword,
        confirmPassword: confirmPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setPasswordChangeSuccess('Mot de passe modifié avec succès !');
        setPasswordChangeError('');
        
        // Vider les champs
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        setTimeout(() => {
          setShowChangePasswordModal(false);
          setPasswordChangeSuccess('');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      let errorMessage = 'Erreur lors du changement de mot de passe. Veuillez réessayer.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Données invalides.';
      }
      
      setPasswordChangeError(errorMessage);
    }
  };

  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordChangeError('');
    setPasswordChangeSuccess('');
  };

  return (
    <>
      <div className='accueil'>
        {/* Header avec photo de profil */}
        <div className='header-login'>
          <div className='header-content'>
            <div className='logo-section'>
              <img src={logoclinique} alt="Logo" className='header-logo' />
            </div>
            <div className='profile-section'>
              <Photoprofil 
                imgprofil={currentPhotoUrl}
                onPhotoUpload={handlePhotoUpload}
                onChangePassword={handlePasswordChangeSubmit}
                userId={localStorage.getItem('id')}
              />
            </div>
          </div>
        </div>

        <div className='image-container'>
          <img src={imageclinique} className='img_cli_acc' alt="Clinique" />
        </div>
        
        <form className='formulaire' onSubmit={handleSubmit}>
          <img src={logoclinique} alt="Logo" />
          <div className='formulaire_1'>
            
            <p className='text'>
              <span>Bonjour ! </span><br />
              Connectez-vous pour commencer à travailler.
            </p>
            
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email" className='login-label'>
                Email
                {!emailValid && email && (
                  <span className="validation-error"> *</span>
                )}
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={email} 
                onChange={(e) => setemail(e.target.value)} 
                placeholder='Entrez votre email' 
                required 
                className={`login-input ${!emailValid && email ? 'error' : ''}`}
                disabled={isLoading}
                onKeyPress={handleKeyPress}
              />
              {!emailValid && email && (
                <span className="validation-message">Format d'email invalide</span>
              )}
            </div>
    
            <div className="form-group">
              <label htmlFor="password" className='login-label'>
                Mot de passe
                {!passwordValid && password && (
                  <span className="validation-error"> *</span>
                )}
              </label>
              <div className="password-input-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password" 
                  value={password} 
                  onChange={(e) => setpassword(e.target.value)} 
                  placeholder='Entrez votre mot de passe' 
                  required 
                  className={`login-input password-input ${!passwordValid && password ? 'error' : ''}`}
                  disabled={isLoading}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {!passwordValid && password && (
                <span className="validation-message">Le mot de passe doit contenir au moins 6 caractères</span>
              )}
            </div>

            {loginAttempts > 0 && (
              <div className="attempt-counter">
                Tentatives de connexion : {loginAttempts}/5
                {loginAttempts >= 3 && (
                  <div className="warning-text">
                    ⚠️ Trop de tentatives échouées
                  </div>
                )}
              </div>
            )}

            <div className="form-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Se souvenir de moi</span>
              </label>
              <button 
                type="button" 
                className="forgot-password-btn"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Mot de passe oublié ?
              </button>
            </div>
            
            <button 
              type="submit" 
              className={`modern-login-button ${isLoading ? 'loading' : ''} ${success ? 'success' : ''}`} 
              disabled={isLoading || !emailValid || !passwordValid || loginAttempts >= 5}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Connexion...
                </>
              )  : (
                <>
                  Se connecter 
                  <img src={icon} className='icon' alt="Connexion" />
                </>
              )}
            </button>

            <div className="login-footer">
              <p>Nouveau sur la plateforme ?</p>
              <button 
                type="button" 
                className="contact-admin-btn"
                onClick={handleContactAdmin}
                disabled={isLoading}
              >
                Contactez l'administrateur
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal de changement de mot de passe */}
      {showChangePasswordModal && (
        <div className="popup-overlay" onClick={closeChangePasswordModal}>
          <div className="popup-content change-password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>🔒 Modifier le mot de passe</h3>
              <button className="popup-close" onClick={closeChangePasswordModal}>×</button>
            </div>
            <div className="popup-body">
              <form onSubmit={handlePasswordChangeSubmit}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Mot de passe actuel</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe actuel"
                    required
                    className="login-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">Nouveau mot de passe</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Entrez le nouveau mot de passe"
                    required
                    className="login-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez le nouveau mot de passe"
                    required
                    className="login-input"
                  />
                </div>
                
                {passwordChangeError && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {passwordChangeError}
                  </div>
                )}
                
                {passwordChangeSuccess && (
                  <div className="success-message">
                    <span className="success-icon">✅</span>
                    {passwordChangeSuccess}
                  </div>
                )}
                
                <div className="modal-buttons">
                  <button type="submit" className="popup-btn primary">
                    Modifier le mot de passe
                  </button>
                  <button type="button" className="popup-btn secondary" onClick={closeChangePasswordModal}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>📞 Contact Administrateur</h3>
              <button className="popup-close" onClick={closePopup}>×</button>
            </div>
            <div className="popup-body">
              <p>{popupMessage}</p>
              <div className="admin-contact">
                <p><strong>Téléphone :</strong> +237 677 850 000</p>
                <p><strong>Email :</strong> admin@gmail.com</p>
                <p><strong>Horaires :</strong> Lundi - Dimanche, 8h - 18h</p>
              </div>
            </div>
            <div className="popup-footer">
              <button className="popup-btn" onClick={closePopup}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PageLogin
