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
  user_id?: string;
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
  userId: string;
  pinned?: boolean;
};

export type UserFrontend = BaseFieldsFrontend & {
  username: string;
};
