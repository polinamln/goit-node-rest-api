import express from "express";
import {
  userLogin,
  userRegistration,
  userLogout,
  userCurrent,
  userSubscription,
  userAvatar,
  getAvatar,
} from "../controllers/userControllers.js";
import authMiddleware from "../middleware/auth.js";
import uploadMiddleware from "../middleware/upload.js";

const userRouter = express.Router();

userRouter.post("/register", userRegistration);

userRouter.post("/login", userLogin);

userRouter.post("/logout", authMiddleware, userLogout);

userRouter.get("/current", authMiddleware, userCurrent);

userRouter.patch("/", authMiddleware, userSubscription);

userRouter.patch(
  "/avatars",
  uploadMiddleware.single("avatar"),
  authMiddleware,
  userAvatar
);

userRouter.get("/avatars/:fileName", authMiddleware, getAvatar);

export default userRouter;
