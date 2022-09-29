import { createContext, ReactNode, useCallback, useMemo, useState, useEffect } from "react";
import axios, { AxiosInstance } from "axios";

// Services
import { checkAuth, loginUser, createUser } from "services/api";

// Helpers
import { useSafeContext } from "context/useSafeContext";
import { getLocal, setLocal } from "utils/storage";
import { isDev } from "utils/isDev";

// Types
import { UserFrontend } from "services/knex/types";
import { AuthUser, AuthResponse } from "pages/api/auth";

const getApiAxiosInstance = (jwt: Maybe<string>) => {
  const apiInstance = axios.create({
    baseURL: isDev() ? "http://localhost:3000/api" : "http://next-notes-app-eta.vercel.app/api",
    headers: {
      Accept: "application/vnd.heroku+json; version=3",
    },
  });

  if (jwt) apiInstance.defaults.headers.common.authorization = `Bearer ${jwt}`;

  return apiInstance;
};

type Auth = {
  initiallyLoading: boolean;
  loggedIn: boolean;
  user: Nullable<UserFrontend>;
};

export type AuthContextType = {
  apiInstance: AxiosInstance;
  auth: Auth;
  handleSignIn: (loginBody: AuthUser) => Promise<void>;
  handleSignUp: (postBody: AuthUser) => Promise<void>;
  handleSignOut: () => void;
};

const AuthContext = createContext<Maybe<AuthContextType>>(undefined);
AuthContext.displayName = "AuthContext";

export const useAuthContext = () => useSafeContext(AuthContext);

type TProps = {
  children: ReactNode;
};

export function AuthContextProviderComponent({ children }: TProps) {
  const [apiInstance, setApiInstance] = useState(() => getApiAxiosInstance(getLocal("auth", { jwt: "" })?.jwt));

  const [auth, setAuth] = useState<Auth>({ initiallyLoading: true, loggedIn: false, user: null });

  const setAuthResponse = useCallback(({ user, jwt }: AuthResponse) => {
    setLocal("auth", { jwt });
    setAuth({ initiallyLoading: false, loggedIn: true, user });
  }, []);

  const handleSignIn = useCallback(
    async (loginBody: AuthUser) => {
      const authRes = await loginUser(apiInstance, loginBody);
      setApiInstance(getApiAxiosInstance(authRes.jwt));
      setAuthResponse(authRes);
    },
    [apiInstance]
  );

  const handleSignUp = useCallback(
    async (postBody: AuthUser) => {
      const authRes = await createUser(apiInstance, postBody);
      setApiInstance(getApiAxiosInstance(authRes.jwt));
      setAuthResponse(authRes);
    },
    [apiInstance]
  );

  const handleSignOut = () => {
    setAuth({ initiallyLoading: false, loggedIn: false, user: null });
    localStorage.clear();
  };

  useEffect(() => {
    checkAuth(apiInstance)
      .then(setAuthResponse)
      .catch(() => setAuth({ initiallyLoading: false, loggedIn: false, user: null }));
  }, []);

  const ctx = useMemo(
    () => ({
      apiInstance,
      auth,
      handleSignIn,
      handleSignUp,
      handleSignOut,
    }),
    [auth, handleSignIn, handleSignUp, handleSignOut]
  );

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
}
