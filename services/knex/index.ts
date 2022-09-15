import { Knex } from "knex";
// Types
// eslint-disable-next-line import/order
import { BaseFieldsBackend, NoteBackend, UserBackend } from "services/knex/types";
import { getKnex } from "data";

const db: Knex = getKnex();

// Properties must be in {} for insert/update

// ---- Users ---------------------------------------------------------------------------------------------------------
export const getUsername = async (username: string) => {
  const name = await db("users").where("username", username);
  const firstR = name[0] as Maybe<UserBackend>;
  return firstR;
};

export const addUser = async (username: string, password: string) => {
  const newUser = await db("users").insert({ username, password }, ["id", "username"]);
  return newUser[0];
};

export const deleteUserByUsername = (username: string) => {
  return db("users").where("username", username).del();
};
// --------------------------------------------------------------------------------------------------------------------

// ---- Notes ---------------------------------------------------------------------------------------------------------
export const getAllNotesByUsername = async (username: string) => {
  const allUserNotes = await db("notes").where("username", username);

  return allUserNotes || null;
};

export const addNote = async (note: Omit<NoteBackend, keyof BaseFieldsBackend>) => {
  const newNote = await db("notes").insert(note, ["username", "description", "title", "id", "created_at"]);
  return newNote[0];
};

export const editNote = async (id: string, note: Partial<Omit<NoteBackend, keyof BaseFieldsBackend>>) => {
  const updatedNote = await db("notes").where("id", id).update(note, ["id", "title", "description", "created_at"]);
  return updatedNote[0];
};

export const deleteNoteById = async (id: string) => {
  await db("notes").where("id", id).del();
};
// --------------------------------------------------------------------------------------------------------------------
