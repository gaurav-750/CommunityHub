const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId, // Assuming ObjectId for the community model
      ref: "Community", // Refers to the Community model
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId, // Assuming ObjectId for the user model
      ref: "User", // Refers to the User model
      required: true,
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

memberSchema.index({ community: 1, user: 1 }, { unique: true });
const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
