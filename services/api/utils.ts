export const PATHS = {
  // Auth
  userLogin: () => "/auth" as const,

  // Users
  getUser: (id: string) => `/users/${id}` as const,
  getUserNotes: (id: string) => `/users/${id}/notes` as const,

  // Notes
  getNotes: () => "/notes" as const,
  getNote: (id: string) => `/notes/${id}` as const,
};
