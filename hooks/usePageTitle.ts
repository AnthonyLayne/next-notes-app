import { useState, useEffect } from "react";
import { NextRouter } from "next/router";

const DEFAULT_TITLE = "Notes App";

// Make sure the array elements are in the correct order (complex items before simple ones)
// so that the `includes` doesn't trigger too early
const PAGE_TITLE_ROUTE_MAP = [
  { routeTo: "/create", pageTitle: "Create Note" },
  { routeTo: "/sign-up", pageTitle: "Sign Up" },
  { routeTo: "/sign-in", pageTitle: "Sign In" },
  { routeTo: "/", pageTitle: DEFAULT_TITLE },
] as const;

export const usePageTitle = (router: NextRouter) => {
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    let newPageTitle = "";
    const validPageTitle = PAGE_TITLE_ROUTE_MAP.find((each) => router.pathname.includes(each.routeTo));

    if (validPageTitle) {
      newPageTitle = validPageTitle.pageTitle;
      setPageTitle(newPageTitle);
    } else {
      setPageTitle(DEFAULT_TITLE);
    }
  }, [router.asPath]);

  return pageTitle;
};
