import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

const AuthWrapper = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/auth/whoami`, { withCredentials: true })
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          navigate('/login');
        }
      })
      .catch((err) => {
        console.error('Erreur lors de la vérification du token:', err);
        setAuthenticated(false);
        navigate('/login');
      })
      .finally(() => {
        setInitialLoad(false);
      });
  }, [apiUrl, navigate]);

  if (initialLoad) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000235', color: 'white' }}>
        <h1>Chargement...</h1>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000235', color: 'white' }}>
        <h1>Veuillez vous reconnecter</h1>
        <button
          className='btn btn-dark w-100 rounded-1 mt-3'
          style={{ maxWidth: '200px' }}
          onClick={() => navigate('/login')}
        >
          Connexion
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
