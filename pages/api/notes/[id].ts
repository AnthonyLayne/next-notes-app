import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { editNote, deleteNoteById } from "services/knex";

// Utils
import {
  apiInit,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "services/api/utils";
import { validateFields } from "utils/format";

// Types
import { BaseFieldsFrontend, NoteFrontend } from "services/knex/types";

export type PutNoteBody = Omit<NoteFrontend, keyof BaseFieldsFrontend>;

const REQURIED_PUT_FIELDS: (keyof PutNoteBody)[] = ["title", "description"];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const reqBodyPut = req.body as Partial<PutNoteBody>;

  const { id } = req.query as { id: string };

  const { links } = await apiInit(req, res);

  try {
    if (req.method === "DELETE") {
      const note = await deleteNoteById(id);
      if (!note) return notFoundResponse(res, links, `No note found for note: ${id}`);

      return successResponse(res, undefined, links, "Deleted note.");
    }

    if (req.method === "PUT") {
      const { title, description } = reqBodyPut;

      const { valid, missingFields } = validateFields(reqBodyPut, REQURIED_PUT_FIELDS, {
        allowEmptyString: false,
        allowPartial: true,
      });

      if (!valid) {
        const message = `At least one of these fields must be included: ${missingFields}`;
        return badRequestResponse(res, { message }, links, message);
      }
      if (title || description) {
        const editedNote = await editNote(id, { title, description });

        if (!editedNote) return notFoundResponse(res, links, `No note found for note: ${id}`);

        return successResponse(res, editedNote, links, "Edited note.");
      }
    }

    return notFoundResponse(res, links, "Only PUT, DELETE requests available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
