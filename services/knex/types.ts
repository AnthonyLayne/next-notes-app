export type BaseFieldsBackend = {
  id?: number;
  /** ie. 2022-10-12T00:33:42.412Z */
  created_at?: string;
};

export type BaseFieldsFrontend = {
  id: number;
  /** ie. 2022-10-12T00:33:42.412Z */
  createdAt: string;
};

export type NoteBackend = BaseFieldsBackend & {
  /** ie. 2022-10-12T00:33:42.412Z */
  updated_at?: string;
  archived_at?: string;
  deleted_at?: string;

  title: string;
  description: string;
  user_id?: number;
  pinned?: boolean;
};

export type UserBackend = BaseFieldsBackend & {
  username: string;
  password: string;
};

export type NoteFrontend = BaseFieldsFrontend & {
  /** ie. 2022-10-12T00:33:42.412Z */
  updatedAt?: string;
  archivedAt?: string;
  deletedAt?: string;

  title: string;
  description: string;
  userId: number;
  pinned?: boolean;
};

export type UserFrontend = BaseFieldsFrontend & {
  username: string;
};
