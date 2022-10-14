import type { NextApiRequest, NextApiResponse } from "next";

// Services
// import {
//   // editNote,
//   deleteNoteById,
// } from "services/knex";

// Helpers
import {
  apiInit,
  //   badRequestResponse,
  //   convertKeys,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  SuccessResponse,
  //   STANDARD_NOTE_BACK_TO_FRONT_CONVERSION,
  //   STANDARD_NOTE_FRONT_TO_BACK_CONVERSION,
  // CRON_KEY,
} from "utils/api";
// import { validateFields } from "utils/format";

// Types
import { NoteFrontend } from "services/knex/types";

export type PutNoteBody = Omit<NoteFrontend, "createdAt" | "userId">;

// const REQURIED_PUT_FIELDS: (keyof PutNoteBody)[] = ["title", "description"];

export default async (req: NextApiRequest, res: NextApiResponse<SuccessResponse<Nullable<NoteFrontend>>>) => {
  //   const reqBodyPut = req.body as Partial<PutNoteBody>;

  // const { cronKey } = req.query as { cronKey: string };

  const { links } = await apiInit(req, res);

  try {
    if (req.method === "DELETE") {
      // TODO: This (true delete) needs to only happen in a daily cron after 7 days
      // TODO: Regular delete sets `deleted_at`
      //   await deleteNoteById(id);

      return successResponse(res, null, links, "Deleted note.");
    }

    // if (req.method === "PUT") {
    //   const { title, description } = reqBodyPut;

    //   const { valid, missingFields } = validateFields(reqBodyPut, REQURIED_PUT_FIELDS, {
    //     allowEmptyString: false,
    //     allowPartial: true,
    //   });

    //   if (!valid) {
    //     const message = `At least one of these fields must be included: ${missingFields}`;
    //     return badRequestResponse(res, { message }, links, message);
    //   }

    //   if (title || description) {
    //     const noteConvert = convertKeys<NoteBackend, Partial<PutNoteBody>>(
    //       reqBodyPut,
    //       STANDARD_NOTE_FRONT_TO_BACK_CONVERSION
    //     );

    //     /* eslint-disable camelcase */
    //     const { archived_at, deleted_at } = noteConvert;
    //     const backendNote: Partial<NoteBackend> = await editNote(id, { title, description, archived_at, deleted_at });
    //     /* eslint-enable camelcase */

    //     const frontendNote = convertKeys<NoteFrontend, Partial<NoteBackend>>(
    //       backendNote,
    //       STANDARD_NOTE_BACK_TO_FRONT_CONVERSION
    //     );

    //     // eslint-disable-next-line camelcase
    //     if (!frontendNote) return notFoundResponse(res, links, `No note found for note: ${id}`);

    //     return successResponse(res, frontendNote, links, "Edited note.");
    //   }
    // }

    return notFoundResponse(res, links, "Unauthorized");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
