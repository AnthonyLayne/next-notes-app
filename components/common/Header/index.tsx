import Link from "next/link";

import styles from "./index.module.css";

export function Header() {
  return (
    <div className={styles.headerWrapper}>
      <h1 className={styles.noteHeader}>Notes</h1>

      <Link href="/notes" className={styles.primaryButton}>
        <a>View Your Notes</a>
      </Link>

      <Link href="/edit" className={styles.primaryButton}>
        <a>+ Create A New Note</a>
      </Link>
    </div>
  );
}
