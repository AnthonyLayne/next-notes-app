import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { getAllNotesByUsername } from "services/knex";

// Utils
import {
  apiInit,
  badRequestResponse,
  convertArrObjKeys,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "services/api/utils";

// Types
import { UserFrontend } from "services/knex/types";
import { validateFields } from "utils/format";

export type GetNoteBody = Pick<UserFrontend, "username">;

const REQUIRED_GET_FIELDS: (keyof GetNoteBody)[] = ["username"];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const reqBodyGet = req.body as GetNoteBody;

  const { links } = await apiInit(req, res);

  const { username } = req.query as { username: string };

  try {
    const { valid, missingFields } = validateFields(reqBodyGet, REQUIRED_GET_FIELDS, {
      allowEmptyString: false,
      allowPartial: false,
    });

    if (!valid) {
      const message = `The ${missingFields} field is missing.`;
      return badRequestResponse(res, { message }, links, message);
    }
    if (username) {
      if (req.method === "GET") {
        const notes = await getAllNotesByUsername(username);

        // Check this
        const frontNotes = convertArrObjKeys(notes);
        if (frontNotes.length === 0 || !frontNotes)
          return notFoundResponse(res, links, `No notes found for username: ${username}`);

        return successResponse(res, frontNotes, links, `Fetched notes`);
      }
    }

    return notFoundResponse(res, links, "Only GET, request available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
