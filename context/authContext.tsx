import { createContext, ReactNode, useCallback, useMemo, useState, useEffect } from "react";

// Services
import { getApiAxiosInstance, checkAuth, loginUser, createUser } from "services/api";

// Helpers
import { useSafeContext } from "context/useSafeContext";
import { setLocal } from "utils/storage";

// Types
import { UserFrontend } from "services/knex/types";

type Auth = {
  initiallyLoading: boolean;
  loggedIn: boolean;
  user: Nullable<UserFrontend>;
};

export type AuthContextType = {
  auth: Auth;
  handleSignIn: (loginBody: UserFrontend) => Promise<UserFrontend>;
  handleSignUp: (postBody: UserFrontend) => Promise<UserFrontend>;
};

const AuthContext = createContext<Maybe<AuthContextType>>(undefined);
AuthContext.displayName = "AuthContext";

export const useAuthContext = () => useSafeContext(AuthContext);

type TProps = {
  children: ReactNode;
};

export function AuthContextProviderComponent({ children }: TProps) {
  const [auth, setAuth] = useState<Auth>({ initiallyLoading: true, loggedIn: false, user: null });

  const apiInstance = useMemo(() => getApiAxiosInstance(), []);

  const handleSignIn = useCallback((loginBody: UserFrontend) => loginUser(apiInstance, loginBody), [apiInstance]);

  const handleSignUp = useCallback((postBody: UserFrontend) => createUser(apiInstance, postBody), [apiInstance]);

  useEffect(() => {
    checkAuth(apiInstance)
      .then(({ user, jwt }) => {
        setLocal("auth", { jwt });
        setAuth({ initiallyLoading: false, loggedIn: true, user });
      })
      .catch(() => {
        setAuth({ initiallyLoading: false, loggedIn: false, user: null });
      });
  }, []);

  const ctx = useMemo(
    () => ({
      auth,
      handleSignIn,
      handleSignUp,
    }),
    [auth, handleSignIn, handleSignUp]
  );

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
}
