const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "365d",
    }
  );

  return token;
};

module.exports = { generateToken };
