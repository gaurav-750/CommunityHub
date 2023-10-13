const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const { Snowflake } = require("@theinternetfolks/snowflake");
const { generateToken } = require("../configs/jwt.config");

module.exports.createUser = async (req, res) => {
  console.log("[Auth: Signup] received request body: ", req.body);

  try {
    const { name, email, password } = req.body;

    //checking if user already exists
    let userIfExists = await User.findOne({ email: req.body.email });
    if (userIfExists) {
      return res.json({
        status: false,
        errors: [
          {
            param: "email",
            message: "User with this email address already exists.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }

    //validating input & password
    let errors = [];
    if (name.length < 2) {
      errors.push({
        param: "name",
        message: "Name should be at least 2 characters.",
        code: "INVALID_INPUT",
      });
    }

    if (password.length < 2) {
      errors.push({
        param: "password",
        message: "Password should be at least 2 characters.",
        code: "INVALID_INPUT",
      });
    }

    //if there are any validation errors
    if (errors.length > 0) {
      return res.json({
        status: false,
        errors,
      });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    console.log("[Auth: Signup] hashed password: " + hashPassword);

    //creating user
    let user = await User.create({
      id: Snowflake.generate({
        timestamp: Date.now(),
      }),
      name,
      email,
      password: hashPassword,
    });
    console.log("[Auth: Signup] created user: ", user);

    //generating token
    const token = await generateToken(user);
    console.log("[Auth: Signup] generated token: " + token);

    //saving user token
    const data = user.toObject();
    data.token = token;
    console.log("[Auth: Signup] saved user token: ", data);

    return res.json({
      status: true,
      content: {
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
          createdAt: data.createdAt,
        },
        meta: {
          access_token: data.token,
        },
      },
    });
  } catch (error) {
    console.log("[Auth: Signup] An Error Occured: ", error);
  }
};

module.exports.login = async (req, res) => {};
