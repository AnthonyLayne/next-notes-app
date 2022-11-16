import { CSSProperties, useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import cx from "classnames";

// Context
import { useSidebarContext } from "context/sidebarContext";
import { useAuthContext } from "context/authContext";

// Helpers
import { getCSSNumberProperty } from "styles/utils";

// Styles
import styles from "./styles.module.css";
import { Button } from "../Button";

const LINKS = [
  { href: "/notes", imgSrc: "/icons/filled-note.svg", name: "Notes" },
  { href: "/notes/archive", imgSrc: "/icons/archive.svg", name: "Archive" },
  { href: "/notes/trash", imgSrc: "/icons/trash.svg", name: "Trash" },
];

export function SideBar() {
  const { pathname, query } = useRouter();
  const literalPathname = pathname.replace("[category]", query.category as string);

  const { handleSignOut } = useAuthContext();
  const { sidebarExpanded } = useSidebarContext();
  const [temporarilyExpanded, setTemporarilyExpanded] = useState(false);

  const handleTemporaryExpand = useCallback(() => setTemporarilyExpanded(true), []);

  // ---- Handle Img Width for Sidebar Collapsed ----------------------------------------------------------------------
  const linkRef = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [shrinkWidth, setShrinkWidth] = useState("0px");

  useEffect(() => {
    const linkPadding = getCSSNumberProperty("padding-left" as keyof CSSProperties, linkRef.current);
    const imgWidth = getCSSNumberProperty("width", imgRef.current);
    setShrinkWidth(`${linkPadding * 2 + imgWidth}px`);
  }, [sidebarExpanded, temporarilyExpanded]);
  // ------------------------------------------------------------------------------------------------------------------
  const width = window.innerWidth;
  const mobileWidth = width <= 701;

  return (
    <nav
      className={
        !mobileWidth
          ? cx(styles.sideBarWrapper, { [styles.shrink]: !sidebarExpanded && !temporarilyExpanded })
          : cx(styles.sideBarWrapper, { [styles.open]: sidebarExpanded })
      }
      style={{ "--shrinkWidth": shrinkWidth }}
      onFocus={handleTemporaryExpand}
      onMouseOver={handleTemporaryExpand}
      onMouseLeave={() => setTemporarilyExpanded(false)}
      onBlur={() => setTemporarilyExpanded(false)}
    >
      <ul>
        {LINKS.map(({ href, imgSrc, name }, i) => (
          <Link key={href} href={href}>
            <li>
              <a
                ref={i === 0 ? linkRef : null}
                className={cx(styles.link, { [styles.selected]: href === literalPathname })}
              >
                <img ref={i === 0 ? imgRef : null} src={imgSrc} alt="" />
                {name}
              </a>
            </li>
          </Link>
        ))}

        <Button className={styles.signOut} version="primary" type="button" onClick={handleSignOut}>
          Sign Out
        </Button>
      </ul>
    </nav>
  );
}
