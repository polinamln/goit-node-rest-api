import Contact from "../models/contacsSchema.js";

import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
  } catch (e) {
    next(e);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      throw new HttpError(404);
    }
    res.status(200).send(contact);
  } catch (e) {
    next(HttpError(404));
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      throw new HttpError(404);
    }
    res.status(200).send(deletedContact);
  } catch (e) {
    next(HttpError(404));
  }
};

export const createContact = async (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const userData = createContactSchema.validate(data);

  if (userData.error) {
    return res.status(400).json({ message: userData.error.message });
  }

  try {
    const newContact = await Contact.create(userData.value);

    return res.status(201).send(newContact);
  } catch (e) {
    next(e);
  }
};

export const updateContact = async (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const { id } = req.params;

  if (!data.name && !data.email && !data.phone) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  const userData = updateContactSchema.validate(data);

  if (userData.error) {
    return res.status(400).json({ message: userData.error.message });
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, userData.value);

    if (!updatedContact) {
      throw new HttpError(404);
    }
    return res.status(200).send(updatedContact);
  } catch (e) {
    next(HttpError(404));
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const data = {
    favorite: req.body.favorite,
  };

  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, data);
    return res.status(200).send(updatedContact);
  } catch (e) {
    next(HttpError(404));
  }
};
