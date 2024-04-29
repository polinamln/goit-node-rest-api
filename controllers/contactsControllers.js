import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (e) {
    next(e);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await contactsService.getContactById(id);
    if (!contact) {
      throw new HttpError(404);
    }
    res.status(200).json(contact);
  } catch (e) {
    next(HttpError(404));
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedContact = await contactsService.removeContact(id);
    if (!deletedContact) {
      throw new HttpError(404);
    }
    res.status(200).json(deletedContact);
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
    const newContact = await contactsService.addContact(userData.value);

    return res.status(201).json(newContact);
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
    const updatedContact = await contactsService.updateContact(
      id,
      userData.value
    );

    if (!updatedContact) {
      throw new HttpError(404);
    }
    return res.status(200).json(updatedContact);
  } catch (e) {
    next(HttpError(404));
  }
};

//Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404
