import { memo } from "react";

// Types
import { TProps } from ".";

import styles from "./styles.module.css";

export const EmptyLayout = memo(({ children }: TProps) => <div className={styles.layout}>{children}</div>);
