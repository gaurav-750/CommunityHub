const express = require("express");

const authRouter = require("./auth.router");
const roleRouter = require("./role.router");
const communityRouter = require("./community.router");
const memberRouter = require("./member.router");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/role", roleRouter);
// router.use("/community", communityRouter);
// router.use("/member", memberRouter);

module.exports = router;
