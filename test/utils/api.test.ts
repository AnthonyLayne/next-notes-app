import { convertKeys } from "utils/api/index";

describe("utils/api -> convertKeys", () => {
  const BACKEND_OBJ = { created_at: 1 };
  const FRONTEND_OBJ = { createdAt: 1 };

  describe("recieves an obj and converstionTable", () => {
    const CONVERSION = { created_at: "createdAt" };

    it("return the object with selected keys converted, backend to frontend", () => {
      expect(convertKeys(BACKEND_OBJ, CONVERSION)).toEqual(FRONTEND_OBJ);
    });

    it("return the object with selected keys converted, frontend to backend", () => {
      expect(convertKeys(FRONTEND_OBJ, { createdAt: "created_at" })).toEqual(BACKEND_OBJ);
    });
  });

  describe("handles falsy values correctly", () => {
    const CONVERSION = { created_at: "createdAt", updated_at: "updatedAt" };

    it("removes keys that are undefined", () => {
      expect(convertKeys({ ...BACKEND_OBJ, updated_at: undefined }, CONVERSION)).toEqual({
        ...FRONTEND_OBJ,
      });
    });

    it("maintains keys that are null, false, or zero", () => {
      expect(convertKeys({ ...BACKEND_OBJ, updated_at: null }, CONVERSION)).toEqual({
        ...FRONTEND_OBJ,
        updatedAt: null,
      });
      expect(convertKeys({ ...BACKEND_OBJ, updated_at: false }, CONVERSION)).toEqual({
        ...FRONTEND_OBJ,
        updatedAt: false,
      });
      expect(convertKeys({ ...BACKEND_OBJ, updated_at: 0 }, CONVERSION)).toEqual({
        ...FRONTEND_OBJ,
        updatedAt: 0,
      });
    });
  });
});
