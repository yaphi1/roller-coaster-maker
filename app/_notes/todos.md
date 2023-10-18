# TODO:
  - add shareable url params for tracks
  - undo/redo
  - add loop-the-loops
  - allow multiple coasters
  - use tile-based collision to enable other roller coasters, paths, etc









## Discarded todos with reasons why (so I don't do them again)

  - consider doing rendering for track rather than per piece
    - this would allow more ambitious curves because the Frenet-Serret frames would be correct like with the coaster train
    - update: I tried it and there are problems
      - The frenet frames are different than the coaster's orientation because the coaster uses lookAt with an up direction of y. As a result, we can get unwanted twists in our curves.
      - The rendering assumes all the track pieces are the same design. It doesn't allow for station pieces, for example.
