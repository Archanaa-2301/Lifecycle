LIFEX OEM page polish
=====================

Changes:
- Removed the global PageMasterStepper top bar from OEM selection page (page 35).
- Added a scalable vector LIFEX logo at public/lifex-logo.svg for crisp header display.
- Added vector OEM logo assets for Toyota, Ford, BMW, Honda and Tesla under public/oem-logos/.
- OEM selection cards now display manufacturer logos instead of plain wordmarks.
- Vehicle Overview OEM-to-vehicle panel now displays the selected manufacturer's logo.
- Retained the OEM -> vehicle -> vehicle overview navigation flow.

The original low-resolution LIFEX upload was 112 x 75 px. The new SVG is a clean
vector recreation of the visible logo design; it scales without pixelation. The
new SVG logo is an approximation, not an exact source-vector trace.

Run:
  npm install
  npm run dev

The ZIP has been integrity-tested. Build verification was not run because
node_modules is not present in this archive.
