import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token; // Récupère le token dans les cookies
  const refreshToken = req.cookies.refreshToken; // Récupère le refreshToken dans les cookies

  if (!token) {
    console.log('Aucun token trouvé dans les cookies.');
    return res.status(403).json({ error: "Accès refusé, aucun token fourni !" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.log('Token expiré, tentative de rafraîchissement...');

        if (!refreshToken) {
          console.error('Aucun refresh token fourni.');
          return res.status(401).json({ error: "Token expiré et aucun refresh token disponible." });
        }

        try {
          const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
          const foundUser = await User.findByPk(decodedRefresh.id);

          if (!foundUser) {
            console.error('Utilisateur non trouvé lors de la vérification du refresh token.');
            return res.status(401).json({ error: "Utilisateur introuvable." });
          }

          const newToken = jwt.sign(
            { id: foundUser.id, email: foundUser.email, name: foundUser.name, role: foundUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          res.cookie('token', newToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            path: '/',
          });
          req.user = jwt.verify(newToken, process.env.JWT_SECRET); // Ajoute l'utilisateur à la requête
          return next();
        } catch (refreshErr) {
          console.error('Erreur lors du rafraîchissement du token :', refreshErr);
          return res.status(401).json({ error: "Refresh token invalide ou expiré." });
        }
      } else {
        console.error('Erreur de vérification du token :', err);
        return res.status(401).json({ error: "Token invalide." });
      }
    }

    req.user = user; // Ajoute l'utilisateur à la requête
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    console.log('Accès refusé : rôle utilisateur non-administrateur.');
    return res.status(403).json({ error: "Accès refusé. Administrateurs uniquement." });
  }
  next();
};
