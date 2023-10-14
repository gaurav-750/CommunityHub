const Community = require("../models/community.model");
const Member = require("../models/member.model");
const Role = require("../models/role.model");
const User = require("../models/user.model");

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

const getAllCommunities = async (req, res) => {
  const page = req.query.page || 1;
  const limit = 10;

  try {
    const totalCommunities = await Community.countDocuments();
    const totalPages = Math.ceil(totalCommunities / limit);

    const skip = (page - 1) * limit;

    const communities = await Community.find()
      .skip(skip)
      .limit(limit)
      .populate({
        path: "owner",
        select: "-_id id name",
        model: User,
        localField: "owner",
        foreignField: "id",
      })
      .select("-_id -__v")
      .lean()
      .sort({ createdAt: -1 });

    //* return the final response - all communities
    const response = {
      status: true,
      content: {
        meta: {
          total: totalCommunities,
          pages: totalPages,
          page: page,
        },
      },

      data: communities,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log("error in getting all communities: ", error);
  }
};

const getMembersOfACommunity = async (req, res) => {
  const communityId = req.params.id;
  console.log("communityId:", communityId);

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const totalMembers = await Member.countDocuments({
      community: communityId,
    });

    const totalPages = Math.ceil(totalMembers / limit);

    const members = await Member.find({ community: communityId })
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: "user",
          select: "-_id id name",
          model: User,
          localField: "user",
          foreignField: "id",
        },
        {
          path: "role",
          select: "-_id id name",
          model: Role,
          localField: "role",
          foreignField: "id",
        },
      ])
      .select("-_id -__v")
      .lean();

    const response = {
      status: true,
      content: {
        meta: {
          total: totalMembers,
          pages: totalPages,
          page,
        },
      },

      data: members,
    };

    return res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const getMyOwnedCommunities = async (req, res) => {
  console.log(
    "[Community: Get My Owned Communities] received request body: ",
    req.body
  );
  const ownerId = req.body.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const totalMembers = await Community.countDocuments({ owner: ownerId });
    const totalPages = Math.ceil(totalMembers / limit);

    const ownedCommunities = await Community.find({ owner: ownerId })
      .skip(skip)
      .limit(limit)
      .select("-_id -__v")
      .lean();

    const response = {
      status: true,
      content: {
        meta: {
          total: totalMembers,
          pages: totalPages,
          page,
        },
      },

      data: ownedCommunities,
    };

    return res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const getMyJoinedCommunities = async (req, res) => {
  //first get the userId from the request body
  const userId = req.body.userId;

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const userMemberships = await Member.find({ user: userId }).select(
      "-_id -__v"
    );

    // Extract community IDs from the member entries
    const communityIds = userMemberships.map(
      (membership) => membership.community
    );

    // Count total communities for the user
    const totalCommunities = await Community.countDocuments({
      id: { $in: communityIds },
    });
    const totalPages = Math.ceil(totalCommunities / limit);

    // Fetch the communities
    const userCommunities = await Community.find({ id: { $in: communityIds } })
      .select("-_id -__v")
      .skip(skip)
      .limit(limit)
      .populate({
        path: "owner",
        select: "-_id id name",
        model: User,
        localField: "owner",
        foreignField: "id",
      })
      .lean();

    const response = {
      status: true,
      content: {
        meta: {
          total: totalCommunities,
          pages: totalPages,
          page,
        },
        data: userCommunities,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createCommunity,
  getAllCommunities,
  getMembersOfACommunity,
  getMyOwnedCommunities,
  getMyJoinedCommunities,
};
