import { createContext, ReactNode, useCallback, useMemo, useState } from "react";

// Services
import { createNote, deleteNote, editNote, getApiAxiosInstance } from "services/api";

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
};

const NotesContext = createContext<Maybe<BaseNotesContext>>(undefined);
NotesContext.displayName = "NotesContext";

export const useNotesContext = () => useSafeContext(NotesContext);

type TProps = {
  children: ReactNode;
};

export function NotesContextProviderComponent({ children }: TProps) {
  const [notes, setNotes] = useState<Record<string, NoteFrontend>>({});

  const apiInstance = useMemo(() => getApiAxiosInstance(), []);

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
