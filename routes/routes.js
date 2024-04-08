const express = require("express");
const usercontroller = require("../controller/userController");
const router = express.Router();
router.post("/sign-up", usercontroller.addUser);
router.post("/sign-in", usercontroller.signInUser);
module.exports = router;