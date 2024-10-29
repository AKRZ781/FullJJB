import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

const AuthWrapper = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/api/auth/whoami`, { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          setAuthenticated(true);
          setUserRole(res.data.User.role);  // Set the user role
        } else {
          setAuthenticated(false);
        }
        setInitialLoad(false);
      })
      .catch(err => {
        setAuthenticated(false);
        setInitialLoad(false);
      });
  }, [apiUrl]);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (!authenticated && !initialLoad) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000235', color: 'white' }}>
        <h1>Veuillez vous reconnecter</h1>
        <button 
          className='btn btn-dark w-100 rounded-1 mt-3' 
          style={{ maxWidth: '200px' }} 
          onClick={handleLoginRedirect}
        >
          Connexion
        </button>
      </div>
    );
  }

  return (
    <>
      {initialLoad ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000235', color: 'white' }}>
          <h1>Chargement...</h1>
        </div>
      ) : (
        <>
          {userRole === 'admin' ? (
            <div>
              {/* Place admin-specific components here */}
              {children}
            </div>
          ) : (
            <div>
              {children}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AuthWrapper;
