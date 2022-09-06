import { useEffect } from "react";
import { NextRouter } from "next/router";

const NON_AUTHED_ROUTES = ["/sign-up", "/sign-in"];

export const useRouting = (router: NextRouter) => {
  const { pathname } = router;

  // const { isAuthed } = useUserContext();
  const isAuthed = true;

  useEffect(() => {
    if (!isAuthed && !NON_AUTHED_ROUTES.includes(pathname)) router.push("/sign-in");
  }, [isAuthed, pathname]);
};
