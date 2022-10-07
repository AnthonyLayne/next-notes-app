import { useCallback } from "react";
import { useRouter } from "next/router";

// Components
import { Modal } from "components/common/Modal";
import { NoteEditor } from "components/common/NoteEditor";

type TProps = {
  noteId: Nullable<number>;
};

export function NoteModal({ noteId }: TProps) {
  const router = useRouter();
  const handleClose = useCallback(() => router.push(router.pathname), [router]);

  return (
    <Modal isOpen={typeof noteId === "number"} handleClose={handleClose}>
      <NoteEditor noteId={noteId} />
    </Modal>
  );
}
