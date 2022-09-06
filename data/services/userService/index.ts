import db from "data/db-config";

export const getAllUsers = () => {
  return db("users");
};

export const getUserById = async (userId: number) => {
  const userData = await db("users").where("user_id", userId);
  const firstRow = userData[0];
  if (!firstRow) return null;
  const user = {
    user_id: firstRow.user_id,
    user_username: firstRow.user_username,
    user_password: firstRow.user_password,
  };
  return user;
};

// const insertUserData = (userData: Partial<User>, returnVals?: (keyof Partial<User>)[]) =>
//   db("users").insert(userData, returnVals || ["*"]);

// insertUserData({ email: "" }, ["email"]);

export const addUser = (userUsername: string, userPassword: string) => {
  return db("users").insert({ user_username: userUsername, user_password: userPassword }, ["user_id"]);
};

export const deleteUserById = (userId: number) => {
  return db("users").where("user_id", userId).del();
};
