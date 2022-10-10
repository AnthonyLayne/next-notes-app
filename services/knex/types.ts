export type BaseFieldsBackend = {
  id?: number;
  created_at?: number;
};

export type BaseFieldsFrontend = {
  id: number;
  createdAt: number;
};

export type NoteBackend = BaseFieldsBackend & {
  updated_at?: number;

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
  updatedAt?: number;

  title: string;
  description: string;
  userId: number;
  pinned?: boolean;
};

export type UserFrontend = BaseFieldsFrontend & {
  username: string;
};
