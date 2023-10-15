import { TrackPath } from "../_utils/types";
import { Line } from "@react-three/drei";

export default function PathDebugger({ path } : { path: TrackPath }) {
  return (
    <Line
      points={path.getPoints()}
      color='red'
    />
  );
}
