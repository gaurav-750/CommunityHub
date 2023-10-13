const express = require("express");
const router = express.Router();

const communityController = require("../controllers/community.controller");

const { validateToken } = require("../configs/jwt.config");

router.post("/", validateToken, communityController.createCommunity);

router.get("/", communityController.getAllCommunities);

router.get(":id/members", communityController.getMembersOfACommunity);

router.get(
  "/me/owner",
  validateToken,
  communityController.getMyOwnedCommunities
);

router.get(
  "me/member",
  validateToken,
  communityController.getMyJoinedCommunities
);

module.exports = router;
