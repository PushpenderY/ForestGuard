This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Multi-Model Forest Fire Prediction

ForestGuard keeps its original JavaScript rule-based risk score and adds a separate machine-learning comparison module.

### ML models
- Decision Tree
- Random Forest
- Logistic Regression

The same environmental input is sent to all three models through a FastAPI service. Each model returns its own Fire/No Fire classification, estimated fire probability and risk band. The original JavaScript prediction remains available separately.

### Run the ML service locally
1. Download the cleaned dataset from the ForestGuard ML starter bundle and place it at `ml-service/data/forest_fire_environmental_dataset_clean.csv`.
2. Follow the setup instructions in [ml-service/README.md](ml-service/README.md).
3. Start the FastAPI server on port 8000.
4. Start the Next.js app with `npm run dev`.
5. In the Fire Risk Predictor, enter environmental conditions and select **Run all ML models**.

### Dataset and model limitations
The supplied dataset is synthetic and imbalanced. The ML predictions are an educational demonstration and must not be used as real-world wildfire warnings. The probability outputs are uncalibrated model estimates; real deployment would require validated historical fire observations, geographically and temporally independent testing, probability calibration and operational monitoring.
