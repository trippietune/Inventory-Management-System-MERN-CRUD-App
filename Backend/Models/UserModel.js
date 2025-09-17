const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Warehouse Staff', 'System Administrator', 'Order Manager'],
    default: 'Warehouse Staff'
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;