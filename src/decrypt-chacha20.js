import crypto from "crypto";

export function decryptChaCha20(encrypted, key) {
  if (key.length !== 32) {
    throw new Error("ChaCha20-Poly1305 requires a 32-byte key");
  }

  const decipher = crypto.createDecipheriv(
    "chacha20-poly1305",
    key,
    encrypted.nonce,
    {
      authTagLength: 16,
    },
  );

  decipher.setAuthTag(encrypted.authTag);

  return Buffer.concat([
    decipher.update(encrypted.ciphertext),
    decipher.final(),
  ]);
}
