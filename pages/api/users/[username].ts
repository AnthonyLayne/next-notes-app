// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { deleteUserByUsername, getByUsername } from "services/knex";
import {
  apiInit,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "services/api/utils";

// Utils
import { pruneUnwantedFields, validateFields } from "utils/format";

// Types
import { UserFrontend } from "services/knex/types";

// export type UserBody = Pick<BaseFieldsFrontend, "id">;

export type GetNoteBody = UserFrontend;

const REQUIRED_USER_GET_FIELDS: (keyof GetNoteBody)[] = ["username"];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const reqBodyUser = req.body as GetNoteBody;

  const { links } = await apiInit(req, res);

  const { username } = req.query as { username: string };

  // `id` must be replaced with whatever the file is named in the square brackets
  // const { id } = req.query as { id: string };

  // * req.query comes from: "api/users/8293?email=anthony@gmail.com&password=random1"
  // const { id } = req.query as { id: string; email?: string; password?: string }; // * we are guaranteed the `id` by the path, but nothing else
  // const { id } = req.body as { id?: string; email?: string; password?: string }; // * all fields should be "maybe" because there is no guarantee

  try {
    const { valid, missingFields } = validateFields(reqBodyUser, REQUIRED_USER_GET_FIELDS, {
      allowEmptyString: false,
      allowPartial: false,
    });

    if (!valid) {
      const message = `The ${missingFields} field is missing.`;
      return badRequestResponse(res, { message }, links, message);
    }

    if (req.method === "GET") {
      const user = await getByUsername(username);
      if (!user) return notFoundResponse(res, links, `No user found for id: ${username}`);

      return successResponse(res, pruneUnwantedFields(user, ["password"]), links, "Fetched user.");
    }

    if (req.method === "DELETE") {
      const user = await deleteUserByUsername(username);
      if (!user) return notFoundResponse(res, links, `No user found for id: ${username}`);

      return successResponse(res, user, links, "Deleted user.");
    }
    return notFoundResponse(res, links, "Only GET and DELETE requests available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
