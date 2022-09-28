import { createContext, ReactNode, useCallback, useMemo, useState, useEffect } from "react";

// Services
import { getApiAxiosInstance, checkAuth, loginUser, createUser } from "services/api";

// Helpers
import { useSafeContext } from "context/useSafeContext";
import { setLocal } from "utils/storage";

// Types
import { UserFrontend } from "services/knex/types";
import { AuthUser, AuthResponse } from "pages/api/auth";

type Auth = {
  initiallyLoading: boolean;
  loggedIn: boolean;
  user: Nullable<UserFrontend>;
};

export type AuthContextType = {
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
  const [auth, setAuth] = useState<Auth>({ initiallyLoading: true, loggedIn: false, user: null });

  const apiInstance = useMemo(() => getApiAxiosInstance(), []);

  const setAuthResponse = useCallback(({ user, jwt }: AuthResponse) => {
    setLocal("auth", { jwt });
    setAuth({ initiallyLoading: false, loggedIn: true, user });
  }, []);

  const handleSignIn = useCallback(
    async (loginBody: AuthUser) => {
      const authRes = await loginUser(apiInstance, loginBody);
      setAuthResponse(authRes);
    },
    [apiInstance]
  );

  const handleSignUp = useCallback(
    async (postBody: AuthUser) => {
      const authRes = await createUser(apiInstance, postBody);
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
      auth,
      handleSignIn,
      handleSignUp,
      handleSignOut,
    }),
    [auth, handleSignIn, handleSignUp, handleSignOut]
  );

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
}
