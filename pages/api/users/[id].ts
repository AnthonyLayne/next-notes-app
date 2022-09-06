// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { getUserById } from "services/knex";
import { apiInit, notFoundResponse, serverErrorResponse, successResponse } from "services/api/utils";

// Utils
import { pruneUnwantedFields } from "utils/format";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { links } = await apiInit(req, res);

  // `id` must be replaced with whatever the file is named in the square brackets
  const { id } = req.query as { id: string };

  // * req.query comes from: "api/users/8293?email=eric@gmail.com&password=random1"
  // const { id } = req.query as { id: string; email?: string; password?: string }; // * we are guaranteed the `id` by the path, but nothing else
  // const { id } = req.body as { id?: string; email?: string; password?: string }; // * all fields should be "maybe" because there is no guarantee

  try {
    if (req.method === "GET") {
      const user = await getUserById(id);
      if (!user) return notFoundResponse(res, links, `No user found for id: ${id}`);

      return successResponse(res, pruneUnwantedFields(user, ["password"]), links, "Fetched user.");
    }
    if (req.method === "POST") {
      const users = await getUserById(id);
      return successResponse(res, users, links, "Fetched all users.");
    }
    return notFoundResponse(res, links, "Only GET, POST requests available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
