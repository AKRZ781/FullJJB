import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import transporter from '../config/mailConfig.js';

dotenv.config();

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ Error: "Cet e-mail est déjà utilisé." });
    }

    const user = await User.create({ name, email, password: hashedPassword, confirmed: false });

    const token = generateAccessToken({ email, id: user.id });
    const refreshToken = generateRefreshToken({ email, id: user.id });
    const url = `http://localhost:5173/confirm/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmez votre inscription',
      html: `Cliquez <a href="${url}">ici</a> pour confirmer votre inscription.`,
    });

    res.status(200).json({
      Status: "Success",
      Message: "Un email de vérification a été envoyé à votre adresse e-mail. Veuillez vérifier votre e-mail pour confirmer votre inscription.",
      token,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ Error: "Erreur lors de l'enregistrement de l'utilisateur" });
  }
};

export const confirmEmail = async (req, res) => {
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.id, email: decoded.email } });

    if (!user) {
      return res.status(400).json({ Error: "Utilisateur non trouvé" });
    }

    if (user.confirmed) {
      return res.status(200).json({ Status: "AlreadyConfirmed", Message: "Email déjà confirmé" });
    }

    user.confirmed = true;
    await user.save();

    res.status(200).json({ Status: "Success", Message: "Email confirmé avec succès. Vous pouvez maintenant vous connecter." });
  } catch (error) {
    res.status(500).json({ Error: "Erreur lors de la confirmation de l'email" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ Error: "Email incorrect ou non enregistré." });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ Error: "Mot de passe incorrect." });
    }

    if (!user.confirmed) {
      return res.status(401).json({ Error: "Votre email n'a pas été confirmé. Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation." });
    }

    const token = generateAccessToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, name: user.name, role: user.role });

    res.cookie('token', token, { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax',path: '/' });
    res.cookie('refreshToken', refreshToken, { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax',path: '/' });

    res.status(200).json({
      Status: "Success",
      Message: "Connexion réussie",
      user: { name: user.name, id: user.id, role: user.role },
      token,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ Error: "Erreur lors de la connexion" });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  console.log('Déconnexion réussie, cookies supprimés.');
  res.status(200).json({ Status: "Success", Message: "Déconnexion réussie" });
};

export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(403).json({ error: "Accès refusé, token manquant!" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const newAccessToken = generateAccessToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    res.cookie('token', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' });
    res.status(200).json({ Status: "Success", Message: "Token rafraîchi", token: newAccessToken });
  });
};

export const whoAmI = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    console.log('Aucun token trouvé dans les cookies.');
    return res.status(401).json({ Status: "Error", Message: "Non authentifié" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log('Erreur de vérification du token:', err.message);
      return res.status(401).json({ Status: "Error", Message: "Token invalide" });
    }

    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      console.log('Utilisateur introuvable.');
      return res.status(404).json({ Status: "Error", Message: "Utilisateur non trouvé" });
    }

    console.log('Token validé, utilisateur:', decoded);
    return res.status(200).json({ Status: "Success", User: user });
  });
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
    });
    res.status(200).json({ Status: 'Success', Users: users });
  } catch (error) {
    res.status(500).json({ Error: 'Échec de la récupération des utilisateurs' });
  }
};