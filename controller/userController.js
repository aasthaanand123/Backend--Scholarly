const express = require("express");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
// add a user to database
module.exports.addUser = async (req, res) => {
  try {
    let data = req.body;
    let users = this.findUsers(data.email, data.password);
    if (users.length > 0) res.json({ status: "already exists" });
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
    const users = await this.findUsers(username, password);
    if (users.length == 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign(
      { userId: users[0]._id, username: users[0].username },
      "shhh"
    );
    res.json({ token: token });
  } catch (err) {
    console.log(err);
  }
};
//find a user
module.exports.findUsers = async (username, password) => {
  try {
    let user_details = await user.find({
      username: username,
      password: password,
    });
    return user_details;
  } catch (err) {
    console.log(err);
  }
};
module.exports.userInfo = async (req, res) => {
  //verify token
  //find out user
  //return user data
  try {
    //installed the express-jwt package
  } catch (err) {
    console.log(err);
  }
};
