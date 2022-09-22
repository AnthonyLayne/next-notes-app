import { createContext, ReactNode, useCallback, useMemo, useState } from "react";

// Services
import { createNote, getApiAxiosInstance } from "services/api";

// Helpers
import { useSafeContext } from "context/useSafeContext";

// Types
import { NoteFrontend } from "services/knex/types";

export type BaseNotesContext = {
  notes: Record<string, NoteFrontend>;
  handleCreateNote: (
    { title, description }: Pick<NoteFrontend, "title" | "description">,
    username: string
  ) => Promise<NoteFrontend>;
  // editNote: ({ id, title, description }: Pick<Note, "id" | "title" | "description">) => Promise<Note>;
  // deleteNote: (id: string) => Promise<void>;
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

  const handleCreateNote = useCallback(async (note: Pick<NoteFrontend, "title" | "description">, username: string) => {
    const createdNote = await createNote(apiInstance, { ...note, username });
    // createNote might actually be in .data again, if so pull out in createNote, not here.
    setNotes((prev) => ({ ...prev, [createdNote.id]: createdNote }));

    return createdNote;
  }, []);

  const ctx = useMemo(
    () => ({
      notes,
      handleCreateNote,
      // editNote,
      // deleteNote,
    }),
    [
      notes,
      handleCreateNote,
      // editNote,
      // deleteNote,
    ]
  );

  return <NotesContext.Provider value={ctx}>{children}</NotesContext.Provider>;
}
