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
} from "services/api/utils";

// Utils
import { validateFields } from "utils/format";

// Types
import { NoteFrontend, BaseFieldsFrontend, NoteBackend } from "services/knex/types";

type PostNote = Omit<NoteFrontend, keyof BaseFieldsFrontend>;
export type PostNoteBody = PostNote & { username: string };

const REQUIRED_FIELDS: (keyof PostNoteBody)[] = ["title", "description", "username"];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const reqBody = req.body as Partial<PostNoteBody>;

  const { links } = await apiInit(req, res);

  const { title, description, username } = reqBody;

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
    if (title && description && username) {
      if (req.method === "POST") {
        const backendNote: NoteBackend = await addNote({ title, description, username });

        const frontendNote = convertKeys<NoteFrontend, NoteBackend>(backendNote, {
          created_at: "createdAt",
        });

        return successResponse(res, frontendNote, links, "Added Note.");
      }
    }

    return notFoundResponse(res, links, "Only POST requests available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
