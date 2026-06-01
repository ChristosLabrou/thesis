import pandas as pd
import matplotlib.pyplot as plt

# Replace with your filename
CSV_FILE = "benchmark-results.csv"

df = pd.read_csv(
    CSV_FILE,
    header=None,
    names=["run_id", "algorithm", "payload_size", "total_ns"]
)

df = df[~df["algorithm"].str.contains("ASCON", case=False)]

# Compute mean and stddev across all runs
stats = (
    df.groupby(["algorithm", "payload_size"])["total_ns"]
      .agg(["mean", "std"])
      .reset_index()
)

# ----------------------------
# Encryption chart
# ----------------------------
encrypt_stats = stats[
    stats["algorithm"].str.contains("Encrypt")
]

encrypt_pivot = encrypt_stats.pivot_table(
    index="payload_size",
    columns="algorithm",
    values="mean"
)

encrypt_std = encrypt_stats.pivot_table(
    index="payload_size",
    columns="algorithm",
    values="std"
)

ax = encrypt_pivot.plot(
    kind="bar",
    yerr=encrypt_std,
    capsize=4
)

ax.set_title("Encryption Time by Payload Size")
ax.set_xlabel("Payload Size (bytes)")
ax.set_ylabel("Time (ns)")
plt.tight_layout()
plt.savefig("encryption.png")
plt.close()

# ----------------------------
# Decryption chart
# ----------------------------
decrypt_stats = stats[
    stats["algorithm"].str.contains("Decrypt")
]

decrypt_pivot = decrypt_stats.pivot_table(
    index="payload_size",
    columns="algorithm",
    values="mean"
)

decrypt_std = decrypt_stats.pivot_table(
    index="payload_size",
    columns="algorithm",
    values="std"
)

ax = decrypt_pivot.plot(
    kind="bar",
    yerr=decrypt_std,
    capsize=4
)

ax.set_title("Decryption Time by Payload Size")
ax.set_xlabel("Payload Size (bytes)")
ax.set_ylabel("Time (ns)")
plt.tight_layout()
plt.savefig("decryption.png")
plt.close()

# ----------------------------
# Combined chart
# ----------------------------
combined = (
    df.groupby(
        [
            df["algorithm"].str.replace("-Encrypt|-Decrypt", "", regex=True),
            "payload_size",
            "run_id",
        ]
    )["total_ns"]
    .sum()
    .reset_index()
)

combined.columns = [
    "algorithm",
    "payload_size",
    "run_id",
    "total_ns",
]

combined_stats = (
    combined.groupby(["algorithm", "payload_size"])["total_ns"]
    .agg(["mean", "std"])
    .reset_index()
)

combined_pivot = combined_stats.pivot_table(
    index="payload_size",
    columns="algorithm",
    values="mean"
)

combined_std = combined_stats.pivot_table(
    index="payload_size",
    columns="algorithm",
    values="std"
)

ax = combined_pivot.plot(
    kind="bar",
    yerr=combined_std,
    capsize=4
)

ax.set_title("Total Encryption + Decryption Time")
ax.set_xlabel("Payload Size (bytes)")
ax.set_ylabel("Time (ns)")
plt.tight_layout()
plt.savefig("combined.png")
plt.close()

print("Generated:")
print(" - encryption.png")
print(" - decryption.png")
print(" - combined.png")
