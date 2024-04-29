import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error(e.message);
    return [];
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((cont) => cont.id === contactId);

    if (typeof contact === "undefined") {
      return null;
    }
    return contact;
  } catch (e) {
    console.error(e.message);
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);

    if (index === -1) {
      return null;
    }

    const removedContact = contacts[index];

    const newContacts = [
      ...contacts.slice(0, index),
      ...contacts.slice(index + 1),
    ];

    await writeContacts(newContacts);

    return removedContact;
  } catch (e) {
    console.error(e);
  }
}

async function addContact({ name, email, phone }) {
  try {
    const contacts = await listContacts();
    const newContact = { id: crypto.randomUUID(), name, email, phone };
    const updatedContacts = [...contacts, newContact];

    await writeContacts(updatedContacts);
    return newContact;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function updateContact(contactId, data) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);

    if (index === -1) {
      return null;
    }

    const updatedContact = { ...contacts[index], ...data };
    contacts[index] = updatedContact;
    writeContacts(contacts);
    return updatedContact;
  } catch (e) {
    console.error(e);
  }
}

export default {
  getContactById,
  removeContact,
  addContact,
  listContacts,
  updateContact,
};
