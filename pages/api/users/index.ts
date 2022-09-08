// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { addUser } from "services/knex";
import { apiInit, notFoundResponse, serverErrorResponse, successResponse } from "services/api/utils";

// Utils
import { pruneUnwantedFields } from "utils/format";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { links } = await apiInit(req, res);

  const { username, password } = req.body;

  try {
    if (req.method === "POST") {
      await addUser(username, password);

      return successResponse(res, pruneUnwantedFields, links, "Fetched user.");
    }

    return notFoundResponse(res, links, "Only POST requests available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
