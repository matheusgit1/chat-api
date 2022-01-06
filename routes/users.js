const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { verifyToken } = require("./verifyToken")


//update user
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    if (req.params.id != req.user.id) {
      return res.status(401).json({ error: "you don't have permission for that"})
    }
    
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(401).json({error});
      }
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json({error: null, msg: "Account has been updated"});
  } catch (err) {
    return res.status(500).json(err);
  }

});

//delete user
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {

    if (req.params.id != req.user.id) {
      return res.status(401).json({ error: "you don't have permission for that" })
    }
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(200).json({ error: null, msg: "Account has been deleted" });
    }

    await User.findByIdAndDelete(req.user.id);
    return res.status(200).json({ error: null, msg: "Account has been deleted" });
  } catch (error) {
    return res.status(401).json({ error });
  }

});


//get a user
router.get("/", verifyToken, async (req, res) => {

  try {
    const userId = req.user.id
    const username = req.user.username;
    const user = await User.findById(userId, { password: 0, passwordResetToken: 0, passwordResetExpires: 0 })

    res.status(200).json({error: null, user: user});
  } catch (error) {
    res.status(500).json(error);
  }
});

//get friends
router.get("/friends/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params

    if (id != req.user.id) {
      return res.status(401).json({ error: "you don't have permission for that" })
    }
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json({ friendList: friendList })
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user
router.put("/:id/follow", verifyToken, async (req, res) => {

  try {

    if (req.params.id == req.user.id) {
      return res.status(401).json({ error: "you not allowed to do that" })
    }
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!currentUser.followers.includes(req.params.id)) {
      await currentUser.updateOne({ $push: { followers: req.params.id } });
      await user.updateOne({ $push: { followers: req.user.id } });
      return res.status(200).json("user has been followed");
    } else {
      return res.status(401).json("you allready follow this user");
    }
  } catch (error) {
    return res.status(401).json({ error });
  }

});

//unfollow a user

router.put("/:id/unfollow", verifyToken, async (req, res) => {

  try {
    if (req.params.id == req.user.id) {
      return res.status(401).json({ error: "you not allowed to do that" })
    }
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (currentUser.followers.includes(req.params.id)) {
      await currentUser.updateOne({ $pull: { followers: req.params.id } });
      await user.updateOne({ $pull: { followers: req.user.id } });
      res.status(200).json({ error: null, msg: "user has been unfollowed" });
    } else {
      res.status(403).json({ error: null, msg: "you dont follow this user" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

});

module.exports = router;
