#!/usr/bin/env python3
"""Build static JSON for the Four Years Left briefing site.

Reads the SDG Index database (Sustainable Development Report 2026)
and writes every file the site needs into ./data/.
Usage: python3 prepare_data.py path/to/database_2026.xlsx
"""
import json, sys, math
from pathlib import Path
import pandas as pd

SRC = sys.argv[1] if len(sys.argv) > 1 else "sdg_database_2026.xlsx"
OUT = Path("data"); OUT.mkdir(exist_ok=True)

RATING = {"green": "g", "yellow": "y", "orange": "o", "red": "r", "grey": "x"}
TREND = {"↑": "up", "➚": "mod", "→": "flat", "↓": "down"}
AGGREGATES = [
    "World", "OECD members", "Sub-Saharan Africa", "East and South Asia",
    "Eastern Europe and Central Asia", "Middle East and North Africa",
    "Latin America and the Caribbean", "Oceania",
    "High-income Countries", "Upper-middle-income Countries",
    "Lower-middle-income Countries", "Low-income Countries",
]

def r2(v, nd=2):
    return None if v is None or (isinstance(v, float) and math.isnan(v)) else round(float(v), nd)

xl = pd.ExcelFile(SRC)
ov = pd.read_excel(xl, "Overview")
bd = pd.read_excel(xl, "Backdated SDG Index")
rk = pd.read_excel(xl, "Backdated - Ranks over time")
raw = pd.read_excel(xl, "All Raw Data")

ranked = ov[ov["2026 SDG Index Rank"].notna()].copy()
years = sorted(bd["year"].dropna().unique().astype(int).tolist())

# ---- world_index.json ---------------------------------------------------
w = bd[bd.country == "World"].set_index("year")
world_index = {"years": years, "score": [r2(w.loc[y, "sdgi_s"]) for y in years]}
json.dump(world_index, open(OUT / "world_index.json", "w"))

# ---- goal_scores_world.json (2015..2025 x 17 goals) ---------------------
gy = [y for y in years if y >= 2015]
goal_scores = {"years": gy}
for i in range(1, 18):
    goal_scores[f"goal{i}"] = [r2(w.loc[y, f"goal{i}"], 1) for y in gy]
json.dump(goal_scores, open(OUT / "goal_scores_world.json", "w"))

# ---- regions.json -------------------------------------------------------
regions = {"years": years, "series": {}}
for name in AGGREGATES:
    s = bd[bd.country == name].set_index("year")
    if len(s):
        regions["series"][name] = [r2(s.loc[y, "sdgi_s"]) if y in s.index else None for y in years]
json.dump(regions, open(OUT / "regions.json", "w"))

# ---- dashboard_cells.json (waffle) --------------------------------------
cells = []
for _, row in ranked.iterrows():
    for i in range(1, 18):
        d = row.get(f"Goal {i} Dash"); t = row.get(f"Goal {i} Trend")
        cells.append({
            "c": row["country"], "g": i,
            "d": RATING.get(d, "x"),
            "t": TREND.get(t, "na"),
        })
json.dump(cells, open(OUT / "dashboard_cells.json", "w"))

# ---- ranks.json (arrow chart) -------------------------------------------
iso = rk.set_index("country")["country Code ISO3"].to_dict()
rk2 = rk.copy()
for c in ["2015 sdgi_r", "2025 sdgi_r"]:
    rk2[c] = pd.to_numeric(rk2[c], errors="coerce")
region_of = ranked.set_index("country")["Regions used for the SDR"].to_dict()
ranks = []
for _, row in rk2.dropna(subset=["2015 sdgi_r", "2025 sdgi_r"]).iterrows():
    ranks.append({
        "c": row["country"], "iso3": row["country Code ISO3"],
        "r15": int(row["2015 sdgi_r"]), "r25": int(row["2025 sdgi_r"]),
        "reg": region_of.get(row["country"], ""),
    })
json.dump(ranks, open(OUT / "ranks.json", "w"))

# ---- countries.json (explorer + comparison overlays) --------------------
bidx = bd.pivot_table(index="country", columns="year", values="sdgi_s")
countries = {}
for _, row in ranked.iterrows():
    name = row["country"]
    series = [r2(bidx.loc[name, y]) if name in bidx.index and y in bidx.columns else None for y in years]
    countries[name] = {
        "iso3": iso.get(name, ""),
        "score": r2(row["2026 SDG Index Score"]),
        "rank": int(row["2026 SDG Index Rank"]),
        "region": row["Regions used for the SDR"],
        "spill": r2(row.get("International Spillovers Score (0-100)"), 1),
        "dash": [RATING.get(row.get(f"Goal {i} Dash"), "x") for i in range(1, 18)],
        "trend": [TREND.get(row.get(f"Goal {i} Trend"), "na") for i in range(1, 18)],
        "index": series,
    }
json.dump({"years": years, "countries": countries}, open(OUT / "countries.json", "w"))

# ---- poverty_world.json (guess/reveal interactive) ----------------------
wr = raw[raw.country == "World"][["year", "sdg1_wpc"]].dropna()
json.dump({"years": wr.year.astype(int).tolist(),
           "value": [r2(v) for v in wr.sdg1_wpc]},
          open(OUT / "poverty_world.json", "w"))

# ---- derived_stats.json (single source of truth for prose) --------------
ws = world_index["score"]
def at(y): return ws[years.index(y)]
dash_counts = pd.concat([ranked[f"Goal {i} Dash"] for i in range(1, 18)]).value_counts()
trend_counts = pd.concat([ranked[f"Goal {i} Trend"] for i in range(1, 18)]).value_counts()
tot_d, tot_t = int(dash_counts.sum()), int(trend_counts.sum())
g16 = bd.pivot_table(index="country", columns="year", values="goal16")[[2015, 2025]].dropna()
stats = {
    "ranked_countries": int(len(ranked)),
    "world_2000": at(2000), "world_2015": at(2015), "world_2025": at(2025),
    "pace_2015_2019": round((at(2019) - at(2015)) / 4, 3),
    "pace_2019_2025": round((at(2025) - at(2019)) / 6, 3),
    "gain_last_year": round(at(2025) - at(2024), 3),
    "projection_2030": round(at(2025) + 5 * (at(2025) - at(2019)) / 6, 1),
    "pct_dash": {k: round(100 * int(v) / tot_d, 1) for k, v in dash_counts.items()},
    "pct_trend": {TREND.get(k, k): round(100 * int(v) / tot_t, 1) for k, v in trend_counts.items()},
    "goal_delta_2015_2025": {f"goal{i}": r2(w.loc[2025, f"goal{i}"] - w.loc[2015, f"goal{i}"], 1) for i in range(1, 18)},
    "sdg16_decliners": int((g16[2025] < g16[2015]).sum()), "sdg16_total": int(len(g16)),
    "poverty_2000": r2(wr.sdg1_wpc.iloc[0], 1), "poverty_latest": r2(wr.sdg1_wpc.iloc[-1], 1),
}
json.dump(stats, open(OUT / "derived_stats.json", "w"), indent=1)

print("Wrote", len(list(OUT.glob("*.json"))), "files to", OUT.resolve())
for f in sorted(OUT.glob("*.json")):
    print(f" {f.name:26s} {f.stat().st_size/1024:8.1f} kB")
