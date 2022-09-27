// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { deleteUserById } from "services/knex";
import { apiInit, badRequestResponse, notFoundResponse, serverErrorResponse, successResponse } from "utils/api";

// Utils
import { validateFields } from "utils/format";

// Types
import { UserFrontend } from "services/knex/types";

// export type UserBody = Pick<BaseFieldsFrontend, "id">;

export type GetNoteBody = UserFrontend;

const REQUIRED_USER_GET_FIELDS: (keyof GetNoteBody)[] = ["username"];

export default async (req: NextApiRequest, res: NextApiResponse<UserFrontend>) => {
  const reqBodyUser = req.body as GetNoteBody;

  const { links } = await apiInit(req, res);

  const { id } = req.query as { id: string };

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

    // if (req.method === "GET") {
    //   const user = await getById(id);
    //   if (!user) return notFoundResponse(res, links, `No user found for id: ${id}`);

    //   return successResponse(res, pruneUnwantedFields(user, ["password"]), links, "Fetched user.");
    // }

    if (req.method === "DELETE") {
      const user = await deleteUserById(id);
      if (!user) return notFoundResponse(res, links, `No user found for id: ${id}`);

      return successResponse(res, user, links, "Deleted user.");
    }
    return notFoundResponse(res, links, "Only DELETE requests available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
