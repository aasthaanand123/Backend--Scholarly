const express = require("express");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
// add a user to database
module.exports.addUser = async (req, res) => {
  try {
    let data = req.body;
    let user = findUser(data.email, data.password);
    if (user) res.json({ status: "already exists" });
    let sign_up = await user.create({
      name: {
        first: data.firstName,
        last: data.lastName,
      },
      email: data.email,
      password: data.password,
      percentage10th: data.percentage10th,
      percentage12th: data.percentage12th,
      percentageUg: data.percentageUg,
      ugDegree: data.ugDegree,
      intendedDegree: data.intendedDegree,
    });
    res.json({ status: "success" });
  } catch (err) {
    console.log(err);
  }
};
//sign in, send a jwt token to client
module.exports.signInUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = findUser(username, password);
    if (!user)
      return res.status(401).json({ message: "Invalid username or password" });
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      "shhh"
    );
    res.json({ token: token });
  } catch (err) {
    console.log(err);
  }
};
//find a user
module.exports.findUser = async (username, password) => {
  try {
    let user = await user.findOne({ username: username, password: password });
    return user;
  } catch (err) {
    console.log(err);
  }
};
