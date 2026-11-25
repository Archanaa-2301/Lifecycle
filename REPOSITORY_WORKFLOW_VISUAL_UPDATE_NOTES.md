# LIFEX Repository Workflow + Visual Update

## Included in this update

- Global Repository > Knowledge Management now shows image-led cards for all 11 vehicle-system categories.
- System card images are realistic automotive component illustrations stored locally in `public/vehicle-systems/`.
- Powertrain component image mappings and existing repository PDF data are preserved.
- Component Workspace now uses a realistic rebound-bumper product image (`public/rebound-bumper-real.webp`) instead of the schematic illustration for Rebound Bumper.
- The standalone Manual Entry card has been removed from Component Workspace.
- Selecting any of the four Knowledge Repository categories opens that repository inline, showing its PDF documents and Manual Entry choices together.
- Manual Entry options remain: RFI, RFQ, Design / Development Update, and Engineering Decision / Approval.
- Manual Entry saves the generated PDF against the selected repository and current component context.
- Engineering Intelligence Extraction component and its navigation were not changed.
- Existing project repository and vehicle-selection workflow files were left in place.

## Run locally

```bash
npm install
npm run dev
```

The system/component imagery is stored locally under `public/`; no external image URLs are required at runtime.
