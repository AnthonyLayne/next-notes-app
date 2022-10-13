import cx from "classnames";

// Styles
import styles from "./styles.module.css";

type TProps = {
  className?: string;
};

export function Spinner({ className }: TProps) {
  return (
    <div className={cx(styles.loader, className)}>
      <div className={styles.spinner} aria-hidden="true" />
    </div>
  );
}
