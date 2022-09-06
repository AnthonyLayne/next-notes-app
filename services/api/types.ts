export type Links = Readonly<{
  self: string;
  next?: string;
  previous?: string;
  last?: string;
  first?: string;
  pageCount?: number;
  totalCount?: number;
}>;

export type ServerResponseError = Error & { Description?: string; ErrorCode?: number } & {
  isAxiosError?: boolean;
  response?: {
    request?: { path: string };
    status: number;
    statusText: string;
    data: { title: string; message: string };
  };
};

export type ApiAxiosResponse<T> = Readonly<{
  data: T;
  success: boolean;
  message: string;
  links: Links;
  jwt: Nullable<string>;
}>;

export type ApiErrorResponse = Readonly<{
  success: boolean;
  message: string;
  links: Links;
  extras?: object;
}>;

export type ApiBadRequestResponse = ApiErrorResponse &
  Readonly<{
    errors?: Object;
  }>;

export type ApiResponse<T> = ApiErrorResponse &
  Readonly<{
    data?: T;
    jwt: string;
  }>;
