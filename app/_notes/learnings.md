
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
  - The reason JS seems to mess up 0.1 + 0.2 (says it's 0.30000000000000004) of the binary result of the calculation. For example, base 10 produces repeating decimals for numbers that have no prime factors of 10 (e.g. 3). Similarly, binary has repeating decimals for things it can't express precisely. JS is accurately representing the computer even if it's not accurately representing the math.

Hooks shouldn't be conditionally added to a function or else you'll get errors.
  In an updateCamera function...
    I had an early return if cameraType was a certain value and then I had this line afterwards:
      const camera = useThree().camera;
    If the early return happened, react would miss the hook and blow up.

Remember to use useMemo if you want a similar situation to useEffect but you want the resulting values to be available outside the hook.
  - But if it requires an external call or a wait for something to load, use useEffect and then setState
  - Update: I've been misusing useMemo when I really want a useEffect + setState combo

If you want a list of object keys to be their own type, you can do something like this:
  ```javascript
  export type ColorableItem = 'train' | 'rails' | 'scaffolding';
  export type CoasterColors = Record<ColorableItem, string>;
  ```
  That way, you don't have to have two sources of truth for the keys.

In three.js, a 3d object's lookAt treats the negative z-axis as the face of the object.
  - Easy way to remember this: negative z is forward from my viewpoint as a user
  - The default .up value is the positive y axis

Refs can't be set in a loop since useRef hooks need to run in a guaranteed order. To set refs dynamically in a loop, use one ref with an array inside.

Don't overuse refs! If it can be expressed as a prop, don't use a ref.
  - Source: https://react.dev/reference/react/forwardRef (cmd + f "Pitfalls")
