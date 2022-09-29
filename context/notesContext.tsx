import { createContext, ReactNode, useCallback, useMemo, useState } from "react";

// Services
import { createNote, deleteNote, editNote } from "services/api";

// Context
import { useAuthContext } from "context/authContext";

// Helpers
import { useSafeContext } from "context/useSafeContext";

// Types
import { NoteFrontend } from "services/knex/types";

export type BaseNotesContext = {
  notes: Record<string, NoteFrontend>;
  handleCreateNote: (
    { title, description }: Pick<NoteFrontend, "title" | "description">,
    id: string
  ) => Promise<NoteFrontend>;

  handleEditNote: ({ title, description }: NoteFrontend) => Promise<NoteFrontend>;
  handleDeleteNote: (id: string) => Promise<void>;
  // handleGetNotes: (uid: string) => Promise<NoteFrontend[]>;
};

const NotesContext = createContext<Maybe<BaseNotesContext>>(undefined);
NotesContext.displayName = "NotesContext";

export const useNotesContext = () => useSafeContext(NotesContext);

type TProps = {
  children: ReactNode;
};

export function NotesContextProviderComponent({ children }: TProps) {
  const { apiInstance } = useAuthContext();

  const [notes, setNotes] = useState<Record<string, NoteFrontend>>({});

  // eslint-disable-next-line camelcase
  const handleCreateNote = useCallback(async (note: Pick<NoteFrontend, "title" | "description">, userId: string) => {
    const createdNote = await createNote(apiInstance, { ...note, userId });
    // createNote might actually be in .data again, if so pull out in createNote, not here.
    setNotes((prev) => ({ ...prev, [createdNote.id]: createdNote }));

    return createdNote;
  }, []);

  const handleEditNote = useCallback(async (note: NoteFrontend) => {
    const editedNote = await editNote(apiInstance, note);

    setNotes((prev) => ({ ...prev, [editedNote.id]: editedNote }));

    return editedNote;
  }, []);

  const handleDeleteNote = useCallback(async (id: string) => {
    await deleteNote(apiInstance, id);
  }, []);

  // const handleGetNotes = useCallback(async (uid: string) => {
  //   const userNotes = await getUserNotes(apiInstance, uid);

  //   return userNotes;
  // }, []);

  const ctx = useMemo(
    () => ({
      notes,
      handleCreateNote,
      handleEditNote,
      handleDeleteNote,
      // handleGetNotes,
    }),
    [
      notes,
      handleCreateNote,
      handleEditNote,
      handleDeleteNote,
      // handleGetNostes
    ]
  );

  return <NotesContext.Provider value={ctx}>{children}</NotesContext.Provider>;
}
