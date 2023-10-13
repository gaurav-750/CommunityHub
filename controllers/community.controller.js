const Community = require("../models/community.model");
const Member = require("../models/member.model");
const Role = require("../models/role.model");

const Validator = require("validatorjs");
const { Snowflake } = require("@theinternetfolks/snowflake");

const createCommunity = async (req, res) => {
  console.log("[Community: Create] received request body: ", req.body);
  const { name, userId } = req.body;

  // Define validation rules
  const rules = {
    name: "required|min:2",
  };

  const validation = new Validator(req.body, rules);

  if (validation.fails()) {
    const errorResponse = {
      status: false,
      errors: [],
    };

    const errorObj = validation.errors.all();

    for (let param in errorObj) {
      errorResponse.errors.push({
        param: param,
        message: errorObj[param][0],
        code: "INVALID_INPUT",
      });
    }

    return res.status(400).json(errorResponse);
  }

  //if the name is valid
  try {
    // Create new community
    const newCommunity = new Community({
      id: Snowflake.generate({
        timestamp: Date.now(),
      }),
      name,
      slug: name.toLowerCase().split(" ").join("-"), // converting name to slug format
      owner: userId.toString(),
    });

    await newCommunity.save();
    console.log("[Community: Create] new community created: ", newCommunity);

    // Get the "Community Admin" role
    const communityAdminRole = await Role.findOne({ name: "Community Admin" });

    if (!communityAdminRole) {
      throw new Error("Community Admin role not found");
    }

    // Add the user as the first member with "Community Admin" role
    const newMemberAdmin = await Member.create({
      id: Snowflake.generate({
        timestamp: Date.now(),
      }),
      community: newCommunity.id,
      user: userId,
      role: communityAdminRole.id,
    });

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: newCommunity.id,
          name: newCommunity.name,
          slug: newCommunity.slug,
          owner: userId,
          created_at: newCommunity.createdAt,
          updated_at: newCommunity.updatedAt,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

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
