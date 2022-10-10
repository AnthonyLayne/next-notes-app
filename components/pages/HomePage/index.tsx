import { memo } from "react";
import Link from "next/link";

import styles from "./styles.module.css";

export const HomePage = memo(() => {
  return (
    <div className={styles.homeWrapper}>
      <h1 className={styles.title}>Welcome to Hold</h1>

      <Link href="/login">
        <a className={styles.signIn}>Sign In</a>
      </Link>
      <h3>or</h3>
      <Link href="/sign-up">
        <a className={styles.signUp}>Sign Up</a>
      </Link>
    </div>
  );
});
