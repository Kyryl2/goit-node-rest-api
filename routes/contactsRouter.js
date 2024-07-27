import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  patchContact,
} from "../controllers/contactsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  validateContactCreation,
  validateContactUpdate,
  validateFavoritePatch,
} from "../middlewares/contactValidate.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllContacts);
router.get("/:id", getOneContact);
router.delete("/:id", deleteContact);
router.post("/", validateContactCreation, createContact);
router.put("/:id", validateContactUpdate, updateContact);
router.patch("/:id/favorite", validateFavoritePatch, patchContact);

export default router;
