import crypto from "crypto";
import JsAscon from "js-ascon";

export function encryptAscon(payload, key) {
  if (key.length !== 16) {
    throw new Error("ASCON-128 requires a 16-byte key");
  }

  const nonce = crypto.randomBytes(16);

  const ciphertext = JsAscon.encrypt(
    Array.from(key),
    Array.from(nonce),
    "",
    Array.from(payload),
  );

  return {
    algorithm: "ascon-128",
    ciphertext,
    nonce,
  };
}
