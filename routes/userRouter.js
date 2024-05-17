import express from "express";
import {
  userLogin,
  userRegistratoin,
  userLogout,
  userCurrent,
  userSubscription,
} from "../controllers/userControllers.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", userRegistratoin);

userRouter.post("/login", userLogin);

userRouter.post("/logout", authMiddleware, userLogout);

userRouter.get("/current", authMiddleware, userCurrent);

userRouter.patch("/", authMiddleware, userSubscription);

export default userRouter;
