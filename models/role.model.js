const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true, //mongoose will add when the document was created and when it was updated
  }
);

//creating the model
const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
