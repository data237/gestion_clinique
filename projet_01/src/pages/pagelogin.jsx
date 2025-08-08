import '../styles/pagelogin.css'
import { useState } from 'react';
import axios from 'axios'
import { API_BASE } from '../composants/config/apiconfig'
import { Link, useNavigate } from 'react-router-dom';
import imageclinique from '../assets/img_clinique.jpg'
import logoclinique from '../assets/logo.png'
import icon from '../assets/Icon.png'


function PageLogin() {
  let navigate = useNavigate()
   const [email, setemail] = useState('');
   const [password, setpassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE}/login`, {
        email,
        password,
      });

      const { id, token, username, photoUrl, authorities } = response.data;
      console.log(token)
      // Stocker le token dans localStorage ou context
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      localStorage.setItem('username', username);
      localStorage.setItem('photoUrl', photoUrl);
      localStorage.setItem('user', JSON.stringify(authorities[0].authority));

      // Redirection conditionnelle
      if (authorities[0].authority === 'ROLE_ADMIN') {
        navigate('/admin/utilisateur');
      } else if (authorities[0].authority === 'ROLE_MEDECIN') {
        navigate('/medecin');
      } else if (authorities[0].authority === 'ROLE_SECRETAIRE') {
        navigate('/secretaire');
      } else{
        navigate('/');
      }

    } catch (error) {
      console.error('Erreur de connexion :', error);
      if (error.response?.status === 401) {
        setError('Email ou mot de passe incorrect');
      } else if (error.response?.status === 404) {
        setError('Utilisateur non trouvé');
      } else {
        setError('Erreur de connexion. Veuillez réessayer.');
      }
    } finally{
      setIsLoading(false);
      if (!error) {
        setemail('');
        setpassword('');
      }
    };
  };
  

  return (
    <>
      <div className='accueil'>
        <img src={imageclinique} className='img_cli_acc'></img>
        <form className='formulaire' onSubmit={handleSubmit}>
            <img src={logoclinique}></img>
            <div className='formulaire_1'>
              
             
                <p className='text'><span>Bonjour ! </span><br></br> Connectez vous pour commencer à travailler.</p>
                
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
                
                <div className="form-group">
                     <label htmlFor="email" className='login-label'>Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={email} 
                        onChange={(e) => setemail(e.target.value)} 
                        placeholder='Entrez votre email' 
                        required 
                        className='login-input'
                        disabled={isLoading}
                      ></input>
                </div>
        
                <div className="form-group">
                    <label htmlFor="password" className='login-label'>Mot de passe</label>
                    <input 
                      type="password" 
                      id="password" 
                      name="password" 
                      value={password} 
                      onChange={(e) => setpassword(e.target.value)} 
                      placeholder='Entrez votre mot de passe' 
                      required 
                      className='login-input'
                      disabled={isLoading}
                    ></input>
                </div>
               
                <button 
                  type="submit" 
                  className={`button1 ${isLoading ? 'loading' : ''}`} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'} 
                  <img src={icon} className='icon'></img>
                </button>
              
            </div>
        </form>
      </div>
      
      
    </>
  )
}

export default PageLogin
