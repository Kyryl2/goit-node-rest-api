import * as contactService from "../services/contactsService.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    const paginationOptions = {
      page: parseInt(page),
      limit: parseInt(limit),
      favorite: favorite !== undefined ? favorite === "true" : undefined,
    };

    const listedContacts = await contactService.getAllContacts(
      paginationOptions
    );

    if (!listedContacts || listedContacts.length === 0) {
      return res.status(404).json({
        code: 404,
        status: "Contacts not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      data: { contacts: listedContacts },
    });
  } catch (err) {
    next(err);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundContact = await contactService.getOneContact(id);

    if (!foundContact) {
      return res.status(404).json({
        code: 404,
        status: "Contact not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      data: { contact: foundContact },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedContact = await contactService.deleteContact(id);

    if (!removedContact) {
      return res.status(404).json({
        code: 404,
        status: "Contact not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      data: { contact: removedContact },
    });
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const createdContact = await contactService.createContact(
      name,
      email,
      phone,
      favorite
    );

    res.status(201).json({
      code: 201,
      status: "Success",
      data: { contact: createdContact },
    });
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedContact = await contactService.updateContact(id, updates);

    if (!updatedContact) {
      return res.status(404).json({
        code: 404,
        status: "Contact not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      data: { contact: updatedContact },
    });
  } catch (err) {
    next(err);
  }
};

export const patchContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const patchedContact = await contactService.patchContact(id, favorite);

    if (!patchedContact) {
      return res.status(404).json({
        code: 404,
        status: "Contact not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      data: { contact: patchedContact },
    });
  } catch (err) {
    next(err);
  }
};
