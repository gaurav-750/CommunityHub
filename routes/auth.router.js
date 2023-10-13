const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

const { validateToken } = require("../configs/jwt.config");

router.post("/signup", authController.createUser);
router.post("/signin", authController.login);

router.get("/me", validateToken, authController.getProfile);

module.exports = router;
