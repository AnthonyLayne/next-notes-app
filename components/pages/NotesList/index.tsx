// import { useNotesContext } from "context/notesContext";

export function NotesList() {
  // const {} = useNotesContext();

  // TODO: get userId off of token, build a getNotes handler func in notes context, give the id to the func to get the usersnotes
  // TODO: list out the users notes
  // TODO: create an onclick that opens the note in a modal, where it can be edited
  // TODO: modal should have, a close button, that should do a PUT req and close at the same time, and a last edited time
  // TODO: see if you can figure out how to pin notes at the top of the list
  // TODO: need a delete button, consider a small hamburger icon to appear when hovering over a note, with delete opt inside.
  // TODO: when the hamburger icon is clicked a small modal opens
  // TODO: need a + button to create a new note
  return (
    <div className="notesListWrapper">
      <h2 className="header">Your Notes:</h2>
      {/*
      {Object.entries(notes).map(([id, note]) => (
        <Link key={id} to={`/edit/${id}`} className="note">
          {note.title}
        </Link>
      ))} */}
    </div>
  );
}
