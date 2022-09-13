import axios from "axios";

// Helpers
import { isDev } from "utils/isDev";

// Types
import { NoteFrontend, UserFrontend } from "services/knex/types";
import { PostNoteBody } from "pages/api/notes";
import { PutNoteBody } from "pages/api/notes/[id]";
import { PostUserBody } from "pages/api/users";

// Local
import { PATHS } from "./utils";

const apiAxiosInstance = axios.create({
  baseURL: isDev() ? "http://localhost:3000/api" : "http://next-notes-app-eta.vercel.app/api",
  headers: {
    Accept: "application/vnd.heroku+json; version=3",
  },
});

// Notes------------------------------------------------------------------------------------
export const createNote = async (postBody: PostNoteBody) =>
  apiAxiosInstance.post<NoteFrontend>(PATHS.getNotes(), postBody).then(({ data }) => data);

export const getNoteByUser = async (username: string) =>
  apiAxiosInstance.get<NoteFrontend>(PATHS.getUserNote(username)).then(({ data }) => data);

export const editNote = async (editBody: PutNoteBody, id: string) =>
  apiAxiosInstance.put<NoteFrontend>(PATHS.getNote(id), editBody).then(({ data }) => data);

export const deleteNote = async (id: string) =>
  apiAxiosInstance.delete<undefined>(PATHS.getNote(id)).then(({ data }) => data);
// -----------------------------------------------------------------------------------------

// Users------------------------------------------------------------------------------------
export const getUser = async (id: string) =>
  apiAxiosInstance.get<UserFrontend>(PATHS.getUser(id)).then(({ data }) => data);

export const createUser = async (postBody: PostUserBody) =>
  apiAxiosInstance.post<UserFrontend>(PATHS.getUsers(), postBody).then(({ data }) => data);

export const deleteUser = async (id: string) =>
  apiAxiosInstance.delete<undefined>(PATHS.getUser(id)).then(({ data }) => data);
// -----------------------------------------------------------------------------------------
