type DecodeResult =
  | string
  | number
  | Array<string | number>
  | Record<string, string | number>
  | null;

function decodeString(source: string): [string, string] {
  let cursor = 0;
  let length = "";

  while (source[cursor] !== ":") {
    length += source[cursor];
    cursor++;
  }

  cursor++;

  return [
    source.slice(cursor, cursor + +length),
    source.slice(cursor + +length),
  ];
}

function decodeInteger(source: string): [number, string] {
  let cursor = 0;
  let number = "";

  source = source.slice(1);

  while (source[cursor] !== "e") {
    number += source[cursor];
    cursor++;
  }

  return [+number, source.slice(cursor + 1)];
}

function decodeList(source: string): [Array<string | number>, string] {
  let decodedList: Array<string | number> = [];

  let decoding = true;

  source = source.slice(1);

  while (decoding) {
    const [value, restOfList] = decode(source);

    decodedList = [...decodedList, value as string | number];

    source = restOfList;

    decoding = source[0] !== "e";
  }

  return [decodedList, source.slice(1)];
}

function decodeDictionary(source: string): [Record<string, any>, string] {
  let decodedDictionary: Record<string, any> = {};

  let decoding = true;

  source = source.slice(1);

  while (decoding) {
    const [key, rest1] = decode(source);
    source = rest1;
    const [value, rest2] = decode(source);
    source = rest2;

    decodedDictionary = {
      ...decodedDictionary,
      [key as string]: value,
    };

    decoding = source !== "e";
  }

  return [decodedDictionary, source.slice(1)];
}

export function decode(source: string): [DecodeResult, string] {
  if (source[0] === "l") {
    return decodeList(source);
  }

  if (source[0] === "i") {
    return decodeInteger(source);
  }

  if (source[0] === "d") {
    return decodeDictionary(source);
  }

  if (!isNaN(Number(source[0]))) {
    return decodeString(source);
  }

  return [null, ""];
}
