const Community = require("../models/community.model");
const Member = require("../models/member.model");

const Validator = require("validatorjs");
const { Snowflake } = require("@theinternetfolks/snowflake");

const createCommunity = async (req, res) => {};

const getAllCommunities = async (req, res) => {};

const getMembersOfACommunity = async (req, res) => {};

const getMyOwnedCommunities = async (req, res) => {};

const getMyJoinedCommunities = async (req, res) => {};

module.exports = {
  createCommunity,
  getAllCommunities,
  getMembersOfACommunity,
  getMyOwnedCommunities,
  getMyJoinedCommunities,
};
