// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

// Services
import { getHashedPass, getByUsername, addUser, getById } from "services/knex";
import {
  apiInit,
  badRequestResponse,
  convertKeys,
  notFoundResponse,
  serverErrorResponse,
  signJwt,
  successResponse,
  SuccessResponse,
} from "utils/api";

// Utils
import { validateFields } from "utils/format";

// Types
import { BaseFieldsFrontend, UserBackend, UserFrontend } from "services/knex/types";

export type AuthUser = Omit<UserFrontend, keyof BaseFieldsFrontend> & { password: string };
export type AuthResponse = { user: UserFrontend; jwt: string };

const REQUIRED_AUTH_USER_FIELDS: (keyof AuthUser)[] = ["username", "password"];

export default async (req: NextApiRequest, res: NextApiResponse<SuccessResponse<AuthResponse>>) => {
  const { links, jwtInfo } = await apiInit(req, res);

  try {
    let user: Nullable<UserFrontend> = null;

    // Validate Auth
    if (req.method === "GET") {
      if (jwtInfo.uid) {
        const backendUser = await getById(jwtInfo.uid);
        if (!backendUser) return badRequestResponse(res, { error: "Bad jwt, invalid uid." }, links);

        user = convertKeys<UserFrontend, Omit<UserBackend, "password">>(backendUser, { created_at: "createdAt" });

        return successResponse(res, { user, jwt: jwtInfo.jwtToken }, links, "User has been signed up.");
      }
      return badRequestResponse(res, { error: jwtInfo.jwtError }, links, "Bad jwt.");
    }

    const reqBody = req.body as Partial<AuthUser>;
    const { username, password } = reqBody;

    const { valid, missingFields } = validateFields(reqBody, REQUIRED_AUTH_USER_FIELDS, {
      allowEmptyString: false,
      allowPartial: false,
    });

    if (!valid) {
      const message = `The following fields are required: ${missingFields.join(", ")}`;
      return badRequestResponse(res, { message }, links, message);
    }

    // Sign Up
    if (req.method === "POST") {
      if (username && password) {
        const existingUser = await getByUsername(username);
        if (existingUser) {
          const message = "This username is taken.";
          return badRequestResponse(res, { message }, links, message);
        }

        const backendUser = await addUser(username, bcrypt.hashSync(password, 8));
        user = convertKeys<UserFrontend, Omit<UserBackend, "password">>(backendUser, { created_at: "createdAt" });
        return successResponse(res, { user, jwt: signJwt(user.id) }, links, "User has been signed up.");
      }
    }

    // Sign In
    if (req.method === "PUT") {
      if (username && password) {
        const backendUser = await getByUsername(username);

        if (backendUser?.username === username) {
          const hashedPass = await getHashedPass(username);
          const validPass = await bcrypt.compare(password, hashedPass);

          if (validPass) {
            user = convertKeys<UserFrontend, Omit<UserBackend, "password">>(backendUser, { created_at: "createdAt" });

            if (user) {
              return successResponse(res, { user, jwt: signJwt(user.id) }, links, "Success");
            }
          } else {
            const badCreds = "Username or Password is incorrect.";

            return badRequestResponse(res, { badCreds }, links, badCreds);
          }
        }
        return notFoundResponse(res, links, "Username not found.");
      }
    }

    return notFoundResponse(res, links, "Only PUT, POST requests available");
  } catch (err) {
    return serverErrorResponse(res, err as Error, links);
  }
};
