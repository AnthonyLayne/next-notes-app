import { useAuthContext } from "context/authContext";

import Link from "next/link";

import styles from "./styles.module.css";

export function Header() {
  const { handleSignOut } = useAuthContext();

  return (
    <div className={styles.headerWrapper}>
      <h1 className={styles.noteHeader}>Notes</h1>

      <button type="button" className={styles.example} onClick={handleSignOut}>
        Sign Out
      </button>

      <Link href="/notes" className={styles.primaryButton}>
        <a>View Your Notes</a>
      </Link>

      <Link href="/edit" className={styles.primaryButton}>
        <a>+ Create A New Note</a>
      </Link>
    </div>
  );
}
