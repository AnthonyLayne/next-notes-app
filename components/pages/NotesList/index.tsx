export function NotesList() {
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

// const mapStateToProps = (state) => ({
//   notes: state.notes,
// });

// export default connect(mapStateToProps)(NotesList);
