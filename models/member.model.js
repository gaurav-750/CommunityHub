const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    community: {
      type: String, //will be snowflake id
      ref: "Community", // Refers to the Community model
      required: true,
    },

    user: {
      type: String, //will be snowflake id
      ref: "User", // Refers to the User model
      required: true,
    },

    role: {
      type: String, //will be snowflake id
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
