const express = require("express");
const router = express.Router();
const User = require("../models/User");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const tokenAuth = require("./tokenAuth");

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.find({ username: username });
    if (user == "") {
      res.json({ message: "Username or password is incorrect" });
    } else {
      if (await bcrypt.compare(password, user[0]["password"])) {
        //CREATE AND ASSIGN A TOKEN
        const token = JWT.sign(
          {
            id: user[0]["_id"],
          },
          process.env.TOKEN_SECRET
        );
        res.header("auth-token", token);
        res.json({
          username: user[0]["username"],
          message: "Success",
          token: token,
        });
      } else {
        res.json({ message: "Username or password is incorrect" });
      }
    }
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/register", checkUser, async (req, res) => {
  if (req.body.username.length < 6) {
    return res.json({ message: "Username can not be less than 6 characters" });
  }
  if (req.body.password.length < 3) {
    return res
      .status(400)
      .json({ message: "Password can not be less than 3 characters" });
  }
  //HASH PASS
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    name: req.body.name,
    password: hashedPassword,
  });

  await user
    .save()
    .then((data) => {
      res.json({ data, message: "Success" });
    })
    .catch((error) => {
      res.json({ message: error });
    });
});

router.get("/getusers/", tokenAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users: users });
  } catch (error) {
    res.json({ message: error });
  }
});

async function checkUser(req, res, next) {
  const username = req.body.username;
  try {
    const user = await User.find({ username: username });
    if (user == "") {
      next();
    } else {
      return res.json({ message: "This username is already taken" });
    }
  } catch (err) {
    res.json({ message: err });
  }
}

module.exports = router;
