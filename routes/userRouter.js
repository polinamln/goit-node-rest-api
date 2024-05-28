import express from "express";
import {
  userLogin,
  userRegistration,
  userLogout,
  userCurrent,
  userSubscription,
  userAvatar,
  getAvatar,
  userVerification,
  resendVerificationEmail,
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

userRouter.get("/verify/:verificationToken", userVerification);

userRouter.post("/verify", resendVerificationEmail);

export default userRouter;
