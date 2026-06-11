import { createPayload } from "./create-payload.js";

export function baseBenchmark(data, options, encryptFunction, decryptFunction) {
  if (
    typeof encryptFunction !== "function" ||
    typeof decryptFunction !== "function"
  ) {
    throw new Error("encryptFunction/decryptFunction must be functions");
  }
  const { key, payloadSize } = options;
  const encryptStart = process.hrtime.bigint();
  const initialPayloads = [];

  const encryptedPayloads = data.map((row) => {
    const payload = createPayload(row, payloadSize);
    initialPayloads.push(payload);

    const encrypted = encryptFunction(payload, key);
    return encrypted;
  });
  const encryptEnd = process.hrtime.bigint();
  const encryptDuration = Number(encryptEnd - encryptStart);

  const decryptStart = process.hrtime.bigint();
  encryptedPayloads.map((e, index) => {
    const decrypted = decryptFunction(e, key);
    if (!decrypted.equals(initialPayloads[index])) {
      throw new Error("Decrypt failed");
    }
  });
  const decryptEnd = process.hrtime.bigint();
  const decryptDuration = Number(decryptEnd - decryptStart);

  return { encryptDuration, decryptDuration };
}
