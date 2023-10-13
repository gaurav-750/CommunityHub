const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/signup", authController.createUser);
router.post("/login", authController.login);

module.exports = router;
