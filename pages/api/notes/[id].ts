import type { NextApiRequest, NextApiResponse } from "next";

// Services
import {
  // Types
  editNote,
  deleteNoteById,
} from "services/knex";

// Utils
import { apiInit, notFoundResponse, serverErrorResponse, successResponse } from "services/api/utils";
import { pruneUnwantedFields } from "utils/format";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { links } = await apiInit(req, res);

  const { id } = req.query as { id: string };
  const { title, description } = req.body;

  try {
    if (req.method === "DELETE") {
      const note = await deleteNoteById(id);
      if (!note) return notFoundResponse(res, links, `No note found for note: ${id}`);

      return successResponse(res, pruneUnwantedFields, links, "Deleted note.");
    }
    if (req.method === "PUT") {
      const editedNote = await editNote(id, title, description);
      if (!editedNote) return notFoundResponse(res, links, `No note found for note: ${id}`);

      return successResponse(res, pruneUnwantedFields, links, "Edited note.");
    }

    return notFoundResponse(res, links, "Only PUT, DELETE requests available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
