// import the jwt
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  //extracts authorization header
  const authHeader = req.headers.authorizition;
  //get actual token from the auth header
  const token = authHeader && authHeader.split(" ")[1];
  // check if no token, return bad request
  if (!token) return res.status(404).json({ error: "Please authenticate" });
  // verify the token
  try {
    // verify the token using the secret key
    const payload = jwt.verify(token, JWT_SECRET);
    // we attach the payload to the request object
    // this is the logged in user

    req.user = payload;
    // proceed to the next route or the function
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.roles)) {
      return res
        .status(403)
        .json({ error: "You are not authorized to access this route" });
    }
  
  };
};
module.exports = { auth, authorizeRoles };
