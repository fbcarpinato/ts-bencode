import { decode } from "../src/bencode";

describe("decode string", () => {
  test("it should decode a simple byte string", () => {
    expect(decode("4:spam")).toEqual("spam");
  });

  test("it should throw an error for invalid string format (missing colon)", () => {
    expect(() => decode("4spam")).toThrow(
      "Decode error: Invalid string format: missing colon."
    );
  });

  test("it should throw an error for invalid string format (non-numeric length)", () => {
    expect(() => decode("abc:spam")).toThrow(
      "Decode error: Unkown token: 'a'."
    );
  });

  test("it should throw an error for invalid string format (missing colon and non-numeric length)", () => {
    expect(() => decode("abcspam")).toThrow("Decode error: Unkown token: 'a'.");
  });

  test("it should throw an error for invalid string format (negative length)", () => {
    expect(() => decode("-3:abc")).toThrow("Decode error: Unkown token: '-'.");
  });

  test("it should throw an error for invalid string format (missing string content)", () => {
    expect(() => decode("3:")).toThrow(
      "Decode error: Invalid string format: missing string content."
    );
  });

  test("it should throw an error for invalid string format (missing string content and non-numeric length)", () => {
    expect(() => decode("abc:")).toThrow("Decode error: Unkown token: 'a'.");
  });

  test("it should throw an error for invalid string format (negative length and missing string content)", () => {
    expect(() => decode("-3:")).toThrow("Decode error: Unkown token: '-'.");
  });
});

describe("decode number", () => {
  test("it should decode a positive number", () => {
    expect(decode("i3e")).toEqual(3);
  });

  test("it should decode a negative number", () => {
    expect(decode("i-3e")).toEqual(-3);
  });

  test("it should throw an error for invalid integer format (missing 'e' terminator)", () => {
    expect(() => decode("i3")).toThrow(
      "Decode error: Invalid integer format: missing 'e' terminator."
    );
  });

  test("it should throw an error for invalid integer format (non-numeric value)", () => {
    expect(() => decode("iabce")).toThrow(
      "Decode error: Invalid integer format: non-numeric value."
    );
  });

  test("it should throw an error for invalid integer format (missing 'e' terminator)", () => {
    expect(() => decode("i3abc")).toThrow(
      "Decode error: Invalid integer format: missing 'e' terminator."
    );
  });
});

describe("decode list", () => {
  test("it should decode a simple list of strings", () => {
    expect(decode("l4:spam4:eggse")).toEqual(["spam", "eggs"]);
  });

  test("it should decode a simple list of integers", () => {
    expect(decode("li3ei6ee")).toEqual([3, 6]);
  });
});

describe("it should decode a dictionary", () => {
  test("it should decode a simple dictionary", () => {
    expect(decode("d3:bar4:spam3:fooi42ee")).toEqual({
      bar: "spam",
      foo: 42,
    });
  });

  test("it should decode a dictionary that contains a list", () => {
    expect(decode("d3:foo3:foo3:barli3ei6eee")).toEqual({
      foo: "foo",
      bar: [3, 6],
    });
  });
});
