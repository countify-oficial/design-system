# @countify-oficial/icons-tabler

## 0.1.0

### Minor Changes

- 6b9d730: Tabler Icons (MIT, `@tabler/icons` 3.52.0) in the design system. The new `@countify-oficial/icons-tabler` package ships
  all 5,491 outline and 1,054 filled SVGs unmodified, with the Tabler LICENSE and a manifest. `Icon` keeps the Countify
  set for its names and draws any other name from Tabler, with `variant="outline" | "filled"`. Tabler icons use
  `currentColor`, the icon-size tokens and the Countify stroke token (`iconGrid.stroke`). On the web each Tabler icon is
  loaded on demand, one module per icon. On React Native the icons are bundled and only read when used.
