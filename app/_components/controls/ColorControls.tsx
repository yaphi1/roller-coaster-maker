import { CoasterColors } from "@/app/_utils/types";
import { ColorContext } from "@/app/page";
import { useContext } from "react";
import { produce } from 'immer';
import { defaultCoasterColors } from "@/app/_utils/defaults";

export default function ColorControls() {
  const colorContext = useContext(ColorContext);

  return (
    <div className="fixed z-10 left-0 top-0 bg-white/50 rounded-md p-2 m-2 text-slate-700">
      <div className="font-bold mb-1">
        Colors
      </div>
      <div className="flex gap-1">
        Coaster:
        <input type="color" value={colorContext?.coasterColors[0].train} onInput={(event) => {
          const nextColor = event.currentTarget.value;
          colorContext?.setCoasterColors(produce((draft) => {
            draft[0].train = nextColor;
          }));
        }} />
        
        Rails:
        <input type="color" value={colorContext?.coasterColors[0].rails} onInput={(event) => {
          const nextColor = event.currentTarget.value;
          colorContext?.setCoasterColors(produce((draft) => {
            draft[0].rails = nextColor;
          }));
        }} />

        Beams:
        <input type="color" value={colorContext?.coasterColors[0].scaffolding} onInput={(event) => {
          const nextColor = event.currentTarget.value;
          colorContext?.setCoasterColors(produce((draft) => {
            draft[0].scaffolding = nextColor;
          }));
        }} />

        <button className="p-2 bg-slate-200 shadow-md" onClick={() => {
          colorContext?.setCoasterColors(produce((draft) => {
            draft[0] = {...defaultCoasterColors};
          }));
        }}>
          Reset
        </button>
      </div>
    </div>
  );
}
