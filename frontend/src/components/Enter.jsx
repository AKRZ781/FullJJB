import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

function Enter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName } = location.state || { userName: 'Utilisateur' };

  const handleEnterClick = () => {
    navigate('/home');
  };

  return (
    <div style={{ backgroundColor: '#000235', minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Container className="text-white text-center">
        <Row className="mb-5">
          <Col className="d-flex justify-content-start">
            <img src="/assets/logo.png" alt="logo" style={{ height: '80px' }} />
          </Col>
          <Col className="d-flex justify-content-end">
            <img src="/assets/logofulljjb.png" alt="logo" style={{ height: '80px' }} />
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>Bienvenue sur FULLJJB {userName}!</h1>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <img src="/assets/card1.jpg" alt="Card 1" className="img-fluid" style={{ maxWidth: '50%' }} />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Button onClick={handleEnterClick} className="btn btn-dark">Accéder aux Techniques</Button>
          </Col>
        </Row>
        <Row className="mt-4"></Row> {/* Espace supplémentaire */}
      </Container>
    </div>
  );
}

export default Enter;
