import { Dispatch, SetStateAction, useContext, useId } from "react";
import { ModalContext } from "../App";

export default function GeneralControls({ isUiVisible, setIsUiVisible }: {
  isUiVisible: boolean,
  setIsUiVisible: Dispatch<SetStateAction<boolean>>,
}) {
  const modalId = useId();
  const modalContext = useContext(ModalContext);
  const isModalOpen = modalContext?.currentModal === modalId;

  return (
    <div className="bg-white/50 rounded-md p-2 m-2 ml-0 text-slate-700 relative">
      <div className="font-bold mb-1 flex justify-between items-center">
        <span>General</span>
      </div>
      <div className="flex gap-1">
        <button
          className={`bg-slate-200 shadow-md rounded-md p-2 hover:bg-yellow-200 disabled:bg-slate-700 disabled:text-slate-100`}
          onClick={() => { setIsUiVisible(!isUiVisible) }}
        >
          Toggle UI
        </button>
        
        <button
          className={`bg-slate-200 shadow-md rounded-md p-2 hover:bg-yellow-200 disabled:bg-slate-700 disabled:text-slate-100`}
          onClick={() => { modalContext?.setCurrentModal(isModalOpen ? null : modalId) }}
          data-do-not-close-modal
        >
          About
        </button>
      </div>
      {isModalOpen && <About />}
    </div>
  );
}

function About() {
  return (
    <div
      data-do-not-close-modal
      className="absolute top-full right-0 mt-2 p-2 bg-slate-800 text-slate-200 rounded-md w-72"
    >
      <div className="text-3xl">
        Roller Coaster Maker
      </div>

      <div className="mt-4">
        Author: <a target="_blank" className="underline text-yellow-400 hover:text-yellow-100" href="https://twitter.com/yaphi1">@yaphi1</a>
      </div>
      <div className="mt-4">
        Code: <a target="_blank" className="underline text-yellow-400 hover:text-yellow-100" href="https://github.com/yaphi1/roller-coaster-maker">[GitHub link]</a>
      </div>
      <div className="mt-4">
        Music: <a target="_blank" className="underline text-yellow-400 hover:text-yellow-100" href="https://www.youtube.com/watch?v=ei7cpY0Bf4s">[YouTube link]</a>
      </div>
      <div className="mt-4">
        Inspiration: <a target="_blank" className="underline text-yellow-400 hover:text-yellow-100" href="https://en.wikipedia.org/wiki/RollerCoaster_Tycoon">RollerCoaster Tycoon</a>
      </div>
    </div>
  );
}
