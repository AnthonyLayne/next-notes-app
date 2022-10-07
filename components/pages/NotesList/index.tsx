import Link from "next/link";
import { useRouter } from "next/router";

// Context
import { useNotesContext } from "context/notesContext";

// Components
import { NoteModal } from "components/common/NoteModal";

// Styles
// import cx from "classnames";
import styles from "./styles.module.css";

// check query for an id, if id is in query use it to set the modal state to open.
// a button will also set the modal state to open
// For later...

export function NotesList() {
  const router = useRouter();
  const { noteId } = router.query as { noteId?: string };

  const { notes } = useNotesContext();

  return (
    <>
      <NoteModal noteId={Number(noteId)} />

      <div className={styles.notesListWrapper}>
        <h2 className={styles.header}>Your Notes:</h2>

        <span>{noteId}</span>

        <div className={styles.grid}>
          {notes.map((note) => (
            <Link href={`/notes?noteId=${note.id}`} key={note.id}>
              <a className={styles.note}>
                <h4>{note.title}</h4>
                <p>{note.description}</p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

// TODO: list out the users notes
// TODO: create an onclick that opens the note in a modal, where it can be edited
// TODO: modal should have, a close button, that should do a PUT req and close at the same time, and a last edited time
// TODO: see if you can figure out how to pin notes at the top of the list
// TODO: need a delete button, consider a small hamburger icon to appear when hovering over a note, with delete opt inside.
// TODO: when the hamburger icon is clicked a small modal opens
// TODO: need a + button to create a new note
