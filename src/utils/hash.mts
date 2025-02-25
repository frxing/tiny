import { createHash } from "crypto";

function generateHash(data: string): string {
  return createHash("sha256").update(data, 'utf-8').digest("hex");
}

function getLast8Chars(str: string): string {
  return str.slice(-8);
}

export { generateHash, getLast8Chars };