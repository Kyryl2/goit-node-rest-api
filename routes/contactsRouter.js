import express from "express";

import {
  validateContactCreation,
  validateContactUpdate,
  validateFavoritePatch,
} from "../middlewares/contactValidate.js";

import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  patchContact,
} from "../controllers/contactsControllers.js";

const router = express.Router();

router.get("/", getAllContacts);
router.get("/:id", getOneContact);
router.delete("/:id", deleteContact);

router.post("/", validateContactCreation, createContact);
router.put("/:id", validateContactUpdate, updateContact);
router.patch("/:id/favorite", validateFavoritePatch, patchContact);

export default router;
