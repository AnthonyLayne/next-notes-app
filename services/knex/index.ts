import { Knex } from "knex";
// Types
// eslint-disable-next-line import/order
import { BaseFieldsBackend, NoteBackend, UserBackend } from "services/knex/types";
import { getKnex } from "data";

const db: Knex = getKnex();

// Properties must be in {} for insert/update

// ---- Users ---------------------------------------------------------------------------------------------------------
export const getByUsername = async (username: string) => {
  const name = await db("users").where("username", username);
  return name[0] as Maybe<UserBackend>;
};

export const getById = async (id: string) => {
  const name = await db("users").where("id", id);
  return name[0] as Maybe<UserBackend>;
};

export const getHashedPass = async (username: string) => {
  const hp = await db("users").where("username", username).select("password");
  return hp[0].password;
};

export const addUser = async (username: string, password: string) => {
  const newUser = await db("users").insert({ username, password }, ["id", "username", "created_at"]);
  return newUser[0];
};

export const deleteUserById = (id: string) => db("users").where("id", id).del();
// --------------------------------------------------------------------------------------------------------------------

// ---- Notes ---------------------------------------------------------------------------------------------------------
// TODO: getAllNotesById may have to be a join, check data
// eslint-disable-next-line camelcase
export const getAllNotesById = async (user_id: string) => {
  const allUserNotes = await db("notes").where("user_id", user_id);

  return allUserNotes || null;
};

export const addNote = async (note: NoteBackend) => {
  const newNote = await db("notes").insert(note, ["description", "title", "id", "created_at", "user_id"]);
  return newNote[0];
};

// eslint-disable-next-line camelcase
export const editNote = async (id: string, note: Partial<Omit<NoteBackend, keyof BaseFieldsBackend>>) => {
  const updatedNote = await db("notes")
    .where("id", id)
    .update(note, ["id", "title", "description", "created_at", "user_id"]);
  return updatedNote[0];
};

// eslint-disable-next-line camelcase
export const deleteNoteById = async (id: string) => {
  await db("notes").where("id", id).del();
};
// --------------------------------------------------------------------------------------------------------------------
