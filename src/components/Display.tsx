import type { JSX } from "solid-js";

interface Props {
  history: string;
  preview: { ok: true; value: string } | { ok: false; error: string } | null;
  setDisplayRef(el: HTMLDivElement): void;
}

function Display(props: Props) {
  const previewJsx = (): JSX.Element => {
    const p = props.preview;
    if (!p) return null;
    if (p.ok) return <span class="text-slate-400">= {p.value}</span>;
    return <span class="text-rose-400">{p.error}</span>;
  };

  return (
    <div class="display-container bg-black/40 p-4 rounded-xl border border-white/5">
      <div class="text-slate-500 text-xs h-5 mb-1 overflow-hidden text-ellipsis whitespace-nowrap w-full text-left">
        {props.history}
      </div>
      <div
        ref={props.setDisplayRef}
        contenteditable="plaintext-only"
        spellcheck={false}
        class="main-display"
      >
        0
      </div>
      <div class="text-right text-xs h-5 overflow-hidden text-ellipsis whitespace-nowrap border-t border-white/5 mt-1 pt-1">
        {previewJsx()}
      </div>
    </div>
  );
}

export default Display;
