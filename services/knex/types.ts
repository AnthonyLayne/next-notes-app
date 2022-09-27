export type BaseFieldsBackend = {
  id?: string;
  created_at?: number;
  user_id?: string;
};

export type BaseFieldsFrontend = {
  id: string;
  createdAt: number;
  userId: string;
};

export type NoteBackend = BaseFieldsBackend & {
  title: string;
  description: string;
};

export type UserBackend = BaseFieldsBackend & {
  username: string;
  password: string;
};

export type NoteFrontend = BaseFieldsFrontend & {
  title: string;
  description: string;
};

export type UserFrontend = BaseFieldsFrontend & {
  username: string;
};
