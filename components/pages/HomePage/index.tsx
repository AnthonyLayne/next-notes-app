import { memo } from "react";
import Link from "next/link";

import styles from "./styles.module.css";

export const HomePage = memo(() => {
  return (
    <>
      <h1>Welcome to NOTES</h1>
      <h3>Please:</h3>
      <Link href="/login">
        <a className={styles.example}>Sign In</a>
      </Link>
      <h3>or</h3>
      <Link href="/">
        <a className={styles.example}>Sign Up</a>
      </Link>
    </>
  );
});
