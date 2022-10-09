import { useAuthContext } from "context/authContext";

import Link from "next/link";

import styles from "./styles.module.css";

export function Header() {
  const { handleSignOut } = useAuthContext();

  return (
    <div className={styles.headerWrapper}>
      <button type="button" className={styles.signOut} onClick={handleSignOut}>
        Sign Out
      </button>

      <h1 className={styles.noteHeader}>Notes</h1>

      <Link href="/notes" className={styles.primaryButton}>
        <a>View Your Notes </a>
      </Link>

      <Link href="/notes?noteId=0" className={styles.primaryButton}>
        <a>
          <img src="/icons/new-note.svg" alt="" /> new
        </a>
      </Link>
    </div>
  );
}
