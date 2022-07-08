import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

const createUser = async (req, res) => {
  try {
    console.log('REQ.BODY', req.body);

    const user = await User.create(req.body);
    res.status(201).json({
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
      res.status(200).send('YOU ARE LOGGED IN');
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

export { createUser, loginUser };
