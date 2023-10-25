import { CoasterColors, PieceType } from "./types";
import debounce from 'debounce';

const trackEncodingMap: Record<PieceType, string> = {
  straight: 's',
  right: 'r',
  left: 'l',
  up: 'u',
  down: 'd',
  loop_left: 'o',
  loop_right: 'p',
};

const trackDecodingMap = (() => {
  const map: Record<string, PieceType> = {};
  Object.entries(trackEncodingMap).map(([key, value]) => {
    map[value] = key as PieceType;
  });
  return map;
})();

export function stripHexHashes(coasterColors: CoasterColors) {
  const result: Record<string, string> = {};
  Object.entries(coasterColors).forEach(([key, value]) => {
    result[key] = value.slice(1);
  });

  return result;
}

export function encodeTrack(trackPieces: PieceType[]) {
  const encodedString = trackPieces.map(pieceType => trackEncodingMap[pieceType]).join('');
  return encodedString;
}

export function decodeTrack(encodedString: string) {
  const decodedPieces = encodedString.split('').map(pieceType => trackDecodingMap[pieceType]);
  return decodedPieces;
}

export const updateHash = debounce((paramString: string) => {
  window.location.hash = paramString;
}, 500);

export const produceValidColor = (color: string | null) => {
  const defaultResult = 'ffffff';
  if (!color) { return defaultResult; }
  const validHexPattern = (/^[a-f0-9]{6}$/i);
  const isValidHex = (validHexPattern).test(color);
  return isValidHex ? color : defaultResult;
};

export const produceValidTrackPieceCodes = (encodedPieces: string | null) => {
  const defaultResult = 'sss';
  if (!encodedPieces) { return defaultResult; }
  const invalidCodes = (/[^srludop]/ig);
  const result = encodedPieces.replace(invalidCodes, '');
  return result.length >= 3 ? result : defaultResult;
};
