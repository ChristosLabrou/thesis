import { baseBenchmark } from "./base-benchmark.js";
import { decryptAES128 } from "./decrypt-aes128.js";
import { encryptAES128 } from "./encrypt-aes128.js";
import { saveBenchmarkResults } from "./save-benchmark.js";

export function aes128GCMBenchmark(data, options) {
  const { runId, payloadSize } = options;

  const { encryptDuration, decryptDuration } = baseBenchmark(
    data,
    options,
    encryptAES128,
    decryptAES128,
  );

  saveBenchmarkResults([
    {
      id: runId,
      algorithm: "AES-128-Encrypt",
      payloadSize,
      totalNs: encryptDuration,
    },

    {
      id: runId,
      algorithm: "AES-128-Decrypt",
      payloadSize,
      totalNs: decryptDuration,
    },
  ]);
}
