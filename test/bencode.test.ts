import { decode } from "../src/bencode";

describe("decode string", () => {
  test("it should decode a simple byte string", () => {
    expect(decode("4:spam")[0]).toEqual("spam");
  });
});

describe("decode number", () => {
  test("it should decode a positive number", () => {
    expect(decode("i3e")[0]).toEqual(3);
  });

  test("it should decode a negative number", () => {
    expect(decode("i-3e")[0]).toEqual(-3);
  });
});

describe("decode list", () => {
  test("it should decode a simple list of strings", () => {
    expect(decode("l4:spam4:eggse")[0]).toEqual(["spam", "eggs"]);
  });

  test("it should decode a simple list of integers", () => {
    expect(decode("li3ei6ee")[0]).toEqual([3, 6]);
  });
});

describe("it should decode a dictionary", () => {
  test("it should decode a simple dictionary", () => {
    expect(decode("d3:bar4:spam3:fooi42ee")[0]).toEqual({
      bar: "spam",
      foo: 42,
    });
  });

  test("it should decode a dictionary that contains a list", () => {
    expect(decode("d3:foo3:foo3:barli3ei6eee")[0]).toEqual({
      foo: "foo",
      bar: [3, 6],
    });
  });
});