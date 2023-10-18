import { Path } from "../_utils/types";
import { Line } from "@react-three/drei";

export default function PathDebugger({ path } : { path: Path }) {
  return (
    <Line
      points={path.getPoints()}
      color='red'
    />
  );
}
