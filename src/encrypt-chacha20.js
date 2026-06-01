import crypto from "crypto";

export function encryptChaCha20(payload, key) {
  if (key.length !== 32) {
    throw new Error("ChaCha20-Poly1305 requires a 32-byte key");
  }

  const nonce = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("chacha20-poly1305", key, nonce, {
    authTagLength: 16,
  });

  const ciphertext = Buffer.concat([cipher.update(payload), cipher.final()]);

  return {
    algorithm: "chacha20-poly1305",
    ciphertext,
    nonce,
    authTag: cipher.getAuthTag(),
  };
}
