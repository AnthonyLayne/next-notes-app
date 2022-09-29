import { AxiosInstance } from "axios";

// Types
import { NoteFrontend } from "services/knex/types";
import { PostNoteBody } from "pages/api/notes";
import { PutNoteBody } from "pages/api/notes/[id]";
import { AuthUser, AuthResponse } from "pages/api/auth";

// Local
import { SuccessResponse } from "utils/api";
import { PATHS } from "./utils";

// Notes------------------------------------------------------------------------------------
export const createNote = async (apiInstance: AxiosInstance, postBody: PostNoteBody) =>
  apiInstance.post<SuccessResponse<NoteFrontend>>(PATHS.getNotes(), postBody).then(({ data }) => data.data);

export const getUserNotes = async (apiInstance: AxiosInstance, uid: string) =>
  apiInstance.get<SuccessResponse<NoteFrontend[]>>(PATHS.getUserNotes(uid)).then(({ data }) => data.data);

export const editNote = async (apiInstance: AxiosInstance, editBody: PutNoteBody) =>
  apiInstance.put<SuccessResponse<NoteFrontend>>(PATHS.getNote(editBody.id), editBody).then(({ data }) => data.data);

export const deleteNote = async (apiInstance: AxiosInstance, id: string) =>
  apiInstance.delete<SuccessResponse<null>>(PATHS.getNote(id)).then(({ data }) => data.data);
// -----------------------------------------------------------------------------------------

// Users------------------------------------------------------------------------------------
export const checkAuth = async (apiInstance: AxiosInstance) =>
  apiInstance.get<SuccessResponse<AuthResponse>>(PATHS.userLogin()).then(({ data }) => data.data);

export const loginUser = async (apiInstance: AxiosInstance, loginBody: AuthUser) =>
  apiInstance.put<SuccessResponse<AuthResponse>>(PATHS.userLogin(), loginBody).then(({ data }) => data.data);

export const createUser = async (apiInstance: AxiosInstance, postBody: AuthUser) =>
  apiInstance.post<SuccessResponse<AuthResponse>>(PATHS.userLogin(), postBody).then(({ data }) => data.data);

export const deleteUser = async (apiInstance: AxiosInstance, id: string) =>
  apiInstance.delete<SuccessResponse<null>>(PATHS.getUser(id)).then(({ data }) => data.data);
// -----------------------------------------------------------------------------------------
