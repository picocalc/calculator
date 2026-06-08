import { createSignal } from "solid-js";

interface Props {
  preciseMode: boolean;
  onPreciseToggle(checked: boolean): void;
  onCopy(): void;
}

function Header(props: Props) {
  const [copied, setCopied] = createSignal(false);

  function handleCopy() {
    props.onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div class="flex justify-between items-center mb-2">
      <span class="text-xs font-bold text-slate-500 tracking-widest uppercase">
        Calculator
      </span>
      <div class="flex items-center gap-4">
        <label class="flex items-center cursor-pointer gap-2">
          <span class="text-[10px] text-slate-400 uppercase tracking-tighter">
            Precise
          </span>
          <div class="relative">
            <input
              type="checkbox"
              checked={props.preciseMode}
              onChange={(e) => props.onPreciseToggle(e.currentTarget.checked)}
              class="sr-only peer"
            />
            <div class="w-7 h-4 bg-slate-700 rounded-full peer-checked:bg-emerald-600 transition-colors" />
            <div class="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-3" />
          </div>
        </label>
        <button
          onClick={handleCopy}
          class="cursor-pointer text-[10px] text-slate-400 hover:text-white border border-slate-700 px-2 py-1 rounded"
          type="button"
        >
          {copied() ? "COPIED" : "COPY"}
        </button>
      </div>
    </div>
  );
}

export default Header;
