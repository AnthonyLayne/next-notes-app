import { createContext, ReactNode, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Fuse from "fuse.js";

// Services
import { createNote, deleteNote, editNote, getUserNotes } from "services/api";

// Context
import { useAuthContext } from "context/authContext";

// Helpers
import { useSafeContext } from "context/useSafeContext";

// Types
import { NoteFrontend } from "services/knex/types";

const FUSE_OPTS = {
  findAllMatches: true,
  keys: ["title", "description", "collaborators"],
  threshold: 0.6, // 0 requires perfection | 1 matches anything
};

export type BaseNotesContext = {
  notes: NoteFrontend[];
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;

  handleCreateNote: (
    { title, description }: Pick<NoteFrontend, "title" | "description" | "archivedAt" | "deletedAt">,
    userId: number
  ) => Promise<NoteFrontend>;
  handleEditNote: ({
    title,
    description,
  }: Pick<NoteFrontend, "title" | "description" | "archivedAt" | "deletedAt" | "id">) => Promise<NoteFrontend>;
  handleDeleteNote: (id: number) => Promise<null>;
};

const NotesContext = createContext<Maybe<BaseNotesContext>>(undefined);
NotesContext.displayName = "NotesContext";

export const useNotesContext = () => useSafeContext(NotesContext);

type TProps = {
  children: ReactNode;
};

export function NotesContextProviderComponent({ children }: TProps) {
  const { query } = useRouter();
  const { category } = query as { category?: string };

  const { apiInstance, auth } = useAuthContext();

  const [notes, setNotes] = useState<NoteFrontend[]>([]);
  const displayNotes = useMemo(
    () =>
      notes.filter(({ archivedAt, deletedAt }) => {
        // * Useful if these fields ever need to be converted to ms for use on the front end:
        // const [archivedAtMs, deletedAtMs] = [
        //   archivedAt ? new Date(archivedAt).valueOf() : null,
        //   deletedAt ? new Date(deletedAt).valueOf() : null,
        // ];

        if (category === "archive") return archivedAt && !deletedAt;
        if (category === "trash") return deletedAt;
        return !archivedAt && !deletedAt; // `category === "all" || category === "undefined"`
      }),
    [notes, category]
  );

  // TODO: Debounce the search
  const fuse = useMemo(() => new Fuse(displayNotes, FUSE_OPTS), [displayNotes]);
  const [searchString, setSearchString] = useState("");
  const searchResults = useMemo(() => fuse.search(searchString).map(({ item }) => item), [fuse, searchString]);

  useEffect(() => {
    if (auth.user?.id) getUserNotes(apiInstance, auth.user.id).then((apiNotes) => setNotes(apiNotes.reverse()));
    else setNotes([]);
  }, [auth.user?.id, apiInstance]);

  const handleCreateNote = useCallback(
    async (note: Pick<NoteFrontend, "title" | "description">, userId: number) => {
      const createdNote = await createNote(apiInstance, { ...note, userId });
      setNotes((prev) => [createdNote, ...prev]);

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

      setNotes((prev) => prev.filter((n) => n.id !== id));

      return null;
    },
    [apiInstance]
  );

  const ctx = useMemo(
    () => ({
      notes: searchString.length > 2 ? searchResults : displayNotes,
      searchString,
      setSearchString,

      handleCreateNote,
      handleEditNote,
      handleDeleteNote,
    }),
    [displayNotes, searchString, setSearchString, searchResults, handleCreateNote, handleEditNote, handleDeleteNote]
  );

  return <NotesContext.Provider value={ctx}>{children}</NotesContext.Provider>;
}
