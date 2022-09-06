import { db } from "data/db-config";

// Types
import { UserBackend } from "services/knex/types";

// ---- Users ---------------------------------------------------------------------------------------------------------
export const getUserById = async (userId: string) => {
  const userData = await db("users").where("user_id", userId);
  const firstRow = userData[0] as Maybe<UserBackend>;

  return firstRow || null;
};

export const addUser = (userUsername: string, userPassword: string) => {
  return db("users").insert({ username: userUsername, password: userPassword }, "user_id");
};

export const deleteUserById = (userId: number) => {
  return db("users").where("user_id", userId).del();
};
// --------------------------------------------------------------------------------------------------------------------

// ---- Notes ---------------------------------------------------------------------------------------------------------
// Note stuff
// --------------------------------------------------------------------------------------------------------------------
