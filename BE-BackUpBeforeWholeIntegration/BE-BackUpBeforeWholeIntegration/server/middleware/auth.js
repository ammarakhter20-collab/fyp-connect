const jwt = require("jsonwebtoken");

const secretKey = process.env.TOKEN_KEY;
const verifyToken = (req, res, next) => {
  // console.log("In middleware auth");
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers?.authorization?.split(" ")[1];

  // console.log("Received token:", token);
  // console.log(secretKey);
  // console.log(req);
  if (!token) {
    return res.status(497).send({
      success: false,
      message: "A token is required for authentication",
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    // Output the decoded token
    // console.log("Decoded Token:", decoded);

    // console.log("Decoded user_id:", decoded.user_id);
    // console.log("In Auth Middleware");
    req.user_id = decoded.user_id;
  } catch (err) {
    console.error("Error verifying token:", err);
    return res
      .status(401)
      .send({ success: false, error: err.message, message: "Invalid token" });
  }
  return next();
};

module.exports = verifyToken;
