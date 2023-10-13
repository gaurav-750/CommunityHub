const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: null,
      maxlength: 64,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 128,
    },
    password: {
      type: String,
      required: true,
      maxlength: 64,
    },
  },
  {
    timestamps: true, //mongoose will add when the document was created and when it was updated
  }
);

//creating the model
const User = mongoose.model("User", userSchema);
module.exports = User;
