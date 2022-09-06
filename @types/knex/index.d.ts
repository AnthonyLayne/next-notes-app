import { Knex } from "knex";

import { BaseFieldsBackend, NoteBackend, UserBackend } from "services/knex/types";

declare module "knex/types/tables" {
  interface Tables {
    users: Knex.CompositeTableType<
      //
      // This type will be used for the return type and for `where`, `having`, etc. where the full type is required
      UserBackend,
      //
      // This type will be used for the insertion type where the full type excluding automatically generated fields is required
      Omit<UserBackend, keyof BaseFieldsBackend>,
      //
      // This type will be used for update is used for `update` calls where any valid update fields are permissible
      Partial<Omit<UserBackend, keyof BaseFieldsBackend>>
    >;
    notes: Knex.CompositeTableType<
      NoteBackend,
      Omit<NoteBackend, keyof BaseFieldsBackend>,
      Partial<Omit<NoteBackend, keyof BaseFieldsBackend>>
    >;
  }
}
