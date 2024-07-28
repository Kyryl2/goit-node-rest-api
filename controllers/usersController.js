import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../schemas/user.js";
import Jimp from "jimp";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

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

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
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
