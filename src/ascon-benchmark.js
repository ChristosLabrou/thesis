import { baseBenchmark } from "./base-benchmark.js";
import { decryptAscon } from "./decrypt-ascon.js";
import { encryptAscon } from "./encrypt-ascon.js";
import { saveBenchmarkResults } from "./save-benchmark.js";

export function asconBenchmark(data, options) {
  const { runId, payloadSize } = options;

  const { encryptDuration, decryptDuration } = baseBenchmark(
    data,
    options,
    encryptAscon,
    decryptAscon,
  );

  saveBenchmarkResults([
    {
      id: runId,
      algorithm: "ASCON-Encrypt",
      payloadSize,
      totalNs: encryptDuration,
    },

    {
      id: runId,
      algorithm: "ASCON-Decrypt",
      payloadSize,
      totalNs: decryptDuration,
    },
  ]);
}
