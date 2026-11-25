LIFEX brand update
==================

The supplied LIFEX logo was recolored in navy/electric blue, its white background
was made transparent, and it was upscaled for use in application headers.

Both shared assets were replaced:
- public/lifex-brand.png
- public/assets/lifex-logo.png

A shared CSS rule applies a consistent 150 x 62 px logo size to pages using either
asset, including the Vehicle Overview page. Existing page layouts and project
source are retained.

Run:
  npm install
  npm run dev

ZIP integrity is checked. A full browser build has not been verified here.
