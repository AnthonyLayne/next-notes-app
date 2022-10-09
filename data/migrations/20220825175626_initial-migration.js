const onUpdateTrigger = (table) => `
  CREATE TRIGGER ${table}_updated_at
  BEFORE UPDATE ON ${table}
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_timestamp();
`;

const ON_UPDATE_TIMESTAMP_FUNCTION = `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
$$ language 'plpgsql';
`;

const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION on_update_timestamp`;

exports.up = async function up(knex) {
  await knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);

  await knex.schema
    .createTable("users", (table) => {
      table.increments("id");
      table.string("username", 120).notNullable().unique();
      table.string("password", 120).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("notes", (table) => {
      table.increments("id").notNullable();
      table.integer("user_id").references("id").inTable("users");
      table.string("title", 200).notNullable();
      table.string("description", 500).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());

      table.boolean("pinned");
      table.timestamp("updated_at");
    })
    .then(() => knex.raw(onUpdateTrigger("notes")));
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("notes");
  await knex.schema.dropTableIfExists("users");

  await knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
};
