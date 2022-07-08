import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('TOKEN', token);

    if (token == null) {
      return res.status(401).json({
        succeeded: false,
        error: 'No TOKEN',
      });
    }

    req.user = await User.findById(
      jwt.verify(token, process.env.JWT_SECRET).userId
    );

    next();
  } catch (error) {
    res.status(401).json({
      succeeded: false,
      error: 'Not authorized',
    });
  }
};

export { authenticateToken };
