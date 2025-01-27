import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  axios.defaults.headers.post['Content-Type'] = 'application/json';

  const apiUrl = import.meta.env.VITE_API_URL;


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!values.email || !values.password) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, values, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.data.Status === 'Success') {
        localStorage.setItem('token', res.data.token);
        navigate('/enter', { state: { userName: res.data.user.name } });
      } else {
        setErrorMessage(res.data.Error);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.Error || 'Erreur lors de la connexion.');
    }
  };

  return (
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <div
            className="d-flex justify-content-center align-items-center flex-grow-1"
            style={{ backgroundColor: '#000235' }}
        >
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div className="d-flex justify-content-center w-50">
                <img src="/assets/logo.png" alt="logo" />
              </div>
              <div className="d-flex justify-content-center w-50">
                <img src="/assets/logofulljjb.png" alt="logo" />
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              <div
                  className="bg-white p-3 rounded col-12 col-md-8 col-lg-6 mb-4"
                  style={{ maxWidth: '500px', maxHeight: '75vh', overflowY: 'auto' }}
              >
                <div className="w-100 text-center">
                  <h2>Connexion</h2>
                </div>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email">
                      <strong>Email *</strong>
                    </label>
                    <input
                        type="email"
                        placeholder="email"
                        name="email"
                        onChange={(e) => setValues({ ...values, email: e.target.value })}
                        className="form-control rounded-0"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password">
                      <strong>Mot de passe *</strong>
                    </label>
                    <div className="input-group">
                      <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="mot de passe"
                          name="password"
                          onChange={(e) => setValues({ ...values, password: e.target.value })}
                          className="form-control rounded-0"
                      />
                      <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={togglePasswordVisibility}
                      >
                        {showPassword ? 'Masquer' : 'Afficher'}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-dark w-100 rounded-1">
                    Connexion
                  </button>
                  <Link to="/" className="btn btn-dark w-100 rounded-1 mt-2">
                    Accueil
                  </Link>
                  <p>Vous acceptez nos conditions et politiques</p>
                  <Link to="/register" className="btn btn-dark border w-100 rounded-1">
                    S'inscrire
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
        <footer
            className="text-white mt-auto"
            style={{ backgroundColor: 'rgba(7, 1, 8, 0.96)', padding: '20px 0' }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                <h4>Contact</h4>
                <p>Email: fulljjb@gmail.com</p>
                <p>Adresse: 123 Rue Exemple, 75001 Paris, France</p>
                <p>Téléphone: +33 1 23 45 67 89</p>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <h4>Liens Utiles</h4>
                <ul className="list-unstyled">
                  <li>
                    <a href="#" className="text-decoration-none text-white">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <Link to="/politique" className="text-decoration-none text-white">
                      Politique de Confidentialité
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}

export default Login;
