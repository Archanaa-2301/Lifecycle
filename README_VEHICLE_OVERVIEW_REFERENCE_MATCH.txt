# LIFEX – Vehicle Overview reference-matched update

This archive preserves the existing LIFEX application and updates the Toyota Innova
Vehicle Overview page to match the user's supplied reference screenshot.

## Vehicle Overview updates
- Removed the embedded Sketchfab iframe and its grey viewer background.
- Added a high-resolution silver Toyota Innova Crysta engineering cutaway image
  (`public/images/innova-cutaway-highres.png`).
- Added blue component pins, labels and connector lines over the vehicle.
- Added Fuel System and Exhaust System to the component panel (10 systems total).
- Kept the Toyota OEM logo, Innova vehicle selection, white/blue page layout,
  page navigation and component selection panel.
- Added image zoom controls, gentle auto-tilt and pointer-drag perspective tilt.

## Important interaction limitation
The new Toyota cutaway is a high-resolution rendered image, not a rotatable 3D mesh.
Drag provides a limited perspective tilt; it does not provide a true 360-degree orbit.
The X-Ray and Exploded controls apply visual presentation effects to the render; they
do not physically separate or animate CAD components. A licensed Innova GLB/GLTF
model with named component meshes is required for true 360-degree rotation and
engineering-accurate exploded/X-ray interactions.

## Run
1. Extract the ZIP.
2. Open the `LIFEX` folder in VS Code.
3. Run `npm install`.
4. Run `npm run dev`.

The ZIP archive has been CRC-tested. A full Vite browser build could not be run in
this environment because dependencies were not installed successfully.
