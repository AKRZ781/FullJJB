import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConfirmEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (token) {
      axios.get(`${apiUrl}/api/auth/confirm/${token}`)
        .then(response => {
          if (response.data.Status === "Success") {
            setMessage("Email confirmé avec succès. Vous pouvez maintenant vous connecter.");
          } else if (response.data.Status === "AlreadyConfirmed") {
            setMessage("Votre email est déjà confirmé. Vous pouvez maintenant vous connecter.");
          } else {
            setMessage(response.data.Error || "Erreur inconnue.");
          }
        })
        .catch(err => {
          console.log(err);
          setMessage(`Erreur lors de la confirmation de l'email: ${err.response ? err.response.data.Error : err.message}`);
        });
    } else {
      setMessage("Token non fourni.");
    }
  }, [token, apiUrl]);

  return (
    <div className='d-flex flex-column justify-content-center align-items-center' style={{ backgroundColor: '#000235', minHeight: '100vh' }}>
      <div className='bg-white p-3 rounded'>
        <div className="w-100 text-center">
          <h2>Confirmation de l'email</h2>
          <p>{message}</p>
          <button className='btn btn-dark' onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmEmail;
