# TODO:
  - add loop-the-loops
    - compute upward vectors
    - smooth the loops
    - flatten the loop endings
  - add url param validation
  - undo/redo
  - add other pieces: station, chain lift
  - allow multiple coasters? (maybe not, now that shareable urls are tied to one coaster)
  - use tile-based collision to enable other roller coasters, paths, etc









## Discarded todos with reasons why (so I don't do them again)

  - consider doing rendering for track rather than per piece
    - this would allow more ambitious curves because the Frenet-Serret frames would be correct like with the coaster train
    - update: I tried it and there are problems
      - The frenet frames are different than the coaster's orientation because the coaster uses lookAt with an up direction of y. As a result, we can get unwanted twists in our curves.
      - The rendering assumes all the track pieces are the same design. It doesn't allow for station pieces, for example.
