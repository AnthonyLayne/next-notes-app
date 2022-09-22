import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { getAllNotesById } from "services/knex";

// Utils
import {
  apiInit,
  badRequestResponse,
  convertKeys,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "utils/api";

// Types
import { NoteBackend, NoteFrontend, UserFrontend } from "services/knex/types";
import { validateFields } from "utils/format";

export type GetNoteBody = Pick<UserFrontend, "id">;

const REQUIRED_GET_FIELDS: (keyof GetNoteBody)[] = ["id"];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const reqBodyGet = req.body as GetNoteBody;

  const { links } = await apiInit(req, res);

  const { id } = req.query as { id: string };

  try {
    const { valid, missingFields } = validateFields(reqBodyGet, REQUIRED_GET_FIELDS, {
      allowEmptyString: false,
      allowPartial: false,
    });

    if (!valid) {
      const message = `The ${missingFields} field is missing.`;
      return badRequestResponse(res, { message }, links, message);
    }
    if (id) {
      if (req.method === "GET") {
        const notes = await getAllNotesById(id);

        const frontNotes = notes.map((note) =>
          convertKeys<NoteFrontend, NoteBackend>(note, { created_at: "createdAt" })
        );
        if (frontNotes.length === 0 || !frontNotes) return notFoundResponse(res, links, `No notes found for id: ${id}`);

        return successResponse(res, frontNotes, links, `Fetched notes`);
      }
    }

    return notFoundResponse(res, links, "Only GET, request available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
