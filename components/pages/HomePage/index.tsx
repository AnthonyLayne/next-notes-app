import { memo } from "react";
import Link from "next/link";

import styles from "./styles.module.css";

export const HomePage = memo(() => {
  return (
    <>
      <Link href="/">
        <a className={styles.example}>Example</a>
      </Link>
      <Link href="/">Example2</Link>
    </>
  );
});
