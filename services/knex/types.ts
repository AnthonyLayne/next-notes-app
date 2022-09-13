export type BaseFieldsBackend = {
  id: string;
  created_at: number;
};

export type BaseFieldsFrontend = {
  id: string;
  createdAt: number;
};

export type NoteBackend = BaseFieldsBackend & {
  username: string;
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
  password: string;
};
