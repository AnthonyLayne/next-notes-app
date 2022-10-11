import Link from "next/link";

// Context
import { useAuthContext } from "context/authContext";
import { useSidebarContext } from "context/sidebarContext";

// Components
import { Input } from "../Input";

import styles from "./styles.module.css";

export function Header() {
  const { handleSignOut } = useAuthContext();
  const { toggleSidebar } = useSidebarContext();

  return (
    <div className={styles.headerWrapper}>
      <button type="button" onClick={toggleSidebar}>
        (=)
      </button>

      <h1 className={styles.noteHeader}>Hold</h1>

      <Link href="/notes?noteId=0">
        <a className={styles.newButton}>
          <img src="/icons/new-note.svg" alt="" />
        </a>
      </Link>
      <Input
        id="search"
        name="search"
        ariaLabel="search"
        label="Search"
        value=""
        className={styles.search}
        input={{ type: "search" }}
      />

      <button type="button" className={styles.signOut} onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}
