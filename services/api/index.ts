import axios from "axios";

// Helpers
import { isDev } from "utils/isDev";

// Types
import { PostNoteBody } from "pages/api/notes";
import { NoteFrontend } from "services/knex/types";

const apiAxiosInstance = axios.create({
  baseURL: isDev() ? "http://localhost:3000/api" : "http://next-notes-app-eta.vercel.app/api",
  headers: {
    Accept: "application/vnd.heroku+json; version=3",
  },
});

export const createNote = async (postBody: PostNoteBody) =>
  apiAxiosInstance.post<NoteFrontend>("/notes", postBody).then(({ data }) => data);
