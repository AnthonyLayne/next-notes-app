import type { NextApiRequest, NextApiResponse } from "next";

// Services
import {
  // Types
  getAllNotesByUsername,
} from "services/knex";

// Utils
import { apiInit, notFoundResponse, serverErrorResponse, successResponse } from "services/api/utils";
import { pruneUnwantedFields } from "utils/format";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { links } = await apiInit(req, res);

  const { username } = req.query as { username: string };

  try {
    if (req.method === "GET") {
      const notes = await getAllNotesByUsername(username);
      if (!notes) return notFoundResponse(res, links, `No notes found for username: ${username}`);

      return successResponse(res, pruneUnwantedFields, links, `Fetched notes`);
    }

    return notFoundResponse(res, links, "Only GET, request available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
