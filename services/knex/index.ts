import { getKnex } from "../../data";

// Types
// eslint-disable-next-line import/order
import { UserBackend } from "services/knex/types";

const db = getKnex();

// ---- Users ---------------------------------------------------------------------------------------------------------
export const getUserById = async (id: string) => {
  const userData = await db("users").where("id", id);
  const firstRow = userData[0] as Maybe<UserBackend>;

  return firstRow || null;
};

export const addUser = (username: string, password: string) => {
  return db("users").insert({ username, password }, "id");
};

export const deleteUserById = (id: string) => {
  return db("users").where("id", id).del();
};
// --------------------------------------------------------------------------------------------------------------------

// ---- Notes ---------------------------------------------------------------------------------------------------------
export const getAllNotesByUsername = async (username: string) => {
  const allUserNotes = await db("notes").where("username", username);

  return allUserNotes || null;
};

export const addNote = (username: string, title: string, description: string) => {
  return db("notes").insert({ username, title, description });
};

export const editNote = (id: string, title: string, description: string) => {
  const updatedNote = db("notes").where("id", id).update(title, description);
  return updatedNote;
};

export const deleteNoteById = (id: string) => {
  return db("notes").where("id", id).del();
};
// --------------------------------------------------------------------------------------------------------------------
