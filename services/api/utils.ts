export const PATHS = {
  // Auth
  userLogin: () => "/auth" as const,

  // Users
  getUser: (id: number) => `/users/${id}` as const,
  getUserNotes: (id: number) => `/users/${id}/notes` as const,

  // Notes
  getNotes: () => "/notes" as const,
  getNote: (id: number) => `/notes/${id}` as const,
};
