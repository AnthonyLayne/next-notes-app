import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { getAllNotesById } from "services/knex";

// Utils
import {
  apiInit,
  // badRequestResponse,
  convertKeys,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  SuccessResponse,
  STANDARD_NOTE_BACK_TO_FRONT_CONVERSION,
} from "utils/api";
// import { validateFields } from "utils/format";

// Types
import { NoteBackend, NoteFrontend, UserFrontend } from "services/knex/types";

export type GetNoteBody = Pick<UserFrontend, "id">;

// const REQUIRED_GET_FIELDS: (keyof GetNoteBody)[] = ["id"];

export default async (req: NextApiRequest, res: NextApiResponse<SuccessResponse<NoteFrontend[]>>) => {
  // const reqBodyGet = req.body as GetNoteBody;

  const { links } = await apiInit(req, res);

  // eslint-disable-next-line camelcase
  const { id } = req.query as { id: string };

  try {
    // const { valid, missingFields } = validateFields(reqBodyGet, REQUIRED_GET_FIELDS, {
    //   allowEmptyString: false,
    //   allowPartial: false,
    // });

    // if (!valid) {
    //   const message = `The ${missingFields} field is missing.`;
    //   return badRequestResponse(res, { message }, links, message);
    // }
    // eslint-disable-next-line camelcase
    if (id) {
      if (req.method === "GET") {
        const notes = await getAllNotesById(id);

        const frontNotes = notes.map((note) =>
          convertKeys<NoteFrontend, NoteBackend>(note, STANDARD_NOTE_BACK_TO_FRONT_CONVERSION)
        );

        return successResponse(res, frontNotes || [], links, `Fetched notes`);
      }
    }

    return notFoundResponse(res, links, "Only GET request available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
