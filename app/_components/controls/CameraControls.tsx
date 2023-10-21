import { useContext, useId } from "react";
import { CameraContext, ModalContext } from "../App";

export default function CameraControls() {
  const modalId = useId();
  const modalContext = useContext(ModalContext);
  const isModalOpen = modalContext?.currentModal === modalId;
  const cameraContext = useContext(CameraContext);

  if (!cameraContext) { return (<></>); }
  const { cameraType, setCameraType } = cameraContext;

  return (
    <div className="bg-white/50 rounded-md p-2 m-2 ml-0 text-slate-700 relative">
      <div className="font-bold mb-1 flex justify-between items-center">
        <span>Camera</span>
        <span>
          <button
            aria-label="Camera info"
            title="Camera info"
            className="border border-slate-700 bg-white rounded-full text-xs w-4 h-4 flex justify-center items-center"
            onClick={() => { modalContext?.setCurrentModal(isModalOpen ? null : modalId) }}
            data-do-not-close-modal
          >
            <span>?</span>
          </button>
        </span>
      </div>
      <div className="flex gap-1">
        <button
          className={`bg-slate-200 shadow-md rounded-md p-2 hover:bg-yellow-200 disabled:bg-slate-700 disabled:text-slate-100`}
          onClick={() => { setCameraType('orbital') }}
          disabled={cameraType === 'orbital'}
        >
          Free
        </button>
        
        <button
          className={`bg-slate-200 shadow-md rounded-md p-2 hover:bg-yellow-200 disabled:bg-slate-700 disabled:text-slate-100`}
          onClick={() => { setCameraType('coasterFocus'); }}
          disabled={cameraType === 'coasterFocus'}
        >
          Focus
        </button>
        
        <button
          className={`bg-slate-200 shadow-md rounded-md p-2 hover:bg-yellow-200 disabled:bg-slate-700 disabled:text-slate-100`}
          onClick={() => { setCameraType('firstPerson') }}
          disabled={cameraType === 'firstPerson'}
        >
          Inside
        </button>
      </div>
      {isModalOpen && <CameraInfo />}
    </div>
  );
}

function CameraInfo() {
  return (
    <div
      data-do-not-close-modal
      className="absolute bottom-full right-0 mb-2 p-2 bg-slate-800 text-slate-200 rounded-md w-72"
    >
      <div className="text-3xl">
        Camera Info
      </div>

      <div className="mt-4 font-bold">
        Free Cam Controls
      </div>
      <ul className="list-disc list-inside">
        <li>
          Rotate: drag
        </li>
        <li>
          Move: cmd + drag
        </li>
        <li>
          Zoom: pinch or scroll
        </li>
      </ul>

      <div className="mt-4 font-bold">
        Focus Camera
      </div>
      <ul className="list-disc list-inside">
        <li>
          The focus camera will follow the roller coaster.
        </li>
      </ul>

      <div className="mt-4 font-bold">
        Inside Camera
      </div>
      <ul className="list-disc list-inside">
        <li>
        The inside camera gives a first-person view from in the roller coaster.
        </li>
      </ul>
    </div>
  );
}
