// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { addUser } from "services/knex";
import {
  apiInit,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "services/api/utils";

// Utils
import { validateFields } from "utils/format";

// Types
import { UserFrontend } from "services/knex/types";

export type PostUserBody = UserFrontend;

const REQUIRED_POST_USER_FIELDS: (keyof PostUserBody)[] = ["username", "password"];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const reqBodyUserPost = req.body as PostUserBody;

  const { links } = await apiInit(req, res);

  const { username, password } = req.body;

  try {
    const { valid, missingFields } = validateFields(reqBodyUserPost, REQUIRED_POST_USER_FIELDS, {
      allowEmptyString: false,
      allowPartial: false,
    });

    if (!valid) {
      const message = `The folloing fields are required: ${missingFields.join(", ")}`;
      return badRequestResponse(res, { message }, links, message);
    }

    if (username && password) {
      if (req.method === "POST") {
        const user = await addUser(username, password);

        return successResponse(res, user, links, `User: ${user}, has been added.`);
      }
    }

    return notFoundResponse(res, links, "Only POST request available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
