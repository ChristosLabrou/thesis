import fs from "fs";
import readline from "readline";

export async function parseSensorCSV(filePath) {
  const results = [];

  const stream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;

    const [_date, _time, epoch, moteid, temperature, humidity, light, voltage] =
      line.trim().split(" ");

    results.push({
      e: Math.round(epoch),
      m: Math.round(moteid),
      t: Math.round(temperature),
      h: Math.round(humidity),
      l: Math.round(light),
      v: Math.round(voltage),
    });
  }

  return results;
}
