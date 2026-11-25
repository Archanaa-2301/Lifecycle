<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/26a92b88-1c3d-4fdb-b026-0f5e87ea8e33

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## LIFEX report repository storage

Run the application with `npm run dev`. The development server now serves the Vite frontend and the Express repository API on the same origin (`http://localhost:3000`). Generated PDFs are saved under `repository-data/<repository>/` with a JSON index beside each PDF. The Component Workspace repository panel reads the server records and provides View PDF and Download PDF actions.

The repository storage is local to the machine running this LIFEX server. For production, run `npm run build` followed by `npm start` with `NODE_ENV=production`. For a shared multi-user deployment, point the same API at a shared database/object store and persistent volume before production use. The bundled email and meeting records are illustrative sample data, not actual company correspondence or recordings.
