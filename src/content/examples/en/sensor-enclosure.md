---
ref: enclosure
lang: en
kind: scenario
order: 4
featured: false
title: An enclosure for a sensor device
summary: A hardware startup needs a housing for a greenhouse humidity sensor that looks good and survives in the field.
illustration: enclosure
services: [design, 3d-printing, laser]
input: A STEP file of the PCB, connector positions and a description of where it will hang (humid, sunny).
iterations:
  - v: v1
    note: PETG box with a snap-fit lid. The board fits, but the USB connector hits the wall.
  - v: v2
    note: Connector opening fixed, vent grille added. The snap-fit tabs break after a few openings.
  - v: v3
    note: Screw bosses instead of tabs and a TPU gasket under the lid; ASA recommended for outdoor use.
result: A small batch for a pilot installation, with the device ID laser-engraved on the lid.
---
