import { baseBenchmark } from "./base-benchmark.js";
import { decryptChaCha20 } from "./decrypt-chacha20.js";
import { encryptChaCha20 } from "./encrypt-chacha20.js";
import { saveBenchmarkResults } from "./save-benchmark.js";

export function chacha20Benchmark(data, options) {
  const { runId, payloadSize } = options;

  const { encryptDuration, decryptDuration } = baseBenchmark(
    data,
    options,
    encryptChaCha20,
    decryptChaCha20,
  );

  saveBenchmarkResults([
    {
      id: runId,
      algorithm: "ChaCha20-Encrypt",
      payloadSize,
      totalNs: encryptDuration,
    },

    {
      id: runId,
      algorithm: "ChaCha20-Decrypt",
      payloadSize,
      totalNs: decryptDuration,
    },
  ]);
}
