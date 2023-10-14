const Community = require("../models/community.model");
const Member = require("../models/member.model");
const Role = require("../models/role.model");
const User = require("../models/user.model");

const Validator = require("validatorjs");
const { Snowflake } = require("@theinternetfolks/snowflake");

const addMember = async (req, res) => {
  const signedInUserId = req.body.userId;

  console.log("[Member: Add] received request body: ", req.body);
  const { community, user, role } = req.body; //these are add ids of community, role and user
  //* user - mtlb jise add krna hai

  try {
    // Check if community exists
    const communityDoc = await Community.find({ id: community });
    if (!communityDoc) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "community",
            message: "Community not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }

    //getting the id of community Admin
    const communityAdminRole = await Role.findOne({ name: "Community Admin" });
    console.log("[Member: Add] community admin role: ", communityAdminRole);

    // Check if user has Community Admin role in the community
    const adminMember = await Member.findOne({
      community,
      user: signedInUserId,
      role: communityAdminRole.id,
    });

    console.log("[Member: Add] admin member: ", adminMember);
    if (!adminMember) {
      return res.status(403).json({
        status: false,
        errors: [
          {
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ],
      });
    }

    // Check if role exists
    if (!(await Role.find({ id: role }))) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "role",
            message: "Role not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }

    // Check if user exists
    if (!(await User.find({ id: user }))) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "user",
            message: "User not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }

    // Check if user is already a member of the community
    const existingMember = await Member.findOne({ community, user });
    if (existingMember) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "User is already added in the community.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }

    // Add user as a member to the community with the specified role
    const newMember = new Member({
      id: Snowflake.generate({
        timestamp: Date.now(),
      }),
      community,
      user,
      role,
    });
    await newMember.save();

    console.log("[Member: Add] new member created: ", newMember);

    res.status(200).json({
      status: true,
      content: {
        data: {
          id: newMember.id,
          community: newMember.community,
          user: newMember.user,
          role: newMember.role,
          created_at: newMember.createdAt,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const removeMember = async (req, res) => {
  const memberId = req.params.id; //id of member to be removed
  const signedInUserId = req.body.userId;

  console.log("[Member: Remove] received request body: ", req.body);

  try {
    // Check if member exists
    const member = await Member.find({ id: memberId });
    if (!member) {
      return res.status(400).json({
        status: false,
        errors: [{ message: "Member not found.", code: "RESOURCE_NOT_FOUND" }],
      });
    }
    console.log("[Member: Remove] member found: ", member);

    let communityOfMember = member[0].community;
    // Get the community the member belongs to
    const community = await Community.find({ id: communityOfMember });
    if (!community) {
      return res.status(400).json({
        status: false,
        errors: [
          { message: "Community not found.", code: "RESOURCE_NOT_FOUND" },
        ],
      });
    }

    console.log("[Member: Remove] community found: ", community);

    // Ensure that the signed-in user is the admin of the community
    if (community[0].owner.toString() !== signedInUserId.toString()) {
      return res.status(403).json({
        status: false,
        errors: [
          {
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ],
      });
    }

    // Remove the member
    await Member.deleteOne({ id: memberId });

    return res.status(200).json({
      status: true,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addMember,
  removeMember,
};
