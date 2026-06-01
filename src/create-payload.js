export function createPayload(record, payloadSize) {
  const json = JSON.stringify(record);

  const jsonSize = Buffer.byteLength(json, "utf8");

  if (jsonSize > payloadSize) {
    throw new Error(
      `Record size (${jsonSize}) exceeds payload size (${payloadSize})`,
    );
  }

  return Buffer.from(json.padEnd(payloadSize, " "), "utf8");
}
