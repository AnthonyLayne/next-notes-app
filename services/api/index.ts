import axios, { AxiosInstance } from "axios";

// Helpers
import { isDev } from "utils/isDev";
import { getLocal } from "utils/storage";

// Types
import { NoteFrontend } from "services/knex/types";
import { PostNoteBody } from "pages/api/notes";
import { PutNoteBody } from "pages/api/notes/[id]";
import { AuthUser, AuthResponse } from "pages/api/auth";

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
export const createNote = async (apiInstance: AxiosInstance, postBody: PostNoteBody) =>
  apiInstance.post<NoteFrontend>(PATHS.getNotes(), postBody).then(({ data }) => data);

export const getUserNotes = async (apiInstance: AxiosInstance, uid: string) =>
  apiInstance.get<NoteFrontend[]>(PATHS.getUserNotes(uid)).then(({ data }) => data);

export const editNote = async (apiInstance: AxiosInstance, editBody: PutNoteBody) =>
  apiInstance.put<NoteFrontend>(PATHS.getNote(editBody.id), editBody).then(({ data }) => data);

export const deleteNote = async (apiInstance: AxiosInstance, id: string) =>
  apiInstance.delete<null>(PATHS.getNote(id)).then(({ data }) => data);
// -----------------------------------------------------------------------------------------

// Users------------------------------------------------------------------------------------
export const checkAuth = async (apiInstance: AxiosInstance) =>
  apiInstance.get<AuthResponse>(PATHS.userLogin()).then(({ data }) => data);

export const loginUser = async (apiInstance: AxiosInstance, loginBody: AuthUser) =>
  apiInstance.put<AuthResponse>(PATHS.userLogin(), loginBody).then(({ data }) => data);

export const createUser = async (apiInstance: AxiosInstance, postBody: AuthUser) =>
  apiInstance.post<AuthResponse>(PATHS.userLogin(), postBody).then(({ data }) => data);

export const deleteUser = async (apiInstance: AxiosInstance, id: string) =>
  apiInstance.delete<null>(PATHS.getUser(id)).then(({ data }) => data);
// -----------------------------------------------------------------------------------------
