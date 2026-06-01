import { aes128GCMBenchmark } from "./aes-benchmark.js";
import { asconBenchmark } from "./ascon-benchmark.js";
import { chacha20Benchmark } from "./chacha20-benchmark.js";
import { parseSensorCSV } from "./parse-sensor-csv.js";
import crypto from "crypto";

const data = await parseSensorCSV("./data-trimmed.csv");

const ITERATIONS_PER_ALGORITHM = 100;

const AES_KEY = crypto.randomBytes(16);
const CHACHA_KEY = crypto.randomBytes(32);
const ASCON_KEY = crypto.randomBytes(16);

const payloadSizes = [64, 256, 1024];

for (let i = 0; i < ITERATIONS_PER_ALGORITHM; i++) {
  for (let j = 0; j < payloadSizes.length; j++) {
    aes128GCMBenchmark(data, {
      runId: `${i}-${j}`,
      payloadSize: payloadSizes[j],
      key: AES_KEY,
    });
    chacha20Benchmark(data, {
      runId: `${i}-${j}`,
      payloadSize: payloadSizes[j],
      key: CHACHA_KEY,
    });
    asconBenchmark(data, {
      runId: `${i}-${j}`,
      payloadSize: payloadSizes[j],
      key: ASCON_KEY,
    });
  }
}
