import express from "express";
import {
  register,
  login,
  logout,
  getCurrent,
  updateUserSubscription,
} from "../controllers/usersController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  validateUserRegistration,
  validateUserLogin,
  validateSubscriptionUpdate,
} from "../middlewares/userValidate.js";

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

export default router;
