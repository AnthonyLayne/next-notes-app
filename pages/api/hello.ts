// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { getAllUsers } from "data/services/userService";

type Data = {
  users: unknown[];
};

export default async (_req: NextApiRequest, res: NextApiResponse<Data>) => {
  const users = await getAllUsers();
  return res.status(200).json({ users });
};
