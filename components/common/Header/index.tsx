import Link from "next/link";

// Context
import { useAuthContext } from "context/authContext";
import { useSidebarContext } from "context/sidebarContext";
import { useNotesContext } from "context/notesContext";

// Components
import { Input } from "components/common/Input";
import { Button } from "components/common/Button";
import { Hamburger } from "components/common/Hamburger";

import styles from "./styles.module.css";

export function Header() {
  const { handleSignOut } = useAuthContext();
  const { toggleSidebar, sidebarExpanded } = useSidebarContext();
  const { searchString, setSearchString } = useNotesContext();

  return (
    <div className={styles.headerWrapper}>
      <header>
        <Hamburger handleClick={toggleSidebar} isOpen={sidebarExpanded} />

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
          value={searchString}
          onChange={({ target: { value } }) => setSearchString(value)}
          className={styles.search}
          input={{ type: "search" }}
        />

        <Button version="primary" type="button" onClick={handleSignOut}>
          Sign Out
        </Button>
      </header>
    </div>
  );
}
