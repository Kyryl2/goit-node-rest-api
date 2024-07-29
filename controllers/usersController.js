import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../schemas/user.js";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import sendEmail from "../utils/sendEmail.js";
import * as authServices from "../services/usersService.js";
const { JWT_SECRET, BASE_URL } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const newUser = await User.create({
      email,
      password: hashedPassword,
      verificationToken,
    });
    const verifyEmail = {
      to: email,
      subject: "Please verify your email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click here to verify your email</a>`,
    };

    await sendEmail(verifyEmail);
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUserByEmail({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found or already verify");
  }
  await authServices.updateUser(
    { _id: user._id },
    { verify: true, verificationToken: "" }
  );
  res.json({
    Status: "200 OK",
    ResponseBody: {
      message: "Verification successfull",
    },
  });
};

export const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUserByEmail({ email });

  if (!user) {
    throw httpError(404, "Email not found");
  }
  if (user.verify) {
    throw httpError(400, "Email already verify");
  }

  const verifyEmail = {
    to: email,
    subject: "Please verify your email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click here to verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email resend successfully",
  });
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    if (!user.verify) {
      return res.status(401).json({ message: "Email not verify" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

export const updateUserSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;

    if (!["starter", "pro", "business"].includes(subscription)) {
      return res.status(400).json({ message: "Invalid subscription type" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { subscription },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const patchAvatarUser = async (req, res, next) => {
  try {
    const { path: oldPath, filename } = req.file;
    const { id } = req.user;
    const newPath = path.join(avatarsPath, filename);
    console.log(newPath);
    await fs.rename(oldPath, newPath);

    await Jimp.read(newPath).then((img) => img.resize(250, 250));

    const avatarURL = path.join("avatars", filename);
    authServices.updateUser({ _id: id }, { avatarURL });

    res.status(200).json({
      avatarURL: `/avatars/${filename}`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
