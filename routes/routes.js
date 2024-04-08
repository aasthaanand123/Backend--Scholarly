const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
router.post("/sign-up", (req, res) => {}); //create user model, then store credentials after verifying user doesn't already exist
router.post("/sign-in", (req, res) => {
  const { username, password } = req.body;
  const user = userController.findUser(username, password);
  if (!user)
    return res.status(401).json({ message: "Invalid username or password" });
  const token = jwt.sign({ userId: user.id, username: user.username }, "shhh");
  res.json({ token: token });
});
module.exports = router;
