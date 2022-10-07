import { useState, ChangeEvent, useMemo, useCallback } from "react";
// import { useRouter } from "next/router";

// Context
import { useNotesContext } from "context/notesContext";
import { useAuthContext } from "context/authContext";

const EMPTY_NOTE = { title: "", description: "" };

type TProps = {
  noteId?: number;
};

export function NoteEditor({ noteId }: TProps) {
  // const router = useRouter();

  const {
    auth: { user },
  } = useAuthContext();

  const { handleCreateNote, handleEditNote, notes } = useNotesContext();

  const userNote = useMemo(() => notes.find((n) => n.id === noteId), [notes, noteId]);
  // console.log("THIS--->", userNote);
  const [noteFormState, setNoteFormState] = useState(
    userNote ? { title: userNote.title, description: userNote.description } : EMPTY_NOTE
  );
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
      setNoteFormState((prevState) => ({ ...prevState, [e.target.name]: e.target.value })),
    []
  );

  const handleSubmit = useCallback(async () => {
    if (user) {
      if (noteId) await handleEditNote({ ...noteFormState, id: noteId });
      else await handleCreateNote(noteFormState, user.id);
    }
    // clear state
  }, [user, noteId, noteFormState, handleCreateNote, handleEditNote]);

  return (
    <div className="noteEditorWrapper">
      <form onSubmit={handleSubmit}>
        <h3>{userNote ? "Edit" : "Create"} Note:</h3>
        <input name="title" value={noteFormState?.title} placeholder="New Note" onChange={handleChange} />
        <textarea
          name="description"
          value={noteFormState?.description}
          placeholder="Note Content"
          rows={12}
          onChange={handleChange}
        />
        <button type="submit" className="primary-button">
          Save
        </button>
      </form>
    </div>
  );
}
