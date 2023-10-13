const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      maxlength: 128,
      required: true,
    },

    slug: {
      type: String,
      maxlength: 255,
      unique: true,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the User model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Community = mongoose.model("Community", communitySchema);
module.exports = Community;
