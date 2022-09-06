// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { getAllUsers } from "services/knex";
import { apiInit, notFoundResponse, serverErrorResponse, successResponse } from "services/api";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { links } = await apiInit(req, res);

  // id can be and must be replaced with whatever the file was named in the square brackets.
  //   const { id } = req.query as { id: string; email?: string; password?: string };
  //   const { id } = req.body as { id?: string; email?: string; password?: string };
  // "api/users/123?email=abc&password=def"

  try {
    if (req.method === "GET") {
      const users = await getAllUsers();
      return successResponse(res, users, links, "Fetched all users.");
    }
    if (req.method === "POST") {
      const users = await getAllUsers();
      return successResponse(res, users, links, "Fetched all users.");
    }
    return notFoundResponse(res, links, "Only GET, POST requests available");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
