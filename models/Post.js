const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  photos: {
    type: Array,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    required: true,
  },
  modifiedBy: {
    type: String,
    required: false,
  },
  modifiedAt: {
    type: String,
    required: false,
  },
  owner: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Post", PostSchema);
