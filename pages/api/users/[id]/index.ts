// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { deleteUserById } from "services/knex";

// Helpers
import { apiInit, notFoundResponse, serverErrorResponse, successResponse, SuccessResponse } from "utils/api";

export default async (req: NextApiRequest, res: NextApiResponse<SuccessResponse<null>>) => {
  const { links } = await apiInit(req, res);

  const { id } = req.query as { id: string };

  try {
    if (req.method === "DELETE") {
      const user = await deleteUserById(id);
      if (!user) return notFoundResponse(res, links, `No user found for id: ${id}`);

      return successResponse(res, null, links, "Deleted user.");
    }
    return notFoundResponse(res, links, "Only DELETE requests available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
