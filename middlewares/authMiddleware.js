import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err /* decodedToken */) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

export { authenticateToken };
