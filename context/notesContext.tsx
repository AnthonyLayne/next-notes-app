import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";

// Services
import { createNote, deleteNote, editNote, getUserNotes } from "services/api";

// Context
import { useAuthContext } from "context/authContext";

// Helpers
import { useSafeContext } from "context/useSafeContext";

// Types
import { NoteFrontend } from "services/knex/types";

export type BaseNotesContext = {
  notes: NoteFrontend[];
  handleCreateNote: (
    { title, description }: Pick<NoteFrontend, "title" | "description">,
    userId: number
  ) => Promise<NoteFrontend>;

  handleEditNote: ({ title, description }: Pick<NoteFrontend, "title" | "description" | "id">) => Promise<NoteFrontend>;
  handleDeleteNote: (id: number) => Promise<null>;
};

const NotesContext = createContext<Maybe<BaseNotesContext>>(undefined);
NotesContext.displayName = "NotesContext";

export const useNotesContext = () => useSafeContext(NotesContext);

type TProps = {
  children: ReactNode;
};

export function NotesContextProviderComponent({ children }: TProps) {
  const { apiInstance, auth } = useAuthContext();
  // new note stat
  // PUT IN COMPONENT FOR ADDING/EDITING A-> const [note, setNote] = useState<Record<string, NoteFrontend>>({});
  const [notes, setNotes] = useState<NoteFrontend[]>([]);

  useEffect(() => {
    if (auth.user?.id) getUserNotes(apiInstance, auth.user.id).then(setNotes);
  }, [auth.user?.id, apiInstance]);

  // eslint-disable-next-line camelcase
  const handleCreateNote = useCallback(
    async (note: Pick<NoteFrontend, "title" | "description">, userId: number) => {
      const createdNote = await createNote(apiInstance, { ...note, userId });
      setNotes((prev) => [...prev, createdNote]);

      return createdNote;
    },
    [apiInstance]
  );

  const handleEditNote = useCallback(
    async (note: Pick<NoteFrontend, "title" | "description" | "id">) => {
      const editedNote = await editNote(apiInstance, note);

      setNotes((prev) =>
        prev.map((n) => {
          if (editedNote.id === n.id) return editedNote;
          return n;
        })
      );

      return editedNote;
    },
    [apiInstance]
  );

  const handleDeleteNote = useCallback(
    async (id: number) => {
      await deleteNote(apiInstance, id);

      setNotes((prev) => prev.filter((n) => id !== n.id));

      return null;
    },
    [apiInstance]
  );

  const ctx = useMemo(
    () => ({
      notes,
      handleCreateNote,
      handleEditNote,
      handleDeleteNote,
    }),
    [notes, handleCreateNote, handleEditNote, handleDeleteNote]
  );

  return <NotesContext.Provider value={ctx}>{children}</NotesContext.Provider>;
}
