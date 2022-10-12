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
  const { pathname, query } = useRouter();

  const literalPathname = pathname.replace("[category]", query.category as string);

  const handleClose = useCallback(() => router.push(literalPathname), [router]);

  return (
    <Modal isOpen={typeof noteId === "number"} handleClose={handleClose} hideCloseButton>
      <NoteEditor noteId={noteId} onSave={handleClose} />
    </Modal>
  );
}
