import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Photo from '../models/photoModel.js';

const checkErrors = (error) => {
  let errors = {};

  if (error.code === 11000) {
    errors.email = 'The email is already registered';
    return errors;
  }

  if (error.name === 'ValidationError') {
    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return errors;
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    const token = generateAccessToken(user._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = checkErrors(error);
    res.status(400).json(errors);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
      res.redirect('/users/dashboard');
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

const getDashboardPage = async (req, res) => {
  const photos = await Photo.find({ user: req.currentUser._id });
  const user = await User.findById({ _id: req.currentUser._id }).populate([
    'following',
    'followers',
  ]);

  res.render('dashboard', {
    link: 'dashboard',
    photos,
    user,
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.currentUser._id } });
    res.status(200).render('users', {
      users,
      link: 'users',
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

const getAUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    const photos = await Photo.find({ user: user._id });
    res.status(200).render('user', {
      user,
      photos,
      link: 'users',
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

const follow = async (req, res) => {
  const my_id = '62d194755b4f36c1b3805c6b';
  try {
    let user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: { followers: my_id },
      },
      {
        new: true,
      }
    );

    user = await User.findByIdAndUpdate(
      { _id: my_id },
      {
        $push: { following: req.params.id },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      succeeded: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

const unfollow = async (req, res) => {
  const my_id = '62d194755b4f36c1b3805c6b';
  try {
    let user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: { followers: my_id },
      },
      {
        new: true,
      }
    );

    user = await User.findByIdAndUpdate(
      { _id: my_id },
      {
        $pull: { following: req.params.id },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      succeeded: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

export {
  createUser,
  loginUser,
  getDashboardPage,
  getAllUsers,
  getAUser,
  follow,
  unfollow,
};
