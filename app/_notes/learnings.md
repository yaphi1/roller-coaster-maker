
When typing a ref:
  - Use a `RefObject` instead of `Ref` otherwise you'll get an error that `.current` isn't available. That's because the `Ref` type corresponds to the old way of making a ref (where the ref is a function) whereas `RefObject` corresponds to the newer useRef, which outputs an object with a `.current` property.
  - Initialize with a `starter value` or `null` instead of leaving `undefined` to avoid an error

If importing THREE.js fails, remember to import three.js types via something like `pnpm i @types/three`

Need to get tangent and perpendiculars to a wild, curved path?
  - `Frenet-Serret frames` are a lifesaver
  - Especially useful for things like walls, rails, beams, and stripes along a curved path
  - References:
    - General info: https://en.wikipedia.org/wiki/Frenet%E2%80%93Serret_formulas
    - Using in THREE.js: https://threejs.org/docs/#api/en/extras/core/Curve.computeFrenetFrames

With precise calculations remember to watch out for rounding errors
  - A track orientation bug surfaced with this layout: L, R, R, S, L
