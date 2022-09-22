exports.up = async function up(knex) {
  await knex.schema
    .createTable("users", (table) => {
      table.increments("id");
      table.string("username", 120).notNullable().unique();
      table.string("password", 120).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("notes", (table) => {
      // TODO: Fix duplicate key error, note_id is clashing with id.
      table.increments("note_id").notNullable();
      table.integer("id").references("id").inTable("users");
      table.string("title", 200).notNullable();
      table.string("description", 500).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("notes");
  await knex.schema.dropTableIfExists("users");
};
