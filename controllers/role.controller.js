const Role = require("../models/role.model");
const Validator = require("validatorjs");

const { Snowflake } = require("@theinternetfolks/snowflake");

module.exports.createRole = async (req, res) => {
  console.log("[Role: Create] received request body: ", req.body);
  const { name } = req.body;

  try {
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
          param,
          message: errorObj[param][0],
          code: "INVALID_INPUT",
        });
      }

      return res.status(400).json(errorResponse);
    }

    // Check if the role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "name",
            message: "Role with this name already exists.",
            code: "DUPLICATE_ENTRY",
          },
        ],
      });
    }

    //create new role
    const newRole = await Role.create({
      id: Snowflake.generate({
        timestamp: Date.now(),
      }),
      name,
    });

    return res.status(200).json({
      status: true,
      content: {
        data: {
          id: newRole.id,
          name,
          created_at: newRole.createdAt,
          updated_at: newRole.updatedAt,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getAllRoles = async (req, res) => {
  const page = req.query.page || 1;
  const limit = 10; //mentioned in the prob statement
  //   const skip = (page - 1)

  try {
    const totalDocuments = await Role.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    const roles = await Role.find()
      .skip(0)
      .limit(limit)
      .select("-_id -__v") //excluding these fields
      .sort({ createdAt: -1 })
      .lean();

    const response = {
      status: true,
      content: {
        meta: {
          total: totalDocuments,
          pages: totalPages,
          page,
        },
        data: roles,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
