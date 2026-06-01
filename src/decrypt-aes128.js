import crypto from "crypto";

export function decryptAES128(encrypted, key) {
  if (key.length !== 16) {
    throw new Error("AES-128 requires a 16-byte key");
  }

  const decipher = crypto.createDecipheriv("aes-128-gcm", key, encrypted.iv);

  decipher.setAuthTag(encrypted.authTag);

  return Buffer.concat([
    decipher.update(encrypted.ciphertext),
    decipher.final(),
  ]);
}
