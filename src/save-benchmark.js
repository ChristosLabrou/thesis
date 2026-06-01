import fs from "fs";

export function saveBenchmarkResults(benchmarks) {
  const lines = benchmarks.map((b) => {
    const { id, algorithm, payloadSize, totalNs } = b;
    return [id, algorithm, payloadSize, totalNs].join(",");
  });

  fs.appendFileSync("benchmark-results.csv", lines.join("\n") + "\n");
}
