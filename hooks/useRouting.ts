import { useEffect } from "react";
import { NextRouter } from "next/router";

// Context
import { useAuthContext } from "context/authContext";

const NON_AUTHED_ROUTES = ["/sign-up", "/login"];

export const useRouting = (router: NextRouter) => {
  const { pathname } = router;

  const { auth } = useAuthContext();

  useEffect(() => {
    if (!auth.initiallyLoading) {
      if (
        // If you're not logged in...
        !auth.loggedIn &&
        // ...and you're not on a not-logged-in route...
        !NON_AUTHED_ROUTES.includes(pathname)
      ) {
        // ...go to `/login`
        router.push("/login");
      } else if (
        // Otherwise, if you are logged in...
        auth.loggedIn &&
        // ...and you're on a not-logged-in route...
        NON_AUTHED_ROUTES.includes(pathname)
      ) {
        // ...go to `/notes`
        router.push("/notes");
      }
    }
  }, [auth.loggedIn, pathname]);
};
