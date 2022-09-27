import axios, { AxiosInstance } from "axios";

// Helpers
import { isDev } from "utils/isDev";
import { getLocal } from "utils/storage";

// Types
import { NoteFrontend, UserFrontend } from "services/knex/types";
import { PostNoteBody } from "pages/api/notes";
import { PutNoteBody } from "pages/api/notes/[id]";
import { PostUserBody } from "pages/api/users";

// Local
import { PATHS } from "./utils";

export const getApiAxiosInstance = () => {
  const apiInstance = axios.create({
    baseURL: isDev() ? "http://localhost:3000/api" : "http://next-notes-app-eta.vercel.app/api",
    headers: {
      Accept: "application/vnd.heroku+json; version=3",
    },
  });

  const { jwt } = getLocal("auth", { jwt: "" }) || {};
  if (jwt) apiInstance.defaults.headers.common.authorization = `Bearer ${jwt}`;

  return apiInstance;
};

// Notes------------------------------------------------------------------------------------

// TODO: check all paths and what is getting passed into them
export const createNote = async (apiInstance: AxiosInstance, postBody: PostNoteBody) =>
  apiInstance.post<NoteFrontend>(PATHS.getNotes(), postBody).then(({ data }) => data);

export const getNoteById = async (apiInstance: AxiosInstance, username: string) =>
  apiInstance.get<NoteFrontend>(PATHS.getUserNote(username)).then(({ data }) => data);

export const editNote = async (apiInstance: AxiosInstance, editBody: PutNoteBody) =>
  apiInstance.put<NoteFrontend>(PATHS.getNote(editBody.id), editBody).then(({ data }) => data);

// TODO: check this again
export const deleteNote = async (apiInstance: AxiosInstance, id: string) =>
  apiInstance.delete<undefined>(PATHS.getNote(id)).then(({ data }) => data);
// -----------------------------------------------------------------------------------------

// Users------------------------------------------------------------------------------------
export const checkAuth = async (apiInstance: AxiosInstance) =>
  apiInstance.get<{ user: UserFrontend; jwt: string }>(PATHS.userLogin()).then(({ data }) => data);

export const loginUser = async (apiInstance: AxiosInstance, loginBody: PostUserBody) =>
  apiInstance.post<UserFrontend>(PATHS.userLogin(), loginBody).then(({ data }) => data);

export const getUser = async (apiInstance: AxiosInstance, id: string) =>
  apiInstance.get<UserFrontend>(PATHS.getUser(id)).then(({ data }) => data);

export const createUser = async (apiInstance: AxiosInstance, postBody: PostUserBody) =>
  apiInstance.post<UserFrontend>(PATHS.getUsers(), postBody).then(({ data }) => data);

export const deleteUser = async (apiInstance: AxiosInstance, id: string) =>
  apiInstance.delete<undefined>(PATHS.getUser(id)).then(({ data }) => data);
// -----------------------------------------------------------------------------------------
