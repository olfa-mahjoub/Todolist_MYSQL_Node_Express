const { verify } = require("jsonwebtoken");
const handleMessage = require("../helpers");
require("dotenv").config();

/* This is a middleware function that checks if the user has a valid token. */
module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          return handleMessage.unauthorizedResponse(req, res, "invalid token");
        } else {
          next();
        }
      });
    } else {
      return handleMessage.unauthorizedResponse(req, res, "acces denied ! user not autorized");
    }
  },
};
