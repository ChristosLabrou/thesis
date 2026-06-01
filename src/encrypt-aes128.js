import crypto from "crypto";

export function encryptAES128(payload, key) {
  if (key.length !== 16) {
    throw new Error("AES-128 requires a 16-byte key");
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-128-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(payload), cipher.final()]);

  return {
    algorithm: "aes-128-gcm",
    ciphertext,
    iv,
    authTag: cipher.getAuthTag(),
  };
}
