import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import AdminTechnique from './components/AdminTechnique';
import Enter from './components/Enter';
import InfoPage from './components/InfoPage';
import ConfirmEmail from './components/ConfirmEmail';
import AuthWrapper from './components/AuthWrapper';
import Chat from './components/Chat';
import SocketProvider from './components/SocketProvider';
import Politique from './components/Politique'; // Import de la nouvelle page

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<InfoPage />} />
          <Route path="/home" element={<AuthWrapper><Home /></AuthWrapper>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-technique" element={<AuthWrapper><AdminTechnique /></AuthWrapper>} />
          <Route path="/enter" element={<AuthWrapper><Enter /></AuthWrapper>} />
          <Route path="/confirm/:token" element={<ConfirmEmail />} />
          <Route path="/chat" element={<AuthWrapper><Chat /></AuthWrapper>} />
          <Route path="/politique" element={<Politique />} /> {/* Ajout de la route pour la page de politique */}
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
