const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  published: {
    type: Boolean,
    required: true,
  },
  modifiedBy: {
    type: String,
    required: true,
  },
  modifiedAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("User", CommentsSchema);
