// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Services
// import { addUser } from "services/knex";
import {
  apiInit,
  // badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  // successResponse,
} from "utils/api";

// Utils
// import { validateFields } from "utils/format";

// Types
import { UserFrontend } from "services/knex/types";

export type PostUserBody = UserFrontend;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { links } = await apiInit(req, res);

  try {
    return notFoundResponse(res, links, "Under Construction");
  } catch (error) {
    return serverErrorResponse(res, error as Error, links);
  }
};
