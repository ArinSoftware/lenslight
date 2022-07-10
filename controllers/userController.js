import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    const token = generateAccessToken(user._id);
    console.log('TOKEN register', token);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    /*     res.status(201).json({
      succeeded: true,
      user,
    }); */
    res.redirect('/login');
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    let same = false;

    if (user) {
      same = await bcrypt.compare(password, user.password);
    } else {
      return res.status(401).json({
        succeeded: false,
        error: 'There is no such user',
      });
    }

    if (same) {
      const token = generateAccessToken(user._id);
      console.log('TOKEN login', token);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
      res.redirect('/users/dashboard');
      /*       res.status(200).json({
        user,
        
      }); */
    } else {
      res.status(401).json({
        succeeded: false,
        error: 'Password not matched',
      });
    }
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

const getDashboardPage = (req, res) => {
  console.log('REQ USER', req.user);
  res.render('dashboard', {
    link: 'dashboard',
  });
};

export { createUser, loginUser, getDashboardPage };
