import Link from "next/link";

// Styles
import styles from "./styles.module.css";

export function SideBar() {
  return (
    <div className={styles.sideBarWrapper}>
      <Link href="/notes">
        <a>
          <img src="/icons/filled-note.svg" alt="" /> Notes
        </a>
      </Link>
      <Link href="/archive">
        <a>
          <img src="/icons/archive.svg" alt="" /> Archive
        </a>
      </Link>
      <Link href="/trash">
        <a>
          <img src="/icons/trash.svg" alt="" /> Trash
        </a>
      </Link>
    </div>
  );
}
