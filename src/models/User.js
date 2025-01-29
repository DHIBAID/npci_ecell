// models/User.js
const mongoose = require('mongoose');
const { encrypt, hmac, hashPassword } = require('../utils/encryption');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  emailHash: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'seller', 'admin'], required: true },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('email')) {
    this.emailHash = hmac(this.email);
    this.email = encrypt(this.email);
  }

  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }

  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
