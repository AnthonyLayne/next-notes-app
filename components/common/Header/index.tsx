import { useAuthContext } from "context/authContext";
import { useRouter } from "next/router";

import Link from "next/link";

import styles from "./styles.module.css";

export function Header() {
  const router = useRouter();
  const { auth, handleSignOut } = useAuthContext();

  if (!auth.loggedIn) router.push("/login");
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
