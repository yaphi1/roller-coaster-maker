import { useContext, useId } from "react";
import ColorPicker from "./ColorPicker";
import { ColorContext, ModalContext } from "../App";
import { ColorableItem } from "@/app/_scripts/types";

export default function ColorButton({ label, coasterIndex, itemToRecolor }: {
  label: string;
  coasterIndex: number;
  itemToRecolor: ColorableItem;
}) {
  const modalId = useId();
  const colorContext = useContext(ColorContext);
  const coasterColors = colorContext?.coasterColors[coasterIndex];
  const color = coasterColors?.[itemToRecolor];
  const circleSize = '16px';

  const modalContext = useContext(ModalContext);
  const isModalOpen = modalContext?.currentModal === modalId;

  return (
    <div className="relative">
      <button
        className="flex items-center bg-slate-200 shadow-md rounded-md p-2 hover:bg-yellow-200"
        onClick={() => { modalContext?.setCurrentModal(isModalOpen ? null : modalId) }}
        data-do-not-close-modal
      >
        <div className="pr-2">{label}</div>
        <div
          className="border border-slate-300 shadow-md"
          style={{ backgroundColor: color, width: circleSize, height: circleSize, borderRadius: '50%' }}
        ></div>
      </button>
      {isModalOpen && (
        <div data-do-not-close-modal className="absolute top-full left-0 mt-2">
          <ColorPicker coasterIndex={0} itemToRecolor={itemToRecolor} />
        </div>
      )}
    </div>
  );
};
