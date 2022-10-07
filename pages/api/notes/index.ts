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
} from "utils/api";

// Utils
import { validateFields } from "utils/format";

// Types
import { NoteFrontend, BaseFieldsFrontend, NoteBackend } from "services/knex/types";

type PostNote = Omit<NoteFrontend, keyof BaseFieldsFrontend>;
export type PostNoteBody = PostNote & { userId: number };

const REQUIRED_FIELDS: (keyof PostNoteBody)[] = ["title", "description", "userId"];

export default async (req: NextApiRequest, res: NextApiResponse<SuccessResponse<NoteFrontend>>) => {
  const reqBody = req.body as Partial<PostNoteBody>;

  const { links } = await apiInit(req, res);

  const { title, description, userId } = reqBody;

  const idConvert = convertKeys<NoteBackend, Partial<PostNoteBody>>(reqBody, {
    userId: "user_id",
  });

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
        // eslint-disable-next-line camelcase
        const { user_id } = idConvert;
        // eslint-disable-next-line camelcase
        const backendNote: NoteBackend = await addNote({ title, description, user_id });

        const frontendNote = convertKeys<NoteFrontend, NoteBackend>(backendNote, {
          created_at: "createdAt",
          user_id: "userId",
        });

        return successResponse(res, frontendNote, links, "Added Note.");
      }
    }

    return notFoundResponse(res, links, "Only POST requests available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
