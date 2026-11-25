LIFEX WORKFLOW SELECTION ANIMATIONS

Included changes:
1. OEM selection: the selected OEM logo/name animates toward a left-side selection hierarchy before the app navigates to vehicle selection. OEM cards use the supplied SVG logo assets.
2. Vehicle selection: the left panel is now a live hierarchy. It shows the selected OEM, then animates the selected vehicle into the next hierarchy slot with a connecting arrow. Continue is enabled after a vehicle is selected.
3. Component workspace: the selected OEM and vehicle are read from the active project selection, and the hierarchy animates into view. The Knowledge Repository and Engineering Intelligence Extraction cards receive coordinated focus animations and animated directional indicators.
4. The supplied Rebound Bumper Design Rule PDF and existing LIFEX project assets are preserved.

Validation:
- ZIP archive integrity checked.
- Source-level TypeScript syntax checked. A full Vite build was not run because package installation timed out in this environment; install dependencies with npm ci before running npm run build.
