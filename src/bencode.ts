type DecodeResult =
  | string
  | number
  | Array<string | number>
  | Record<string, string | number>
  | null;

function decodeString(source: string): [string, string] {
  const lengthEnd = source.indexOf(":");
  if (lengthEnd === -1) {
    throw new Error("Invalid string format: missing colon.");
  }

  const length = +source.slice(0, lengthEnd);
  if (isNaN(length)) {
    throw new Error("Invalid string format: non-numeric length.");
  }

  const cursor = lengthEnd + 1;
  const string = source.substring(cursor, cursor + length);

  if (!string.length) {
    throw new Error("Invalid string format: missing string content.");
  }

  return [string, source.substring(cursor + length)];
}

function decodeInteger(source: string): [number, string] {
  const start = 1;
  const end = source.indexOf("e", start);
  if (end === -1) {
    throw new Error("Invalid integer format: missing 'e' terminator.");
  }

  const number = +source.slice(start, end);
  if (isNaN(number)) {
    throw new Error("Invalid integer format: non-numeric value.");
  }

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
    default: {
      if (!isNaN(Number(source[0]))) {
        return decodeString(source);
      } else {
        throw new Error(`Unkown token: '${source[0]}'.`);
      }
    }
  }
}

export function decode(source: string): DecodeResult {
  try {
    const result = decodeSubstring(source);
    return result[0];
  } catch (error: any) {
    throw new Error(`Decode error: ${error.message}`);
  }
}
