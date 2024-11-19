import React, { useEffect } from 'react';
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
import Politique from './components/Politique';
import { initializeSocket, disconnectSocket } from './socket';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<InfoPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/confirm/:token" element={<ConfirmEmail />} />
        <Route path="/politique" element={<Politique />} />

        {/* Routes protégées */}
        <Route path="/home" element={<AuthWrapper><Home /></AuthWrapper>} />
        <Route path="/add-technique" element={<AuthWrapper><AdminTechnique /></AuthWrapper>} />
        <Route path="/enter" element={<AuthWrapper><Enter /></AuthWrapper>} />
        <Route path="/chat" element={<AuthWrapper><Chat /></AuthWrapper>} />
      </Routes>
    </Router>
  );
}

export default App;
