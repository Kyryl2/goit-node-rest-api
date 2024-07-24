import Contact from "../schemas/contact.js";

export const getAllContacts = () => {
  return Contact.find();
};

export const getOneContact = (id) => {
  return Contact.findOne({ _id: id });
};

export const createContact = ({ name, email, phone, favorite }) => {
  return Contact.create({ name, email, phone, favorite });
};

export const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate(id, fields, { new: true });
};

export const patchContact = (id, favorite) => {
  return Contact.findByIdAndUpdate(id, { favorite }, { new: true });
};

export const deleteContact = (id) => {
  return Contact.findByIdAndDelete(id);
};
