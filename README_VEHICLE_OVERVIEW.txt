# LIFEX – Vehicle Overview visual correction

This update modifies the existing Vehicle Overview page in the supplied LIFEX project. Other application pages and navigation files are retained unchanged.

## Run
1. Extract the ZIP.
2. Open the `LIFEX` folder in VS Code.
3. Open a terminal in that folder.
4. Run:

```bash
npm install
npm run dev
```

## Vehicle Overview changes
- Silver metallic exterior paint instead of the bright blue selected-body appearance.
- More MPV-like cabin profile, visible side glazing, wheel trim and improved front/rear details.
- Component markers repositioned around the model with separate label offsets and leader lines to reduce overlap.
- Selected Body & Structure no longer turns the entire exterior blue.
- Improved camera angle for a front three-quarter presentation.
- Larger, more consistent typography across the Vehicle Overview page.
- Existing drag rotation, zoom, reset, X-Ray, Exploded and component selection interactions retained.

## Model accuracy note
The included vehicle remains a procedural Three.js approximation. It is not Toyota's production CAD model and is not guaranteed to match the exact Innova Crysta exterior or internal component geometry. A properly licensed, detailed Innova GLB/GLTF asset is required for a production-accurate model and exact component placement.

## Validation
The updated TSX passed TypeScript transpilation syntax checks and the ZIP archive passed CRC integrity testing. A full Vite build was not run because the project dependencies are not installed in this environment.
