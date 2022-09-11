// Types
import { NoteFrontend } from "services/knex/types";

export const createNote = async (note: Pick<NoteFrontend, "title" | "description">) => {
  return { id: "wahtever", createdAt: 1, ...note };
};
// Put Axios ops here?
