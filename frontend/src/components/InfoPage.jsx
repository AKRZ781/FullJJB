import React from 'react';
import { Link } from 'react-router-dom';

function InfoPage() {
  return (
    <div className="container-fluid d-flex flex-column p-0 min-vh-100" style={{ backgroundColor: 'rgba(0, 2, 53, 1)' }}>
      <header className="row m-0" style={{ backgroundColor: 'rgba(0, 2, 53, 1)', height: '47px' }}>
        <div className="col-12 d-flex align-items-center justify-content-between">
          <img src="./assets/logo.png" alt="Logo" style={{ height: '47px' }} />
          <div>
            <Link to="/login" className="btn btn-dark me-2">Connexion</Link>
            <Link to="/register" className="btn btn-dark">S'inscrire</Link>
          </div>
        </div>
      </header>

      <section className="row m-0 flex-grow-1 position-relative" style={{ height: '400px', backgroundImage: 'url(./assets/jjb1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="col-12 d-flex align-items-end justify-content-end p-3">
          <div className="text-end">
            <img src="./assets/logofulljjb.png" alt="Main" className="img-fluid me-2" style={{ height: '47px' }} />
            <h3 style={{ color: 'rgba(255, 255, 255, 1)' }}>“Apprendre le Jujitsu Brésilien”</h3>
          </div>
        </div>
      </section>

      <section className="row m-0 my-5 justify-content-center">
        <div className="col-12 col-md-4 d-flex justify-content-center">
          <div className="card shadow-lg" style={{ width: '18rem', backgroundColor: '#0d1b52' }}>
            <img src="./assets/card3.jpg" className="card-img-top" alt="Image jjb" />
            <div className="card-body text-white">
              <h5 className="card-title">Apprendre le jjb</h5>
              <p className="card-text" style={{ whiteSpace: 'pre-line' }}>
                Explorez notre site pour découvrir une sélection de vidéos illustrant différentes techniques.
                Chaque vidéo est accompagnée d'un texte explicatif détaillé pour une meilleure compréhension.
                Notre contenu offre ainsi une approche complète, alliant explications visuelles et informations
                écrites pour une compréhension complète.
              </p>
              <Link to="/register" className="btn btn-dark">S'inscrire</Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 d-flex justify-content-center">
          <div className="card shadow-lg" style={{ width: '18rem', backgroundColor: '#0d1b52' }}>
            <img src="./assets/card2.jpg" className="card-img-top" alt="Image jjb" />
            <div className="card-body text-white">
              <h5 className="card-title"> Progression</h5>
              <p className="card-text" style={{ whiteSpace: 'pre-line' }}>
                Explorez notre plateforme dédiée à la progression personnelle .<br />
                Rejoignez notre espace communautaire exclusif où vous pourrez visionner des vidéos instructives, poser des questions au coach et aux autres membres, et ainsi améliorer vos compétences.<br />
                Engagez-vous dans des discussions enrichissantes.
              </p>
              <Link to="/register" className="btn btn-dark">S'inscrire</Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 d-flex justify-content-center">
          <div className="card shadow-lg" style={{ width: '18rem', backgroundColor: '#0d1b52' }}>
            <img src="./assets/card1.jpg" className="card-img-top" alt="Image jjb" />
            <div className="card-body text-white">
              <h5 className="card-title"> Communauté</h5>
              <p className="card-text" style={{ whiteSpace: 'pre-line' }}>
                Rejoignez notre chat communautaire exclusif, réservé à nos abonnés !<br />
                Cet espace interactif vous permet de vous connecter avec d'autres passionnés comme vous.<br />
                Partagez des idées, posez des questions, échangez des conseils et créez des liens avec une communauté engagée.
              </p>
              <Link to="/register" className="btn btn-dark">S'inscrire</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="row m-0" style={{ backgroundColor: 'rgba(7, 1, 8, 0.96)', color: 'white', padding: '20px 0' }}>
        <div className="col-md-6 text-center">
          <h4>Contact</h4>
          <p>Email: fulljjb@gmail.com | Adresse: 123 Rue Exemple, 75001 Paris, France | Téléphone: +33 1 23 45 67 89</p>
        </div>
        <div className="col-md-6 text-center">
          <h5>Liens Utiles</h5>
          <ul className="list-unstyled">
            <li><a href="#" className="text-decoration-none text-white">FAQ</a></li>
            <li><Link to="/politique" className="text-decoration-none text-white">Politique de Confidentialité</Link></li> {/* Lien vers Politique de Confidentialité */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
