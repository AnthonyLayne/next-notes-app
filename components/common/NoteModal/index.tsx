import { useState, useCallback } from "react";

// Components
import { Modal } from "components/common/Modal";
import { NoteEditor } from "components/common/NoteEditor";

type TProps = {
  noteId: Maybe<number>;
};

export function NoteModal({ noteId }: TProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback(() => setIsOpen((prev) => !prev), []);
  if (noteId && isOpen === false) handleClose();

  if (!noteId && isOpen === true) handleClose();

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <NoteEditor noteId={Number(noteId)} />
    </Modal>
  );
}
