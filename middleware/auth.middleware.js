const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model"); // Assurez-vous de spécifier le chemin correct

const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(403).json({ error: "Accès interdit" });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ error: "Non autorisé" });
  }
};

module.exports = { checkUser, requireAuth };
