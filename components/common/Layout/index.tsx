import { ReactNode } from "react";

// Components
import { Header } from "components/common/Header";

import styles from "./styles.module.css";

export type TProps = {
  children: ReactNode;
};

export function Layout({ children }: TProps) {
  return (
    <div className={styles.layout}>
      <Header />

      {children}
    </div>
  );
}
