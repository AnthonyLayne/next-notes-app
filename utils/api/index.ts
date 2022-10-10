import { NextApiRequest, NextApiResponse } from "next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { IncomingMessage } from "http";
import Cors from "cors";
import jwtLib from "jsonwebtoken";

// Helpers
import { getEnvVar } from "services/server/getEnvVar";
import { milliseconds, days } from "utils/time";

// Types
import { Links, ApiBadRequestResponse, ApiErrorResponse, ServerResponseError, JwtForm } from "./types";

export const convertKeys = <Target extends Record<string, unknown>, Origin extends Record<string, unknown>>(
  obj: Origin,
  converstionTable: Partial<Record<keyof Origin, keyof Target>>
) => {
  // We are fighting typescript by forcing two types together:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversion = { ...obj } as any;

  Object.entries(converstionTable).forEach(([fromKey, toKey]) => {
    if (conversion[fromKey]) {
      conversion[toKey] = obj[fromKey];
      delete conversion[fromKey];
    }
  });
  return conversion as Target;
};

/*
██████╗ ███████╗███████╗██████╗  ██████╗ ███╗   ██╗███████╗███████╗███████╗
██╔══██╗██╔════╝██╔════╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔════╝██╔════╝
██████╔╝█████╗  ███████╗██████╔╝██║   ██║██╔██╗ ██║███████╗█████╗  ███████╗
██╔══██╗██╔══╝  ╚════██║██╔═══╝ ██║   ██║██║╚██╗██║╚════██║██╔══╝  ╚════██║
██║  ██║███████╗███████║██║     ╚██████╔╝██║ ╚████║███████║███████╗███████║
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚══════╝╚══════╝
*/
export type SuccessResponse<T> = { links: Links; data: T; success: true; message: string };

export const successResponse = <T>(
  res: NextApiResponse<{ links: Links; data: T; success: true; message: string }>,
  data: T,
  links: Links,
  message: string,
  status: number = 200
) =>
  res.status(status).json({
    links,
    data,
    success: true,
    message,
  });

export const badRequestResponse = (
  res: NextApiResponse,
  errors: object,
  links: Links,
  message: string = "Invalid API Request"
) =>
  res.status(400).send(
    JSON.stringify({
      links,
      success: false,
      message,
      errors,
    } as ApiBadRequestResponse)
  );

export const notAuthorizedResponse = (res: NextApiResponse, links: Links, message: string = "Not Authorized") =>
  res.status(401).send(
    JSON.stringify({
      links,
      success: false,
      message,
    } as ApiErrorResponse)
  );

export const notFoundResponse = (res: NextApiResponse, links: Links, message: string = "Not Found") =>
  res.status(404).send(
    JSON.stringify({
      links,
      success: false,
      message,
    } as ApiErrorResponse)
  );

export const serverErrorResponse = (res: NextApiResponse, e: ServerResponseError, links: Links, extras?: object) =>
  res.status(500).send(
    JSON.stringify({
      links,
      errorCode: e.ErrorCode || null,
      success: false,
      message: e.response?.data?.title || e.response?.data || e.message,
      extras,
    } as ApiErrorResponse)
  );

/*
 █████╗ ██████╗ ██╗    ██╗███╗   ██╗██╗████████╗
██╔══██╗██╔══██╗██║    ██║████╗  ██║██║╚══██╔══╝
███████║██████╔╝██║    ██║██╔██╗ ██║██║   ██║
██╔══██║██╔═══╝ ██║    ██║██║╚██╗██║██║   ██║
██║  ██║██║     ██║    ██║██║ ╚████║██║   ██║
╚═╝  ╚═╝╚═╝     ╚═╝    ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝
*/
const cors = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve, reject) => {
    Cors({
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

const absoluteUrl = (
  req:
    | NextApiRequest
    | (IncomingMessage & {
        cookies: NextApiRequestCookies;
      })
) => {
  let protocol = "https:";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (host && host.indexOf("localhost") > -1) {
    protocol = "http:";
  }
  return {
    protocol,
    host,
    origin: `${protocol}//${host}`,
    fullUrl: `${protocol}//${host}${req.url}`,
  };
};

const getLinks = (req: NextApiRequest) => {
  const { fullUrl } = absoluteUrl(req);
  return { self: fullUrl };
};

const verifyJwt = (jwtToken: string) => jwtLib.verify(jwtToken, getEnvVar("JWT_SECRET")) as JwtForm;

export const signJwt = (uid: number) =>
  jwtLib.sign(
    { uid, exp: Math.round(milliseconds(Date.now()).in("seconds") + days(14).in("seconds")) },
    getEnvVar("JWT_SECRET")
  );

export const apiInit = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "application/json;charset=UTF-8");

  const links = getLinks(req);
  const { origin: apiHostUrl } = absoluteUrl(req);
  await cors(req, res);

  // --- Authentication ---------------------------------------------------------------------------
  const { authorization } = req.headers as { authorization?: string };
  const jwtToken = authorization?.split("Bearer ")[1];

  let uid: Maybe<number>;
  let jwtError: Maybe<unknown>;

  if (jwtToken) {
    try {
      const payload = verifyJwt(jwtToken);

      if (payload.exp > milliseconds(Date.now()).in("seconds")) uid = Number(payload.uid);
      else jwtError = "Jwt expired.";
    } catch (err) {
      jwtError = err;
    }
  }
  // ----------------------------------------------------------------------------------------------

  return {
    links,
    apiHostUrl,
    jwtInfo: jwtToken && uid ? { uid, jwtToken } : { jwtError, jwtToken },
  };
};
