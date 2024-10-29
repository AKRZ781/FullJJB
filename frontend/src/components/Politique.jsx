import React from 'react';
import { Link } from 'react-router-dom';

function Politique() {
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
            <div className='p-3 rounded' style={{ width: '60%', marginBottom: '2rem', color: 'white', backgroundColor: '#000235' }}>
              <div className="w-100 text-center">
                <h2>Politique de Confidentialité</h2>
              </div>
              <p>Bienvenue sur notre communauté de chat. En utilisant ce service, vous acceptez la collecte et l'utilisation de vos données personnelles conformément à cette politique de confidentialité.</p>
              <h4>Collecte des données</h4>
              <p>Nous collectons des informations lorsque vous vous inscrivez sur notre site, vous connectez à votre compte, participez à une discussion, et/ou lorsque vous vous déconnectez. Les informations recueillies incluent votre nom, votre adresse e-mail, et d'autres informations que vous fournissez volontairement.</p>
              <h4>Utilisation des données</h4>
              <p>Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :</p>
              <ul>
                <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
                <li>Améliorer notre site web</li>
                <li>Améliorer le service client et vos besoins de prise en charge</li>
                <li>Vous contacter par e-mail</li>
                <li>Administrer un concours, une promotion, ou une enquête</li>
              </ul>
              <h4>Confidentialité des données</h4>
              <p>Nous sommes les seuls propriétaires des informations recueillies sur ce site. Vos informations personnelles ne seront pas vendues, échangées, transférées, ou données à une autre entreprise sans votre consentement, en dehors de ce qui est nécessaire pour répondre à une demande et/ou transaction, comme par exemple pour expédier une commande.</p>
              <h4>Protection des informations</h4>
              <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne. Nous protégeons également vos informations hors ligne. Seuls les employés qui ont besoin d'effectuer un travail spécifique (par exemple, la facturation ou le service à la clientèle) ont accès aux informations personnelles identifiables. Les ordinateurs et serveurs utilisés pour stocker des informations personnelles identifiables sont conservés dans un environnement sécurisé.</p>
              <h4>Consentement</h4>
              <p>En utilisant notre site, vous consentez à notre politique de confidentialité.</p>
              <p>Pour plus d'informations, veuillez nous contacter à <a href="mailto:fulljjb@gmail.com" className="text-white">fulljjb@gmail.com</a>.</p>
              <div className="w-100 text-center">
                <Link to="/" className='btn btn-dark w-50 rounded-1 mt-2'>Retour à l'accueil</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Politique;
