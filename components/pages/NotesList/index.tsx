import Link from "next/link";
import { useRouter } from "next/router";
import cx from "classnames";

// Context
import { useNotesContext } from "context/notesContext";

// Components
import { NoteModal } from "components/common/NoteModal";

// Styles
import styles from "./styles.module.css";

// TODO: need a hamburger button to appear when hovering over a note, with delete, copy, and label opts inside.
// TODO: when the hamburger icon is clicked a small modal opens

export function NotesList() {
  const { pathname, query } = useRouter();
  const { noteId } = query as { noteId?: string };

  const { notes } = useNotesContext();

  return (
    <>
      <NoteModal noteId={noteId ? Number(noteId) : null} />

      <div className={styles.notesListWrapper}>
        <div className={styles.grid}>
          {notes.map(({ id, title, description }) => (
            <Link href={`${pathname}?noteId=${id}`} key={id}>
              <a className={cx(styles.note, { [styles.hidden]: Number(noteId) === id })}>
                <h4>{title}</h4>
                <p>{description}</p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
