const users = [
  {
    id: 234,
    username: "test",
    password: "testpass",
  },
  {
    id: 456,
    username: "john",
    password: "testpass2",
  },
];
const notes = [
  {
    id: 999,
    user_id: 234,
    title: "this is a test",
    description: "it either worked or it didnt lol",
  },
  {
    id: 998,
    user_id: 234,
    title: "test note 2",
    description: "this is another test note",
  },
  {
    id: 997,
    user_id: 456,
    title: "test note 3",
    description: "this is another note",
  },
];

exports.seed = async function seed(knex) {
  await knex("users").insert(users);
  await knex("notes").insert(notes);
};
