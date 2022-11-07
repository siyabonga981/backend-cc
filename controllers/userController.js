const express = require("express");
const bcrypt = require("bcrypt");
const userSchema = require("../models/User");
const router = express.Router();
let mongoId = require("mongoose").Types.ObjectId;

// Custom login route
router.get("/login", async (req, res) => {
  const user = req.query;
  let filter = {username: user.username};
  let result = await userSchema.find(filter, {"__v": 0});
  if (result.length) {
    console.log(result)
    try {
      let foundUser = result[0];
      if (await bcrypt.compare(user.password, foundUser.password)) {
        res.json({ user: foundUser, msg: "Logged in!" });
      } else {
        res.status(401).send({ msg: "Invalid Credentials!" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  } else if (result.length === 0) {
    res.status(400).send({ msg: "User does not exist!" });
  } else {
    res.status(500).send();
  }
});

// Get all users route
router.get("/getUsers", async (req, res) => {
  userSchema.find({}, (err, users) => {
    if (!err) {
      try {
        res.send(users);
      } catch (error) {
        res.status(500).send();
      }
    } else {
      res.status(500).send();
    }
  });
});

// Add user route
router.post("/addUser", async (req, res) => {
  let user = req.body;
  let filter = { username: user.username };
  let result = await userSchema.find(filter);
  if (result.length) {
    res.status(400).send({ msg: "User already exists!" });
  } else {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      let newUser = new userSchema({
        ...user,
      });
      newUser.save((err, addedUser) => {
        if (!err) {
          res.send({ msg: "User added successfully", addedUser });
        } else {
          res.status(500).send();
        }
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

// Delete user route
router.delete("/deleteUser/:id", (req, res) => {
  if (!mongoId.isValid(req.params.id)) {
    res.status(400).send({ msg: "Not a valid Mongo ID" });
  } else {
    userSchema.findByIdAndDelete(req.params.id, async (err, doc) => {
      if (!err) {
        try {
          res.send({ msg: "User deleted successfully!" });
        } catch (error) {
          res.status(500).send(error);
        }
      } else {
        res.status(400).send({ msg: "Error deleting user!" });
      }
    });
  }
});

// Edit user route
router.put("/editUser/:id", (req, res) => {
  if (!mongoId.isValid(req.params.id)) {
    res.status(400).send({ msg: "Invalid Mongo ID" });
  } else {
    let updatedUser = { ...req.body };
    userSchema.findByIdAndUpdate(
      req.params.id,
      { $set: updatedUser },
      { new: true },
      (err, doc) => {
        if (!err) {
          res.send({ msg: "User updated successfully" });
        } else {
          res.status(400).send({ msg: "Error updating user" });
        }
      }
    );
  }
});

router.get("/checkRole/:username", async (req, res) => {
  userSchema.find({username: req.params.username}, (err, user) => {
    if (user.length) {
      console.log(user)
      user = user[0];
      try {
        if(['AD', 'SU'].includes(user?.role?.id)){
          res.send(true);
        } else {
          res.send(false);
        }
      } catch (error) {
        res.status(500).send();
      }
    } else {
      res.status(500).send();
    }
  });
});
module.exports = router;
