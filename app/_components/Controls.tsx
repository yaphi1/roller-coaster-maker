export default function Controls() {
  return (
    <div className="fixed z-10 left-0 bottom-0 bg-white/50 rounded-md p-2 m-2">
      Controls
      <div className="flex gap-1">
        <button className="bg-slate-200 rounded-md p-2">Rise</button>
        <button className="bg-slate-200 rounded-md p-2">Dive</button>
        <button className="bg-slate-200 rounded-md p-2">Forward</button>
        <button className="bg-slate-200 rounded-md p-2">Left</button>
        <button className="bg-slate-200 rounded-md p-2">Right</button>
        <button className="bg-slate-200 rounded-md p-2">Delete</button>
        <button className="bg-slate-200 rounded-md p-2">Play</button>
      </div>
    </div>
  );
}
