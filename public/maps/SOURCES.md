# Map reference imagery

Source: [CERN MapCERN](https://maps.cern.ch/), public ORTHOPHOTO map service. Retrieved 2026-10-01 for this local demo. Imagery date varies by coverage; this is not a live map.

- [Overview export](https://maps.cern.ch/arcgis/rest/services/Fonds/ORTHOPHOTO/MapServer/export?bbox=671961.5931097161%2C5817463.134806459%2C675161.5931097161%2C5820663.134806459&bboxSR=3857&imageSR=3857&size=1024%2C1024&format=jpg&f=image) — 1024 × 1024, EPSG:3857 extent 671961.5931097161, 5817463.134806459, 675161.5931097161, 5820663.134806459.
- [C4 export](https://maps.cern.ch/arcgis/rest/services/Fonds/ORTHOPHOTO/MapServer/export?bbox=673561.5931097161%2C5817463.134806459%2C674361.5931097161%2C5818263.134806459&bboxSR=3857&imageSR=3857&size=1600%2C1600&format=jpg&f=image) — 1600 × 1600, EPSG:3857 extent 673561.5931097161, 5817463.134806459, 674361.5931097161, 5818263.134806459.

C4 is column 3, row 4 of the 4 × 4 overview; its high-resolution image is a separate export of the same geographic extent, not an enlargement of a low-resolution crop.

Attribution: © CERN · MapCERN. These temporary reference assets are separate from the site's AGPL source-code license. The service metadata does not declare a reuse license; public availability is not a grant of unrestricted redistribution rights. Confirm reuse terms before any release containing these map images.

The 16 sectors and A/B/C labels are site navigation overlays, not official CERN sectors. Markers use WGS84 coordinates from the public MapCERN building geocoder, projected into the EPSG:3857 image extent. See [coordinate responses](building-locations.json), retrieved 2026-10-01. A = Globe (80), B = IdeaSquare (3179), C = Synchrocyclotron (300).
