import { NextApiRequest, NextApiResponse } from "next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { IncomingMessage } from "http";
import Cors from "cors";

// Types
import { Links, ApiResponse, ApiBadRequestResponse, ApiErrorResponse, ServerResponseError } from "./types";

/*
██████╗ ███████╗███████╗██████╗  ██████╗ ███╗   ██╗███████╗███████╗███████╗
██╔══██╗██╔════╝██╔════╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔════╝██╔════╝
██████╔╝█████╗  ███████╗██████╔╝██║   ██║██╔██╗ ██║███████╗█████╗  ███████╗
██╔══██╗██╔══╝  ╚════██║██╔═══╝ ██║   ██║██║╚██╗██║╚════██║██╔══╝  ╚════██║
██║  ██║███████╗███████║██║     ╚██████╔╝██║ ╚████║███████║███████╗███████║
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚══════╝╚══════╝
*/
export const successResponse = <T>(
  res: NextApiResponse,
  data: T,
  links: Links,
  message: string,
  status: number = 200
) =>
  res.status(status).send(
    JSON.stringify({
      links,
      data,
      success: true,
      message,
    } as ApiResponse<T>)
  );

export const badRequestResponse = (
  res: NextApiResponse,
  errors: Object,
  links: Links,
  message: string = "Invalid API Request"
) =>
  res.status(400).send(
    JSON.stringify({
      links,
      success: true,
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

export const apiInit = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "application/json;charset=UTF-8");

  const links = getLinks(req);
  const { origin: apiHostUrl } = absoluteUrl(req);
  await cors(req, res);

  // const { apiKey } = req.query as { apiKey?: string };
  // TODO: Validate TOKEN OR API Key
  // const apiKeyValid = true;

  return {
    // apiKey,
    links,
    apiHostUrl,
  };

  // Unauthenticated
  //   return {
  //     // apiKey,
  //     links,
  //     apiHostUrl,
  //   };
};