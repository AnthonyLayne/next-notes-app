import { useState, useCallback } from "react";
import Link from "next/link";
import cx from "classnames";

// Context
import { useSidebarContext } from "context/sidebarContext";

// Styles
import styles from "./styles.module.css";

export function SideBar() {
  const { sidebarExpanded } = useSidebarContext();
  const [temporarilyExpanded, setTemporarilyExpanded] = useState(false);

  const handleTemporaryExpand = useCallback(() => setTemporarilyExpanded(true), []);

  return (
    <div
      className={cx(styles.sideBarWrapper, { [styles.shrink]: !sidebarExpanded && !temporarilyExpanded })}
      onFocus={handleTemporaryExpand}
      onMouseOver={handleTemporaryExpand}
      onMouseLeave={() => setTemporarilyExpanded(false)}
      onBlur={() => setTemporarilyExpanded(false)}
    >
      <Link href="/notes">
        <a>
          <img src="/icons/filled-note.svg" alt="" /> Notes
        </a>
      </Link>
      <Link href="/archive">
        <a>
          <img src="/icons/archive.svg" alt="" /> Archive
        </a>
      </Link>
      <Link href="/trash">
        <a>
          <img src="/icons/trash.svg" alt="" /> Trash
        </a>
      </Link>
    </div>
  );
}
