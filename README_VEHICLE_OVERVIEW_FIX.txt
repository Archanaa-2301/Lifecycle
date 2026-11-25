# LIFEX – Vehicle Overview visual correction

This is the same LIFEX project with a focused update to `src/pages/VehicleOverview3DPage.tsx` and `src/pages/VehicleOverview3DPage.css`. Other application pages and assets are retained.

## Run locally
1. Extract the ZIP.
2. Open the `LIFEX` folder in VS Code.
3. Open a terminal in that folder.
4. Run `npm install`
5. Run `npm run dev`

## Vehicle Overview changes
- Changed the procedural vehicle body finish to silver metallic and made the glazing lighter.
- Changed the default camera to a more front three-quarter view.
- Repositioned component labels and leader lines to reduce overlap.
- Increased the font sizes of the page heading, workflow, vehicle panel, component list and controls.
- Preserved the current interactive rotation, zoom, X-ray and exploded-view controls.

## Important limitation
The car is still a procedural Three.js approximation. It is not an authentic Toyota Innova CAD/GLB model. A genuinely model-accurate Innova requires a properly licensed detailed GLB/GLTF asset; this ZIP does not contain that asset. The changes above improve the existing model and UI but do not make it a factory-accurate Toyota model.

## Validation
The ZIP archive is CRC-tested. A full dependency install and browser build were not completed in this environment; run the commands above to validate in your local setup.
