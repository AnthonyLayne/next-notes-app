import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { editNote, deleteNoteById } from "services/knex";

// Utils
import {
  apiInit,
  badRequestResponse,
  convertKeys,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  SuccessResponse,
} from "utils/api";
import { validateFields } from "utils/format";

// Types
import { NoteBackend, NoteFrontend } from "services/knex/types";

export type PutNoteBody = Omit<NoteFrontend, "createdAt" | "userId">;

const REQURIED_PUT_FIELDS: (keyof PutNoteBody)[] = ["title", "description"];

export default async (req: NextApiRequest, res: NextApiResponse<SuccessResponse<Nullable<NoteFrontend>>>) => {
  const reqBodyPut = req.body as Partial<PutNoteBody>;

  const { id } = req.query as { id: string };

  const { links } = await apiInit(req, res);

  try {
    if (req.method === "DELETE") {
      await deleteNoteById(id);

      return successResponse(res, null, links, "Deleted note.");
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
        const backendNote: Partial<NoteBackend> = await editNote(id, { title, description });

        const frontendNote = convertKeys<NoteFrontend, Partial<NoteBackend>>(backendNote, {
          created_at: "createdAt",
          user_id: "userId",
        });

        // eslint-disable-next-line camelcase
        if (!frontendNote) return notFoundResponse(res, links, `No note found for note: ${id}`);

        return successResponse(res, frontendNote, links, "Edited note.");
      }
    }

    return notFoundResponse(res, links, "Only PUT, DELETE requests available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
