const express = require("express");
const router = express.Router();

const memberController = require("../controllers/member.controller");

const { validateToken } = require("../configs/jwt.config");

// create a role
router.post("/", validateToken, memberController.addMember);

//get all roles
router.delete("/:id", validateToken, memberController.removeMember);

module.exports = router;
