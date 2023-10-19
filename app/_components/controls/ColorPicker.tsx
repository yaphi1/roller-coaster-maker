import { ColorableItem } from "@/app/_utils/types";
import { ColorContext } from "../App";
import { produce } from "immer";
import { useContext } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

export default function ColorPicker({ coasterIndex, itemToRecolor, showTextInput = false }: {
  coasterIndex: number;
  itemToRecolor: ColorableItem;
  showTextInput?: boolean;
}) {
  const colorContext = useContext(ColorContext);
  const coasterColors = colorContext?.coasterColors[coasterIndex];
  const color = coasterColors?.[itemToRecolor];

  function setColor(nextColor: string) {
    colorContext?.setCoasterColors(produce((draft) => {
      draft[0][itemToRecolor] = nextColor;
    }));
  }

  return (
    <div>
      <HexColorPicker color={color} onChange={setColor} />
      {showTextInput && <HexColorInput color={color} onChange={setColor} />}
    </div>
  );
};
