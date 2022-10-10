import { useAuthContext } from "context/authContext";
import Link from "next/link";

// Components
import { Input } from "../Input";

import styles from "./styles.module.css";

export function Header() {
  const { handleSignOut } = useAuthContext();

  return (
    <div className={styles.headerWrapper}>
      <h1 className={styles.noteHeader}>Hold</h1>

      <Link href="/notes?noteId=0">
        <a className={styles.newButton}>
          <img src="/icons/new-note.svg" alt="" />
        </a>
      </Link>
      <Input type="search" autoComplete="on" id="search" name="search" labelText="Search" className={styles.search} />

      <button type="button" className={styles.signOut} onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}
