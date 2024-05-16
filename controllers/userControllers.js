import HttpError from "../helpers/HttpError.js";
import User from "../models/usersSchema.js";
import { createUserSchema } from "../schemas/userScemas.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userRegistratoin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.findOne({ email });
    if (user !== null) {
      res.status(409).json({ message: "Email in use" });
    }

    const data = {
      email: req.body.email,
      password: passwordHash,
    };

    const userData = createUserSchema.validate(data);

    if (userData.error) {
      return res.status(400).json(userData.error.message);
    }

    const registerUser = await User.create(userData.value);

    return res.status(201).json({
      user: {
        email: registerUser.email,
        subscription: registerUser.subscription,
      },
    });
  } catch (e) {
    next(HttpError(400));
  }
};

export const userLogin = async (req, res, next) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };

  const userData = createUserSchema.validate(data);
  if (userData.error) {
    return res.status(400).json(userData.error.message);
  }

  try {
    const user = await User.findOne({ email: userData.value.email });

    if (user === null) {
      res.status(401).json({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (isMatch === false) {
      return res.status(400).json(userData.error.message);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await User.findByIdAndUpdate(user._id, { token });

    return res.status(200).json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (e) {
    next(HttpError(401));
  }
};

export const userLogout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (e) {
    next(HttpError(401));
  }
};

export const userCurrent = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (e) {
    next(HttpError(401));
  }
};

export const userSubscription = async (req, res, next) => {
  const subscriptions = ["starter", "pro", "business"];
  const { subscription } = req.body;
  try {
    if (!subscriptions.includes(subscription)) {
      return res.status(400).json({ message: "Invalid subscription" });
    }

    const user = await User.findByIdAndUpdate(req.user.id, { subscription });

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (e) {
    next(HttpError(401));
  }
};
