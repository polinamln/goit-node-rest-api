import HttpError from "../helpers/HttpError.js";
import User from "../models/usersSchema.js";
import { createUserSchema } from "../schemas/userSchemas.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as fs from "node:fs/promises";
import path from "node:path";
import gravatar from "gravatar";
import Jimp from "jimp";

export const userRegistration = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.findOne({ email });
    if (user !== null) {
      res.status(409).json({ message: "Email in use" });
    }
    const avatarURL = gravatar.url(email, { s: "250", r: "pg" });

    const data = {
      email: req.body.email,
      password: passwordHash,
      avatarURL,
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
        avatarURL: registerUser.avatarURL,
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

export const userAvatar = async (req, res, next) => {
  try {
    const { path: imgPath, filename } = req.file;

    const avatar = await Jimp.read(imgPath);

    await avatar.resize(250, 250).writeAsync(imgPath);

    await fs.rename(imgPath, path.resolve("public/avatars", req.file.filename));

    const avatarURL = `/avatars/${filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: avatarURL },
      { new: true }
    );

    if (user === null) {
      return HttpError(401);
    }

    res.status(200).json({ avatarURL: avatarURL });
  } catch (e) {
    next(HttpError(400));
  }
};

export const getAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.avatarURL === null) {
      return res.status(404).json({ message: "No avatar available." });
    }

    const avatarPath = path.resolve("public/avatars", user.avatarURL);
    res.status(200).sendFile(avatarPath);
  } catch (e) {
    next(HttpError(400));
  }
};
