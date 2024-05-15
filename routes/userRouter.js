import express from "express";
import { userLogin, userRegistratoin } from "../controllers/userControllers.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", userRegistratoin);
userRouter.post("/login", userLogin);

export default userRouter;
