import JsAscon from "js-ascon";

export function decryptAscon(encrypted, key) {
  if (key.length !== 16) {
    throw new Error("ASCON-128 requires a 16-byte key");
  }

  const plaintext = JsAscon.decrypt(
    Array.from(key),
    Array.from(encrypted.nonce),
    "",
    encrypted.ciphertext,
  );

  return Buffer.from(plaintext);
}
