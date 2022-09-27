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

export default async (req: NextApiRequest, res: NextApiResponse<NoteFrontend>) => {
  const reqBodyGet = req.body as GetNoteBody;

  const { links } = await apiInit(req, res);

  // eslint-disable-next-line camelcase
  const { user_id } = req.query as { user_id: string };

  try {
    const { valid, missingFields } = validateFields(reqBodyGet, REQUIRED_GET_FIELDS, {
      allowEmptyString: false,
      allowPartial: false,
    });

    if (!valid) {
      const message = `The ${missingFields} field is missing.`;
      return badRequestResponse(res, { message }, links, message);
    }
    // eslint-disable-next-line camelcase
    if (user_id) {
      if (req.method === "GET") {
        const notes = await getAllNotesById(user_id);

        const frontNotes = notes.map((note) =>
          convertKeys<NoteFrontend, NoteBackend>(note, { created_at: "createdAt" })
        );
        if (frontNotes.length === 0 || !frontNotes)
          // eslint-disable-next-line camelcase
          return notFoundResponse(res, links, `No notes found for id: ${user_id}`);

        return successResponse(res, frontNotes, links, `Fetched notes`);
      }
    }

    return notFoundResponse(res, links, "Only GET, request available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
