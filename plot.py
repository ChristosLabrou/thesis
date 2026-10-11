import pandas as pd
import matplotlib.pyplot as plt
import os

os.makedirs("images", exist_ok=True)

# ----------------------------
# Configuration
# ----------------------------
CSV_FILE = "benchmark-results.csv"

df = pd.read_csv(
    CSV_FILE,
    header=None,
    names=["run_id", "algorithm", "payload_size", "total_ns"]
)

# Output configurations
GROUPS = {
    "aes_chacha": {
        "title": "AES + ChaCha20",
        "filter": ~df["algorithm"].str.contains("Ascon", case=False, na=False),
    },
    "all": {
        "title": "AES + ChaCha20 + Ascon",
        "filter": pd.Series(True, index=df.index),
    },
    "ascon": {
        "title": "Ascon",
        "filter": df["algorithm"].str.contains("Ascon", case=False, na=False),
    },
}

# ----------------------------
# Chart generation function
# ----------------------------
def generate_charts(data, group_name, group_title):
    if data.empty:
        print(f"Skipping {group_title}: no data found.")
        return

    # Compute mean and standard deviation across runs
    stats = (
        data.groupby(["algorithm", "payload_size"])["total_ns"]
        .agg(["mean", "std"])
        .reset_index()
    )

    # ----------------------------
    # Encryption chart
    # ----------------------------
    encrypt_stats = stats[
        stats["algorithm"].str.contains("Encrypt", case=False, na=False)
    ]

    if not encrypt_stats.empty:
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

        ax.set_title(f"{group_title} — Encryption Time by Payload Size")
        ax.set_xlabel("Payload Size (bytes)")
        ax.set_ylabel("Time (ns)")
        ax.set_ylim(bottom=0)

        plt.tight_layout()
        plt.savefig(f"images/{group_name}_encryption.png", dpi=300)
        plt.close()

    # ----------------------------
    # Decryption chart
    # ----------------------------
    decrypt_stats = stats[
        stats["algorithm"].str.contains("Decrypt", case=False, na=False)
    ]

    if not decrypt_stats.empty:
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

        ax.set_title(f"{group_title} — Decryption Time by Payload Size")
        ax.set_xlabel("Payload Size (bytes)")
        ax.set_ylabel("Time (ns)")
        ax.set_ylim(bottom=0)

        plt.tight_layout()
        plt.savefig(f"images/{group_name}_decryption.png", dpi=300)
        plt.close()

    # ----------------------------
    # Combined encryption + decryption
    # ----------------------------
    combined = (
        data.groupby(
            [
                data["algorithm"].str.replace(
                    "-Encrypt|-Decrypt", "", regex=True
                ),
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

    ax.set_title(f"{group_title} — Total Encryption + Decryption Time")
    ax.set_xlabel("Payload Size (bytes)")
    ax.set_ylabel("Time (ns)")
    ax.set_ylim(bottom=0)

    plt.tight_layout()
    plt.savefig(f"images/{group_name}_combined.png", dpi=300)
    plt.close()


# ----------------------------
# Generate all charts
# ----------------------------
for group_name, config in GROUPS.items():
    filtered_df = df[config["filter"]]
    generate_charts(
        filtered_df,
        group_name,
        config["title"]
    )

print("Generated charts:")

for group_name in GROUPS:
    print(f" - images/{group_name}_encryption.png")
    print(f" - images/{group_name}_decryption.png")
    print(f" - images/{group_name}_combined.png")
