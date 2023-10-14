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
      type: String,
      ref: "User", // Refers to the User model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//creating a virtual:
//because I want to populate other than _id
// communitySchema.virtual("owners", {
//   ref: "User",
//   localField: "id",
//   foreignField: "id",
// });

const Community = mongoose.model("Community", communitySchema);
module.exports = Community;
