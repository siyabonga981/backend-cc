const express = require("express");
const bcrypt = require("bcrypt");
const CommentsSchema = require("../models/Comment");
const router = express.Router();
let mongoId = require("mongoose").Types.ObjectId;

// Get posts route
router.get("/getComments", async (req, res) => {
    const filter = req.query
    CommentsSchema.find(filter , (err, posts) => {
        if (!err) {
            try {
                res.send({ msg: "Comments fetched successfully", posts });
            } catch (error) {
                res.status(500).send();
            }
        } else {
            res.status(500).send();
        }
    });
});

// Add post route
router.post("/addPost", async (req, res) => {
    console.log(req.body);
    let post = req.body;
    try {
        let newPost = new CommentsSchema({
            ...post,
        });
        newPost.save((err, addedPost) => {
            if (!err) {
                res.send({ msg: "Post added successfully", addedPost });
            } else {
                res.status(500).send();
            }
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete post route
router.delete("/deletePost/:id", (req, res) => {
    if (!mongoId.isValid(req.params.id)) {
        res.status(400).send({ msg: "Not a valid Mongo ID" });
    } else {
        CommentsSchema.findByIdAndDelete(req.params.id, async (err, doc) => {
            if (!err) {
                try {
                    res.send({ msg: "Post deleted successfully!" });
                } catch (error) {
                    res.status(500).send(error);
                }
            } else {
                res.status(400).send({ msg: "Error deleting post!" });
            }
        });
    }
});

// Edit post route
router.put("/updatePost/:id", (req, res) => {
    if (!mongoId.isValid(req.params.id)) {
        res.status(400).send({ msg: "Invalid Mongo ID" });
    } else {
        let updatedPost = { ...req.body };
        CommentsSchema.findByIdAndUpdate(
            req.params.id,
            { $set: updatedPost },
            { new: true },
            (err, doc) => {
                if (!err) {
                    res.send({ msg: "Post updated successfully" });
                } else {
                    res.status(400).send({ msg: "Error updating post" });
                }
            }
        );
    }
});

router.get("/checkRole/:postname", async (req, res) => {
    CommentsSchema.find({ postname: req.params.postname }, (err, post) => {
        if (post.length) {
            console.log(post);
            post = post[0];
            try {
                if (["AD", "SU"].includes(post?.role?.id)) {
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

router.get("/getCommentCount", async (req, res) => {
    const filter = req.query;
    CommentsSchema.countDocuments(filter, (err, count) => {
        if (!err) {
            try {
                res.send({ count });
            } catch (error) {
                res.status(500).send();
            }
        } else {
            res.status(500).send();
        }
    });
});


module.exports = router;
