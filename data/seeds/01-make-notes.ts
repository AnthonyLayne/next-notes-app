// eslint-disable-next-line import/no-import-module-exports
import { Knex } from "knex";

const notes = [
  {
    id: 1,
    username: "test",
    title: "this is a test",
    description: "it either worked or it didnt lol",
  },
  {
    id: 2,
    username: "test",
    title: "test note 2",
    description: "this is another test note",
  },
  {
    id: 3,
    username: "test2",
    title: "test note 3",
    description: "this is another note",
  },
];
const users = [
  {
    id: 1,
    username: "test",
    password: "testpass",
  },
  {
    id: 2,
    username: "john",
    password: "testpass2",
  },
];

exports.seed = async function seed(knex: Knex) {
  await knex("notes").insert(notes);
  await knex("users").insert(users);
};
