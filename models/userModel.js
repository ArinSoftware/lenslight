import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import pkg from 'validator';
const { isEmail, isAlphanumeric } = pkg;

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      lowercase: true,
      validate: [isAlphanumeric, 'Only alphanumeric characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: [isEmail, 'Valid email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [4, 'At least 4 characters'],
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (error, hash) => {
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', userSchema);

export default User;
