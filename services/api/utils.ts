export const PATHS = {
  userLogin: () => "/auth",
  getUsers: () => "/users",
  getUser: (id: string) => `/users/${id}`,
  getNotes: () => "/notes",
  getNote: (id: string) => `/notes/${id}`,
  getUserNote: (id: string) => `/usernotes/${id}/notes`,
};
