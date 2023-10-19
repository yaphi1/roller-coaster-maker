import { ColorContext } from '../App';
import { useContext } from "react";
import { produce } from 'immer';
import { defaultCoasterColors } from "@/app/_utils/defaults";
import ColorButton from "./ColorButton";

export default function ColorControls() {
  const colorContext = useContext(ColorContext);

  return (
    <div className="fixed z-10 left-0 top-0 bg-white/50 rounded-md p-2 m-2 text-slate-700">
      <div className="font-bold mb-1">
        Colors
      </div>
      <div className="flex gap-1">
        <ColorButton label={'Train'} coasterIndex={0} itemToRecolor={'train'} />
        <ColorButton label={'Rails'} coasterIndex={0} itemToRecolor={'rails'} />
        <ColorButton label={'Beams'} coasterIndex={0} itemToRecolor={'scaffolding'} />

        <button className="bg-slate-200 shadow-md rounded-md p-2 hover:bg-yellow-200" onClick={() => {
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
