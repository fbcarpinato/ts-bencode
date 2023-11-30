type DecodeResult =
  | string
  | number
  | Array<string | number>
  | Record<string, string | number>
  | null;

function decodeString(source: string): [string, string] {
  const lengthEnd = source.indexOf(":");
  const length = +source.slice(0, lengthEnd);
  const cursor = lengthEnd + 1;

  return [
    source.substring(cursor, cursor + length),
    source.substring(cursor + length),
  ];
}

function decodeInteger(source: string): [number, string] {
  const start = 1;
  const end = source.indexOf("e", start);
  const number = +source.slice(start, end);
  const remaining = source.slice(end + 1);

  return [number, remaining];
}

function decodeList(source: string): [Array<string | number>, string] {
  const decodedList: Array<string | number> = [];
  source = source.slice(1);

  while (source[0] !== "e") {
    const [value, restOfList] = decodeSubstring(source);
    decodedList.push(value as string | number);
    source = restOfList;
  }

  return [decodedList, source.slice(1)];
}

function decodeDictionary(source: string): [Record<string, any>, string] {
  const decodedDictionary: Record<string, any> = {};
  source = source.slice(1);

  while (source[0] !== "e") {
    const [key, rest1] = decodeSubstring(source);
    source = rest1;
    const [value, rest2] = decodeSubstring(source);
    source = rest2;

    decodedDictionary[key as string] = value;
  }

  return [decodedDictionary, source.slice(1)];
}

function decodeSubstring(source: string): [DecodeResult, string] {
  switch (source[0]) {
    case "l":
      return decodeList(source);
    case "i":
      return decodeInteger(source);
    case "d":
      return decodeDictionary(source);
    default:
      return !isNaN(Number(source[0])) ? decodeString(source) : [null, ""];
  }
}

export function decode(source: string): DecodeResult {
  return decodeSubstring(source)[0];
}
