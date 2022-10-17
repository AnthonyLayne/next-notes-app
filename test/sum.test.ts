import { adder } from "../utils/sum";

describe("adder, adds two numbers and returns result", () => {
  it("should add nums", () => {
    expect(adder(1, 1)).toBe(2);
  });
});
