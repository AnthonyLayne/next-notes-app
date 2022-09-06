// eslint-disable-next-line import/no-import-module-exports
import { Knex } from "knex";

const notes = [
  {
    note_id: 1,
    user_username: "test",
    note_title: "this is a test",
    note_description: "it either worked or it didnt lol",
  },
  {
    note_id: 2,
    user_username: "test",
    note_title: "test note 2",
    note_description: "this is another test note",
  },
  {
    note_id: 3,
    user_username: "test2",
    note_title: "test note 3",
    note_description: "this is another note",
  },
];
const users = [
  {
    user_id: 1,
    user_username: "test",
    user_password: "testpass",
  },
  {
    user_id: 2,
    user_username: "john",
    user_password: "testpass2",
  },
];

exports.seed = async function seed(knex: Knex) {
  await knex("notes").insert(notes);
  await knex("users").insert(users);
};
