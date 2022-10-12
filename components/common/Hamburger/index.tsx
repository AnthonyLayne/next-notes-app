import { memo } from "react";
import cx from "classnames";

import styles from "./styles.module.css";

type TProps = {
  handleClick: VoidFunction;
  isOpen: boolean;
  className?: string;
};

export const Hamburger = memo(({ handleClick, isOpen, className }: TProps) => (
  <button className={cx(styles.hamburger, { [styles.active]: isOpen }, className)} type="button" onClick={handleClick}>
    <span className={styles.line} />
    <span className={styles.line} />
    <span className={styles.line} />
  </button>
));
