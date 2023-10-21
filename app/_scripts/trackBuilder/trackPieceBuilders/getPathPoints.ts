import { Path } from "../../types";
import { desiredLengthBetweenPathPoints } from "../trackConstants";

export function getPathPoints(trackPath: Path) {
  const trackPathPointCount = Math.ceil(trackPath.getLength() / desiredLengthBetweenPathPoints);
  const trackPathPoints = trackPath.getSpacedPoints(trackPathPointCount);
  return trackPathPoints
}
