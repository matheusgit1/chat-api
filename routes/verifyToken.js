const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAdmin = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      if(!req.user.isAdmin){
        res.status(401).json("You are not alowed to do that!");
      }
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

module.exports = {verifyToken, verifyTokenAndAdmin}
