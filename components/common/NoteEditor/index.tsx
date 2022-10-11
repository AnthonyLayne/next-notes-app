import { useState, ChangeEvent, useMemo, useCallback, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";

// Context
import { useNotesContext } from "context/notesContext";
import { useAuthContext } from "context/authContext";

// Components
import { Input } from "components/common/Input";

// Types
import { NoteFrontend } from "services/knex/types";

// Styles
import styles from "./styles.module.css";

const EMPTY_NOTE = { title: "", description: "" };

const getDefaultNote = (n: Maybe<NoteFrontend>) => (n ? { title: n.title, description: n.description } : EMPTY_NOTE);

type TProps = {
  noteId?: Nullable<number>;
  onSave?: () => unknown;
};

export function NoteEditor({ noteId, onSave }: TProps) {
  const router = useRouter();

  const {
    auth: { user },
  } = useAuthContext();

  const { handleCreateNote, handleEditNote, notes } = useNotesContext();

  // ------------------------------------------------------------------------------------------------------------------
  const userNote = useMemo(() => notes.find((n) => n.id === noteId), [notes, noteId]);

  const [noteFormState, setNoteFormState] = useState(getDefaultNote(userNote));

  useEffect(() => {
    setNoteFormState(getDefaultNote(userNote));
  }, [userNote]);
  // ------------------------------------------------------------------------------------------------------------------

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
      setNoteFormState((prevState) => ({ ...prevState, [e.target.name]: e.target.value })),
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (user) {
        try {
          // Create Note sets the local temporary id to 0
          if (noteId && noteId > 0) await handleEditNote({ ...noteFormState, id: noteId });
          else await handleCreateNote(noteFormState, user.id);

          setNoteFormState(EMPTY_NOTE);
          await onSave?.();

          router.push("/notes");
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }
    },
    [user, noteId, noteFormState, handleCreateNote, handleEditNote, onSave]
  );

  return (
    <div className={styles.noteEditorWrapper}>
      {/* // TODO: Revist this button having `onSave` */}
      <button type="button" onClick={onSave} className={styles.close}>
        <h3>Close</h3>
      </button>
      <form onSubmit={handleSubmit}>
        <Input
          id="title"
          label="Title"
          ariaLabel="title"
          name="title"
          value={noteFormState?.title}
          onChange={handleChange}
          input={{ type: "text" }}
        />
        <Input
          id="description"
          label="Take a note..."
          ariaLabel="description"
          name="description"
          value={noteFormState?.description}
          onChange={handleChange}
          textarea={{ rows: 12 }}
        />
        <button type="submit" className="primary-button">
          Save
        </button>
      </form>
    </div>
  );
}
