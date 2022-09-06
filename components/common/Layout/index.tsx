import { ReactNode } from "react";

import styles from "./index.module.css";

export type TProps = {
  children: ReactNode;
};

export function Layout({ children }: TProps) {
  return (
    <div className={styles.layout}>
      {/* <NavBar /> */}

      {children}
    </div>
  );
}
