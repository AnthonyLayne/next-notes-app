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

export const getById = async (id: number) => {
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
const NOTE_RETURN_FIELDS = [
  "id",
  "title",
  "description",
  "created_at",
  "updated_at",
  "archived_at",
  "deleted_at",
  "user_id",
];

export const getAllNotesById = async (userId: string) => {
  const allUserNotes = await db("notes").where("user_id", userId);

  return allUserNotes || null;
};

export const addNote = async (note: NoteBackend) => {
  const newNote = await db("notes").insert(note, NOTE_RETURN_FIELDS);
  return newNote[0];
};

// eslint-disable-next-line camelcase
export const editNote = async (id: string, note: Partial<Omit<NoteBackend, keyof BaseFieldsBackend>>) => {
  const updatedNote = await db("notes").where("id", id).update(note, NOTE_RETURN_FIELDS);
  return updatedNote[0];
};

// eslint-disable-next-line camelcase
export const deleteNoteById = async (id: string) => {
  await db("notes").where("id", id).del();
};
// --------------------------------------------------------------------------------------------------------------------
