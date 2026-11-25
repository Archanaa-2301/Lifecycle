LIFEX – Corrected OEM selection and Toyota Innova vehicle viewer
===============================================================

This update uses the user's latest uploaded LIFEX ZIP as its base.

Changes:
- Toyota Innova vehicle overview now embeds a genuine Silver Toyota Innova Crysta
  3D model from Sketchfab, rather than the old primitive/procedural Three.js car.
- The embedded model can be rotated and zoomed with pointer/touch controls in
  the Sketchfab viewer. Internet access is required.
- Model attribution: Mind Illusion, Sketchfab, CC Attribution license:
  https://sketchfab.com/3d-models/silver-toyota-innova-crysta-1e116ec328854156beac719ac051a472
- OEM page CSS hides the global dark Page Navigation strip.
- Existing OEM vector logos, LIFEX logo, OEM selection route and other pages retained.

Important limitations:
- The Sketchfab model is an exterior 3D asset; it does not expose named engine,
  transmission, brake or suspension meshes to this application.
- The existing component panel remains available for selecting engineering systems,
  but X-Ray/exploded engineering cutaways and mesh-anchored hotspots are not
  claimed for this external model.
- Internet access is required to load the embedded 3D model.

Run:
  npm install
  npm run dev

ZIP integrity was tested. A full local browser build was not completed.
