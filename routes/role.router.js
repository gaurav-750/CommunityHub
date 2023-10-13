const express = require("express");
const router = express.Router();

const roleController = require("../controllers/role.controller");

// create a role
router.post("/", roleController.createRole);

//get all roles
router.get("/", roleController.getAllRoles);

module.exports = router;
