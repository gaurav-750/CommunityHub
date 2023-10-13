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

function validateToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  let token;

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    token = bearer[1];
  }

  if (!token) {
    console.log("[jwt: validateToken] token not found");
    return res.json({
      status: false,
      errors: [
        {
          message: "Token required!",
          code: "NO_TOKEN",
        },
      ],
    });
  }
  console.log("[jwt: validateToken] token retrived ");

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.body.userId = user.id;

    console.log("[jwt: validateToken] user found");
  } catch (err) {
    console.log(
      "[jwt: validateToken] error while authenticating using token" + err
    );
    return res.json({
      status: false,
      errors: [
        {
          message: "You need to sign in to proceed.",
          code: "NOT_SIGNEDIN",
        },
      ],
    });
  }

  return next();
}

module.exports = { generateToken, validateToken };
