import jwt, { decode } from "jsonwebtoken";
import User from "../models/usersSchema.js";
import HttpError from "../helpers/HttpError.js";

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (typeof authHeader === "undefined") {
    return res.status(401).json({ message: "Not authorized" });
  }

  const [bearer, token] = authHeader.split(" ", 2);

  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).json({ message: "Not authorized" });
    }

    try {
      const user = await User.findById(decode.id);

      if (user === null || user.token !== token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      req.user = {
        id: user._id,
        email: user.email,
      };

      next();
    } catch (e) {
      next(HttpError(401));
    }
  });
}

export default auth;
