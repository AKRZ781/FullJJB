import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Register() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.VITE_API_URL;

  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 &&
           /[a-z]/.test(password) &&
           /[A-Z]/.test(password) &&
           /\d/.test(password) &&
           /[^a-zA-Z0-9]/.test(password);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!values.name || !values.email || !values.password) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }
    if (!validateName(values.name)) {
      setErrorMessage('Le nom ne doit contenir que des lettres et des espaces.');
      return;
    }
    if (!validateEmail(values.email)) {
      setErrorMessage('Veuillez entrer une adresse e-mail valide.');
      return;
    }
    if (!validatePassword(values.password)) {
      setErrorMessage('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
      return;
    }

    axios.post(`${apiUrl}/api/auth/register`, values, { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          setMessage('Un e-mail de vérification a été envoyé à votre adresse e-mail.');
          setTimeout(() => navigate('/login'), 3000); // Redirige après 3 secondes
        } else {
          setErrorMessage(res.data.Error);
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.Error) {
          setErrorMessage(err.response.data.Error);
        } else {
          setErrorMessage('Erreur lors de l\'inscription.');
        }
      });
  };

  return (
    <div className='d-flex flex-column' style={{ minHeight: '100vh' }}>
      <div className='d-flex justify-content-center align-items-center flex-grow-1' style={{ backgroundColor: '#000235' }}>
        <div className='w-100'>
          <div className='d-flex justify-content-between align-items-center mb-5'>
            <div className='d-flex justify-content-center w-50'>
              <img src="/assets/logo.png" alt="logo" />
            </div>
            <div className='d-flex justify-content-center w-50'>
              <img src="/assets/logofulljjb.png" alt="logo" />
            </div>
          </div>
          <div className='d-flex justify-content-center'>
            <div className='bg-white p-3 rounded' style={{ width: '300px', marginBottom: '2rem' }}>
              <div className="w-100 text-center">
                <h2>S'inscrire</h2>
              </div>
              {message && <div className="alert alert-success">{message}</div>}
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label htmlFor="name"><strong>Nom *</strong></label>
                  <input type="text" placeholder='Nom' name='name'
                    onChange={e => setValues({ ...values, name: e.target.value })}
                    className='form-control rounded-0' />
                </div>
                <div className='mb-3'>
                  <label htmlFor="email"><strong>Email *</strong></label>
                  <input type="email" placeholder='Email' name='email'
                    onChange={e => setValues({ ...values, email: e.target.value })}
                    className='form-control rounded-0' />
                </div>
                <div className='mb-3'>
                  <label htmlFor="password"><strong>Mot de passe *</strong></label>
                  <input type="password" placeholder='Mot de passe' name='password'
                    onChange={e => setValues({ ...values, password: e.target.value })}
                    className='form-control rounded-0' />
                </div>
                <button type='submit' className='btn btn-dark w-100 rounded-1'>S'inscrire</button>
                <Link to="/" className='btn btn-dark w-100 rounded-1 mt-2'>Accueil</Link>
                <p>Vous acceptez nos conditions et politiques</p>
                <Link to="/login" className='btn btn-dark border w-100 rounded-1'>Connexion</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
      <footer className="text-white" style={{ backgroundColor: 'rgba(7, 1, 8, 0.96)', padding: '20px 0' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h4>Contact</h4>
              <p>Email: fulljjb@gmail.com</p>
              <p>Adresse: 123 Rue Exemple, 75001 Paris, France</p>
              <p>Téléphone: +33 1 23 45 67 89</p>
            </div>
            <div className="col-md-6">
              <h4>Liens Utiles</h4>
              <ul className="list-unstyled">
                <li><a href="#" className="text-decoration-none text-white">FAQ</a></li>
                <li><Link to="/politique" className="text-decoration-none text-white">Politique de Confidentialité</Link></li> {/* Lien vers Politique de Confidentialité */}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Register;
