const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Object,
    required: true,
  },
  privileges: {
    type: Object,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
