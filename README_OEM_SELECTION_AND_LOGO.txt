LIFEX logo + OEM selection restoration
======================================

- The supplied LIFEX logo artwork is retained and provided as a 1200px-wide
  transparent PNG at public/assets/lifex-logo.png and public/lifex-brand.png.
- The shared PageMasterStepper now shows the LIFEX logo at the top-left.
- A dedicated OEM selection page has been added as page 35.
- Engineering Repository > Open Project Repository now opens OEM selection.
- Selecting an OEM stores it in the project preset and continues to page 5
  (vehicle selection).
- The Change OEM action on vehicle selection returns to page 35.

Run:
  npm install
  npm run dev

The archive is integrity-tested. A full browser build has not been run here.
