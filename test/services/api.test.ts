// Helpers
import { getApiAxiosInstance } from "context/authContext";
import { loginUser } from "services/api";

// Types
import { AuthUser } from "pages/api/auth";

type PossibleErrorShape = { response?: { status?: number } };

class NoErrorThrownError extends Error {}

const getError = async <TError>(call: () => unknown): Promise<TError> => {
  try {
    await call();

    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
};

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImV4cCI6MTY2NzQwNzMxOSwiaWF0IjoxNjY2MTk3NzE5fQ.dqvHeXG8_WxNZRcuh9vmQu9dV6WRpfaQgwGKCjrZBVQ";

// jest.setTimeout(10_000);

describe("services/api", () => {
  const apiInstance = getApiAxiosInstance(JWT);

  describe("loginUser", () => {
    it("returns an auth response with the proper shape", async () => {
      const authResponse = await loginUser(apiInstance, { username: "Anthony", password: "testpass1" });

      expect(typeof authResponse.jwt).toEqual("string");
      expect(authResponse.user).toEqual({
        createdAt: "2022-10-12T02:03:52.869Z",
        id: 2,
        username: "Anthony",
      });
    });

    it("returns status 400 for missing fields", async () => {
      const error = await getError<PossibleErrorShape>(() =>
        loginUser(apiInstance, { username: "Anthony" } as AuthUser)
      );
      expect(error?.response?.status).toEqual(400);
    });

    it("returns status 403 for a bad password", async () => {
      const error = await getError<PossibleErrorShape>(() =>
        loginUser(apiInstance, { username: "Anthony", password: "bad_password" })
      );
      expect(error?.response?.status).toEqual(403);
    });

    it("returns status 404 for a bad username", async () => {
      const error = await getError<PossibleErrorShape>(() =>
        loginUser(apiInstance, { username: "bad_username", password: "testpass1" })
      );
      expect(error?.response?.status).toEqual(404);
    });
  });
});
