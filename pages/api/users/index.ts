// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Services
import { apiInit, notFoundResponse, serverErrorResponse } from "utils/api";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { links } = await apiInit(req, res);

  try {
    return notFoundResponse(res, links, "Under Construction");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
