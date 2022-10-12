// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { addNote } from "services/knex";
import {
  apiInit,
  badRequestResponse,
  convertKeys,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  SuccessResponse,
  STANDARD_NOTE_BACK_TO_FRONT_CONVERSION,
  STANDARD_NOTE_FRONT_TO_BACK_CONVERSION,
} from "utils/api";

// Utils
import { validateFields } from "utils/format";

// Types
import { NoteFrontend, BaseFieldsFrontend, NoteBackend } from "services/knex/types";

export type PostNoteBody = Omit<NoteFrontend, keyof BaseFieldsFrontend>;

const REQUIRED_FIELDS: (keyof PostNoteBody)[] = ["title", "description", "userId"];

export default async (req: NextApiRequest, res: NextApiResponse<SuccessResponse<NoteFrontend>>) => {
  const reqBody = req.body as Partial<PostNoteBody>;

  const { links } = await apiInit(req, res);

  const { title, description, userId } = reqBody;

  const noteConvert = convertKeys<NoteBackend, Partial<PostNoteBody>>(reqBody, STANDARD_NOTE_FRONT_TO_BACK_CONVERSION);

  try {
    const { valid, missingFields } = validateFields(reqBody, REQUIRED_FIELDS, {
      allowEmptyString: false,
      allowPartial: false,
    });

    if (!valid) {
      const message = `The following fields were missing: ${missingFields.join(", ")}`;
      return badRequestResponse(res, { message }, links, message);
    }

    // Necessary for TS
    if (title && description && userId) {
      if (req.method === "POST") {
        /* eslint-disable camelcase */
        const { user_id, archived_at, deleted_at } = noteConvert;
        const backendNote: NoteBackend = await addNote({ title, description, user_id, archived_at, deleted_at });
        /* eslint-enable camelcase */

        const frontendNote = convertKeys<NoteFrontend, NoteBackend>(
          backendNote,
          STANDARD_NOTE_BACK_TO_FRONT_CONVERSION
        );

        return successResponse(res, frontendNote, links, "Added Note.");
      }
    }

    return notFoundResponse(res, links, "Only POST requests available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
