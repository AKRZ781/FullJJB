import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Offcanvas, ListGroup, Button, Container, Row, Col, Dropdown, Modal } from "react-bootstrap";
import { FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import axios from "axios";
import AuthWrapper from "./AuthWrapper";

const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
  const [techniques, setTechniques] = useState([]);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les informations de l'utilisateur connecté
    axios.get(`${apiUrl}/api/auth/whoami`, { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          setIsAdmin(res.data.User.role === 'admin');
        }
      })
      .catch(err => {
        console.error('Erreur lors de la récupération du statut d\'authentification:', err);
        navigate('/login'); // Redirige vers login si l'utilisateur n'est pas authentifié
      });
  }, [navigate]);

  useEffect(() => {
    // Récupérer la liste des techniques
    axios.get(`${apiUrl}/api/techniques`, { withCredentials: true })
      .then(res => {
        setTechniques(res.data);
        if (res.data.length > 0) {
          setSelectedTechnique(res.data[0]);
        }
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des techniques:', err);
      });
  }, []);

  const handleTechniqueClick = (technique) => {
    setSelectedTechnique(technique);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    axios.post(`${apiUrl}/api/auth/logout`, {}, { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          navigate('/login'); // Redirige vers la page de connexion
        } else {
          console.error("Erreur lors de la déconnexion");
        }
      })
      .catch(err => console.error("Erreur lors de la déconnexion :", err));
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const handleHomeClick = () => {
    navigate('/enter');
  };

  return (
    <AuthWrapper>
      <div className="d-flex flex-column" style={{ backgroundColor: '#000235', minHeight: '100vh' }}>
        <Container fluid className="d-flex flex-column" style={{ flexGrow: 1 }}>
          {/* Header */}
          <Row className="text-white p-3 align-items-center">
            <Col xs={12} md={4} className="d-flex align-items-center justify-content-start">
              <div className="d-flex flex-column align-items-start">
                <img src="/assets/logo.png" alt="logo" className="img-fluid mb-2" style={{ height: '80px' }} />
                <button className="btn btn-primary" style={{ backgroundColor: '#000235', borderColor: '#000235', display: 'flex', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold' }} onClick={toggleOffcanvas}>
                  Techniques <FaChevronDown className="ms-2" />
                </button>
              </div>
            </Col>
            <Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
              <button className="btn btn-link text-white mx-2" style={{ fontWeight: 'bold', fontSize: '1.5rem' }} onClick={handleHomeClick}>
                Accueil
              </button>
              <Link to="/chat" className="btn btn-link text-white mx-2" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                Chat
              </Link>
            </Col>
            <Col xs={12} md={4} className="d-flex justify-content-end align-items-center">
              <Dropdown>
                <Dropdown.Toggle as={Button} variant="link" className="text-white mx-2" style={{ fontSize: '1.5rem' }}>
                  <FaSignOutAlt />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" style={{ backgroundColor: '#000235', borderColor: '#000235' }}>
                  <Dropdown.Item as="div" className="text-white" style={{ backgroundColor: '#000235', borderColor: '#000235' }}>
                    <Button variant="primary" style={{ backgroundColor: '#000235', borderColor: '#000235' }} onClick={handleLogout}>Se déconnecter</Button>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <img src="/assets/logofulljjb.png" alt="logo" className="img-fluid" style={{ height: '50px' }} />
            </Col>
          </Row>

          {/* Sidebar Offcanvas */}
          <Offcanvas show={showOffcanvas} onHide={toggleOffcanvas} placement="start" style={{ backgroundColor: '#000235', marginTop: '95px', height: 'calc(100% - 80px)', width: '250px' }}>
            <Offcanvas.Header style={{ backgroundColor: '#000235' }}>
              <Offcanvas.Title style={{ color: 'white' }}>Techniques</Offcanvas.Title>
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={toggleOffcanvas}></button>
            </Offcanvas.Header>
            <Offcanvas.Body style={{ backgroundColor: '#000235' }}>
              <ListGroup>
                {techniques.map(tech => (
                  <ListGroup.Item 
                    key={tech.id} 
                    style={{ backgroundColor: '#000235', color: 'white', cursor: 'pointer' }} 
                    onClick={() => handleTechniqueClick(tech)}
                  >
                    {tech.title}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Offcanvas.Body>
          </Offcanvas>

          {/* Main Content */}
          <Row className="flex-grow-1">
            <Col xs={12} className="d-flex flex-column gap-3 align-items-center">
              {selectedTechnique && (
                <div className="card text-white mb-3" style={{ backgroundColor: '#000235', width: '100%', maxWidth: '800px', border: '3px solid white' }}>
                  <div className="card-header text-center">
                    <h5>{selectedTechnique.title}</h5>
                  </div>
                  <div className="card-body">
                    {selectedTechnique.videoUrl && (
                      <video key={selectedTechnique.videoUrl} controls className="img-fluid mb-3" style={{ width: '100%', height: 'auto', objectFit: 'cover', maxHeight: '400px' }}>
                        <source src={selectedTechnique.videoUrl} type="video/mp4" />
                        Votre navigateur ne supporte pas la balise vidéo.
                      </video>
                    )}
                    <h3 className="card-title text-center">{selectedTechnique.title}</h3>
                    <p className="card-text">{selectedTechnique.description}</p>
                  </div>
                </div>
              )}
            </Col>
          </Row>

          {/* Admin Section */}
          {isAdmin && (
            <Row className="d-flex justify-content-center mb-5" style={{ padding: '20px' }}>
              <Col className="d-flex justify-content-center">
                <Link to="/add-technique" className="btn btn-dark">Ajouter une Technique</Link>
              </Col>
            </Row>
          )}
        </Container>

        {/* Logout Modal */}
        <Modal show={showLogoutModal} onHide={cancelLogout}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation de déconnexion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Êtes-vous sûr de vouloir vous déconnecter ?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelLogout}>
              Annuler
            </Button>
            <Button variant="primary" onClick={confirmLogout}>
              Se déconnecter
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* Footer */}
        <footer className="text-white" style={{ backgroundColor: 'rgba(7, 1, 8, 0.96)', padding: '20px 0' }}>
          <Container>
            <Row>
              <Col md={6} className="text-center mb-3 mb-md-0">
                <h4>Contact</h4>
                <p>Email: fulljjb@gmail.com</p>
                <p>Adresse: 123 Rue Exemple, 75001 Paris, France</p>
                <p>Téléphone: +33 1 23 45 67 89</p>
              </Col>
              <Col md={6} className="text-center">
                <h5>Liens Utiles</h5>
                <ul className="list-unstyled">
                  <li><a href="#" className="text-decoration-none text-white">FAQ</a></li>
                  <li><Link to="/politique" className="text-decoration-none text-white">Politique de Confidentialité</Link></li>
                </ul>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    </AuthWrapper>
  );
}

export default Home;
