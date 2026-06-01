import { createPayload } from "./create-payload.js";

export function baseBenchmark(data, options, encryptFunction, decryptFunction) {
  if (
    !encryptFunction.type === "function" ||
    !decryptFunction.type === "function"
  ) {
    throw new Error("encryptFunction/decryptFunction must be functions");
  }
  const { key, payloadSize } = options;
  const encryptStart = process.hrtime.bigint();
  const encryptedPayloads = data.map((row) => {
    const payload = createPayload(row, payloadSize);
    const encrypted = encryptFunction(payload, key);
    return encrypted;
  });
  const encryptEnd = process.hrtime.bigint();
  const encryptDuration = Number(encryptEnd - encryptStart);

  const decryptStart = process.hrtime.bigint();
  encryptedPayloads.map((e) => {
    decryptFunction(e, key);
  });
  const decryptEnd = process.hrtime.bigint();
  const decryptDuration = Number(decryptEnd - decryptStart);

  return { encryptDuration, decryptDuration };
}
