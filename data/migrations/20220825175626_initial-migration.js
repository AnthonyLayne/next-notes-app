exports.up = async function up(knex) {
  await knex.schema
    .createTable("notes", (table) => {
      table.increments("id");
      table.string("username", 60).notNullable();
      table.string("title", 200).notNullable();
      table.string("description").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("users", (table) => {
      table.increments("id");
      table.string("username", 60).notNullable();
      table.string("password", 60).notNullable();
    });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("users");
  await knex.schema.dropTableIfExists("notes");
};