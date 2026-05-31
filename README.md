# RoadSoS

## For road safety hackathon - 2026
## Team Zanke 
## Demo video : https://drive.google.com/file/d/1R1WtdiCCm2kraWZ-Z66HHf8_NNos02uS/view?usp=sharing
**RoadSoS** is a Golden Hour emergency road-response PWA. It helps accident victims and bystanders quickly find nearby hospitals, trauma centres, ambulances, police stations, blood banks, towing services, and tyre shops, even in poor-network conditions.

## What It Does

- One-tap SOS with a 60-minute Golden Hour timer.
- MFER-ranked emergency services.
- Offline emergency service pack using IndexedDB.
- AI triage for severity, call priority, and first-aid steps.
- Medical profile with QR export.
- Accident report form with GPS/photo support.
- Accident heatmap.
- India ambulance hotspot optimization model.

## Tech Stack

Frontend:
- React 18, Vite 5, Tailwind CSS
- PWA via Workbox/vite-plugin-pwa
- IndexedDB via `idb`
- Azure Maps-ready map screen

Backend:
- Node.js 20, Azure Functions, Express
- Cosmos DB Core SQL API
- Azure Communication Services SMS wrapper
- OpenStreetMap Overpass fallback
- Anthropic Claude triage proxy

ML/Data Science:
- Python, pandas, numpy, scikit-learn
- Random Forest, K-means, GMM, Agglomerative Clustering

## Main Algorithm

RoadSoS ranks services using **MFER**:

```text
MFER_score = w1*(1/distance) + w2*availability + w3*rating + w4*capacity + w5*verification
```

The weights adapt for critical accidents, blood-bank needs, and night-time emergencies.

## ML Model

The India ambulance optimization pipeline predicts and plans ambulance placement.

Models used:
- **Random Forest**: predicts fast vs slow ambulance response.
- **K-means**: finds accident hotspot clusters.
- **Silhouette Analysis**: selects the best cluster count.
- **GMM and Agglomerative Clustering**: baseline comparison.
- **Distance Score**: checks accident-to-ambulance coverage.

Current no-key proxy run:
- Records: `23,715`
- RF accuracy: `85.4%`
- 5-fold CV accuracy: `85.0% ± 0.2%`
- Best clusters: `12`
- Optimized ambulance stations: `120`

## Run Locally

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend tests:

```bash
cd backend
npm install
npm test
```

ML no-key run:

```bash
python3 data_science/ambulance_optimizer.py --allow-demo
```

Real data run:

```bash
python3 data_science/ambulance_optimizer.py --input-csv path/to/real_india_accidents.csv
```

## Key Files

- `frontend/` - PWA app
- `backend/` - Azure Functions API
- `database/cosmos-seed.js` - seed database
- `data_science/ambulance_optimizer.py` - ML pipeline
- `data_science/results/INDIA_RESULTS.md` - model results
- `FINAL_EXPLANATION_DOCUMENT.md` - final project explanation


## Note

Live accident training needs a real traffic/EMS data source. Without an Azure Maps key or official EMS/108 dataset, the current hackathon run uses an explicitly marked no-key proxy dataset. The pipeline is ready to accept real CSV data when available.
