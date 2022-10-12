import { useState, ChangeEvent, useMemo, useCallback, useEffect } from "react";
import { toast } from "react-toastify";

// Context
import { useNotesContext } from "context/notesContext";
import { useAuthContext } from "context/authContext";

// Components
import { Input } from "components/common/Input";
import { Button } from "components/common/Button";

// Helpers
import { getDisplayMonthDateAndYear } from "utils/time";
import { getDbTimestamp, getError } from "utils/format";
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
  const {
    auth: { user },
  } = useAuthContext();

  const { handleCreateNote, handleEditNote, notes } = useNotesContext();

  // ------------------------------------------------------------------------------------------------------------------
  const userNote = useMemo(() => notes.find((n) => n.id === noteId), [notes, noteId]);

  const [noteFormState, setNoteFormState] = useState(getDefaultNote(userNote));

  const saveDisabled = useMemo(() => !noteFormState?.title || !noteFormState?.description, [noteFormState]);

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
    async (opts?: { archive: boolean; delete?: undefined } | { archive?: undefined; delete: boolean }) => {
      if (user) {
        try {
          const body = {
            ...noteFormState,
            archivedAt: opts?.archive ? getDbTimestamp() : undefined,
            deletedAt: opts?.delete ? getDbTimestamp() : undefined,
          };

          // Create Note sets the local temporary id to 0
          if (noteId && noteId > 0) await handleEditNote({ ...body, id: noteId });
          else await handleCreateNote(body, user.id);

          setNoteFormState(EMPTY_NOTE);
          await onSave?.();

          toast.success(
            `Note ${noteId === 0 ? "created" : "edited"}${opts ? ` and ${opts.archive ? "archived" : "deleted"}` : ""}.`
          );
        } catch (e: unknown) {
          toast.error(getError(e));
        }
      }
    },
    [user, noteId, noteFormState, handleCreateNote, handleEditNote, onSave]
  );

  return (
    <div className={styles.noteEditorWrapper}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
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
        {(userNote?.updatedAt ?? userNote?.createdAt) && (
          <small>
            {userNote.updatedAt ? "Edited" : "Created"}{" "}
            {getDisplayMonthDateAndYear(new Date(userNote.updatedAt || userNote.createdAt).valueOf())}
          </small>
        )}

        <div className={styles.controls}>
          <div className={styles.left}>
            <Button
              disabled={saveDisabled}
              version="ghost"
              type="button"
              onClick={() => handleSubmit({ archive: true })}
            >
              <img src="/icons/archive.svg" alt="archive" />
            </Button>
            <Button
              disabled={saveDisabled}
              version="ghost"
              type="button"
              onClick={() => handleSubmit({ delete: true })}
            >
              <img src="/icons/trash.svg" alt="delete" />
            </Button>
          </div>

          <Button disabled={saveDisabled} className={styles.saveButton} version="ghost" type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
