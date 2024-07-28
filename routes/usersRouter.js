import express from "express";
import {
  register,
  login,
  logout,
  getCurrent,
  updateUserSubscription,
  patchAvatarUser,
} from "../controllers/usersController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  validateUserRegistration,
  validateUserLogin,
  validateSubscriptionUpdate,
} from "../middlewares/userValidate.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);
router.post("/logout", authMiddleware, logout);
router.get("/current", authMiddleware, getCurrent);
router.patch(
  "/subscription",
  authMiddleware,
  validateSubscriptionUpdate,
  updateUserSubscription
);
router.patch(
  "/avatar",
  upload.single("avatar"),
  authMiddleware,
  patchAvatarUser
);
export default router;
